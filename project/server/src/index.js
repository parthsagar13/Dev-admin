import 'dotenv/config';
import app from './app.js';
import { bootstrap } from './bootstrap.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  await bootstrap();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
