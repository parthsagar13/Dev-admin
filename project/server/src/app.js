import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { bootstrap } from './bootstrap.js';
import authRoutes from './routes/authRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import downloadRoutes from './routes/downloadRoutes.js';
import downloadsRoutes from './routes/downloadsRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { handleWebhook } from './controllers/paymentController.js';
import { servePreview } from './controllers/previewController.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    frameguard: false,
  })
);

app.use(cors());

app.use(compression());
app.use(morgan('dev'));

app.post(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' }),
  (req, _res, next) => {
    req.rawBody = req.body;
    try {
      req.body = JSON.parse(req.body.toString());
    } catch {
      req.body = {};
    }
    next();
  },
  handleWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  try {
    await bootstrap();
    next();
  } catch (err) {
    next(err);
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/download', downloadRoutes);
app.use('/api/downloads', downloadsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.get(/^\/api\/preview\/([^/]+)(?:\/(.*))?$/, servePreview);
app.use('/api/templates', templateRoutes);

app.use(errorHandler);

export default app;
