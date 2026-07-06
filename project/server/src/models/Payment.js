import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template', required: true },
    gateway: { type: String, default: 'razorpay' },
    gatewayPaymentId: { type: String, sparse: true, index: true },
    gatewayOrderId: { type: String, sparse: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    response: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
