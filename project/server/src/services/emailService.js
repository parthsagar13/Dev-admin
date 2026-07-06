import crypto from 'crypto';

/**
 * Email service placeholders — integrate SendGrid, Resend, AWS SES, etc.
 */

export const sendPurchaseConfirmationEmail = async ({ user, template, order }) => {
  console.log('[Email] Purchase confirmation (placeholder)', {
    to: user.email,
    template: template.title,
    orderId: order._id,
    invoiceNumber: order.invoiceNumber,
  });
  return { sent: false, placeholder: true };
};

export const sendInvoiceEmail = async ({ user, order, template }) => {
  console.log('[Email] Invoice (placeholder)', {
    to: user.email,
    invoiceNumber: order.invoiceNumber,
    amount: order.amount,
    template: template?.title,
  });
  return { sent: false, placeholder: true };
};

export const sendForgotPasswordEmail = async ({ user, resetUrl }) => {
  console.log('[Email] Forgot password (placeholder)', {
    to: user.email,
    resetUrl,
  });
  return { sent: false, placeholder: true };
};

export const generateResetToken = () => crypto.randomBytes(32).toString('hex');

export const hashResetToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');
