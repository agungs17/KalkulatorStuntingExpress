import configEnv from './src/configurations';
import app from './src/server';

const port = configEnv.port || 3000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

export const config = {
  runtime: configEnv?.runtime || 'nodejs18.x'
};