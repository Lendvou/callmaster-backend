import logger from './logger';
import app from './app';
import { ExpressPeerServer } from 'peer';

const port = app.get('port');
const server = app.listen(port);

const peerServer = ExpressPeerServer(server, { path: '/' });
app.use('/peerjs', peerServer);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info(
    'Feathers application started on http://%s:%d',
    app.get('host'),
    port
  )
);
