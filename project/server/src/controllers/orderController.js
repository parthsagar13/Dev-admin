import { Order } from '../models/Order.js';

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('template')
      .sort({ createdAt: -1 });

    const items = orders.map((o) => ({
      id: o._id,
      amount: o.amount,
      currency: o.currency,
      status: o.status,
      invoiceNumber: o.invoiceNumber,
      paymentMethod: o.paymentMethod,
      createdAt: o.createdAt,
      template: o.template
        ? {
            id: o.template._id,
            title: o.template.title,
            slug: o.template.slug,
            thumbnailUrl: o.template.thumbnailUrl,
            price: o.template.price,
            isFree: o.template.isFree,
          }
        : null,
    }));

    res.json(items);
  } catch (err) {
    next(err);
  }
};
