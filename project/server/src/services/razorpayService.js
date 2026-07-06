import Razorpay from 'razorpay';
import crypto from 'crypto';

let razorpayInstance = null;

const getRazorpay = () => {
  if (!razorpayInstance) {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials are not configured');
    }
    razorpayInstance = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return razorpayInstance;
};

/** Razorpay receipt max length is 40 characters. */
export const generateReceipt = (templateId) => {
  const suffix = String(templateId).slice(-8);
  const stamp = Date.now().toString(36);
  return `tpl_${suffix}_${stamp}`.slice(0, 40);
};

export const createRazorpayOrder = async ({ amount, currency = 'INR', receipt, notes = {} }) => {
  const razorpay = getRazorpay();
  const amountInPaise = Math.round(amount * 100);
  const safeReceipt = receipt ? String(receipt).slice(0, 40) : generateReceipt(notes.templateId || 'order');

  return razorpay.orders.create({
    amount: amountInPaise,
    currency,
    receipt: safeReceipt,
    notes,
  });
};

export const verifyPaymentSignature = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
  return expected === razorpaySignature;
};

export const verifyWebhookSignature = (rawBody, signature) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return expected === signature;
};

export const getRazorpayKeyId = () => process.env.RAZORPAY_KEY_ID || '';
