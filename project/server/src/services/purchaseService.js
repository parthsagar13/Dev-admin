import { Download } from '../models/Download.js';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { Template } from '../models/Template.js';
import { sendInvoiceEmail, sendPurchaseConfirmationEmail } from './emailService.js';

const generateInvoiceNumber = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `INV-${y}${m}-${rand}`;
};

export const hasPurchaseAccess = async (userId, templateId) => {
  const download = await Download.findOne({ user: userId, template: templateId });
  return !!download;
};

export const grantDownloadAccess = async ({ userId, templateId, orderId = null }) => {
  const existing = await Download.findOne({ user: userId, template: templateId });
  if (existing) return existing;

  return Download.create({
    user: userId,
    template: templateId,
    order: orderId,
    downloadCount: 0,
  });
};

export const completePurchase = async ({
  user,
  template,
  order,
  razorpayPaymentId,
  razorpaySignature,
  paymentMethod,
  gatewayResponse,
}) => {
  order.status = 'paid';
  order.razorpayPaymentId = razorpayPaymentId;
  order.razorpaySignature = razorpaySignature;
  order.paymentMethod = paymentMethod || 'razorpay';
  if (!order.invoiceNumber) {
    order.invoiceNumber = generateInvoiceNumber();
  }
  await order.save();

  const payment = await Payment.findOneAndUpdate(
    { order: order._id },
    {
      user: user._id,
      order: order._id,
      template: template._id,
      gateway: 'razorpay',
      gatewayPaymentId: razorpayPaymentId,
      gatewayOrderId: order.razorpayOrderId,
      amount: order.amount,
      status: 'paid',
      response: gatewayResponse,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await grantDownloadAccess({
    userId: user._id,
    templateId: template._id,
    orderId: order._id,
  });

  await Template.findByIdAndUpdate(template._id, { $inc: { purchaseCount: 1 } });

  await sendPurchaseConfirmationEmail({ user, template, order });
  await sendInvoiceEmail({ user, order, template });

  return { order, payment };
};

export const completeFreeClaim = async ({ user, template }) => {
  let order = await Order.findOne({
    user: user._id,
    template: template._id,
    status: 'paid',
    amount: 0,
  });

  if (!order) {
    order = await Order.create({
      user: user._id,
      template: template._id,
      amount: 0,
      currency: 'INR',
      status: 'paid',
      invoiceNumber: generateInvoiceNumber(),
      paymentMethod: 'free',
    });

    await Payment.create({
      user: user._id,
      order: order._id,
      template: template._id,
      gateway: 'free',
      amount: 0,
      status: 'paid',
      response: { type: 'free_claim' },
    });

    await Template.findByIdAndUpdate(template._id, { $inc: { purchaseCount: 1 } });
  }

  await grantDownloadAccess({
    userId: user._id,
    templateId: template._id,
    orderId: order._id,
  });

  return order;
};

export const getTemplateZipPath = (template) =>
  template.zipPath || `source/${template.slug}.zip`;

export { generateInvoiceNumber };
