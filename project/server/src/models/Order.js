import mongoose from 'mongoose';

const ORDER_STATUSES = ['pending', 'paid', 'failed', 'refunded', 'cancelled'];

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ORDER_STATUSES, default: 'pending', index: true },
    invoiceNumber: { type: String, unique: true, sparse: true },
    razorpayOrderId: { type: String, sparse: true, index: true },
    razorpayPaymentId: { type: String, sparse: true },
    razorpaySignature: { type: String, sparse: true },
    paymentMethod: { type: String },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, template: 1 });

export const Order = mongoose.model('Order', orderSchema);
export { ORDER_STATUSES };
