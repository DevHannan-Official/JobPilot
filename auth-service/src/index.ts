import app from './app.js';
import { ENV } from './lib/env.js';

const PORT = ENV.ROOT_PORT;

app.listen(PORT, () => {
  console.log(`Auth Service is running on port ${PORT}`);
});
