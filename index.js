import configEnv from './src/configurations';
import app from './src/server';

const port = configEnv.port || 3000;

if (configEnv.nodeEnv === 'dev') {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

// for serverless vercel
export default function handler(req, res) {
  return app(req, res);
}