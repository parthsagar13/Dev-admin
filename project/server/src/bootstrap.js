import { connectDB } from './config/db.js';
import { seedDefaultAdmin } from './utils/seedAdmin.js';

let initialized = false;

/** Connect DB once per serverless instance (or at local startup). */
export const bootstrap = async () => {
  if (initialized) return;
  await connectDB();
  await seedDefaultAdmin();
  initialized = true;
};
