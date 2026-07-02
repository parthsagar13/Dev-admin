import bcrypt from 'bcrypt';
import { Admin } from '../models/Admin.js';

const DEFAULT_EMAIL = 'admin@codemarket.ai';
const DEFAULT_PASSWORD = 'Admin@123';

export const seedDefaultAdmin = async () => {
  const existing = await Admin.findOne({ email: DEFAULT_EMAIL });
  if (existing) return;

  const hashed = await bcrypt.hash(DEFAULT_PASSWORD, 12);
  await Admin.create({ email: DEFAULT_EMAIL, password: hashed });
  console.log(`Default admin created: ${DEFAULT_EMAIL}`);
};
