import app from './app.js';
import { ENV } from './lib/env.js';

const PORT = ENV.ROOT_PORT;

app.listen(PORT, () => {
  console.log(`API Gateway is running on port ${PORT}`);
});
