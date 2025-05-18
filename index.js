import { createServer } from './src/server';
import config from './src/configurations';

const app = createServer();

const port = config.port || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});