import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { Download } from '../models/Download.js';
import { User } from '../models/User.js';
import { Template } from '../models/Template.js';

export const getAdminOrders = async (_req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('template', 'title slug price')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const getAdminPayments = async (_req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate('template', 'title slug')
      .populate('order')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(payments);
  } catch (err) {
    next(err);
  }
};

export const getAdminDownloads = async (_req, res, next) => {
  try {
    const downloads = await Download.find()
      .populate('user', 'name email')
      .populate('template', 'title slug')
      .sort({ lastDownloadAt: -1 })
      .limit(100);

    res.json(downloads);
  } catch (err) {
    next(err);
  }
};

export const getAdminCustomers = async (_req, res, next) => {
  try {
    const customers = await User.find().select('name email createdAt').sort({ createdAt: -1 });

    const withStats = await Promise.all(
      customers.map(async (customer) => {
        const orderCount = await Order.countDocuments({ user: customer._id, status: 'paid' });
        const totalSpent = await Order.aggregate([
          { $match: { user: customer._id, status: 'paid' } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        return {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          createdAt: customer.createdAt,
          orderCount,
          totalSpent: totalSpent[0]?.total || 0,
        };
      })
    );

    res.json(withStats);
  } catch (err) {
    next(err);
  }
};

export const getCommerceDashboardStats = async (_req, res, next) => {
  try {
    const [
      totalRevenue,
      totalOrders,
      paidOrders,
      totalDownloads,
      templatesSold,
      customers,
      totalTemplates,
      latestTemplates,
    ] = await Promise.all([
      Order.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      Order.countDocuments(),
      Order.countDocuments({ status: 'paid' }),
      Download.aggregate([{ $group: { _id: null, total: { $sum: '$downloadCount' } } }]),
      Template.aggregate([{ $group: { _id: null, total: { $sum: '$purchaseCount' } } }]),
      User.countDocuments(),
      Template.countDocuments(),
      Template.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      paidOrders,
      totalDownloads: totalDownloads[0]?.total || 0,
      templatesSold: templatesSold[0]?.total || 0,
      customers,
      totalTemplates,
      latestTemplates,
    });
  } catch (err) {
    next(err);
  }
};
