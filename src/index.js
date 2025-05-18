import { createServer } from './server';
import config from './configurations/index';

const app = createServer();

const port = config.port || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
