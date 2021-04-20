import http from 'http';
import app from './app';

const server = http.createServer(app);
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'developement';

server.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const { port } = server.address();
  console.log(`> Ready on port: ${port} env - ${NODE_ENV}`);
});
