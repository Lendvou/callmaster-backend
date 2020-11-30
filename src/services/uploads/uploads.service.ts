// Initializes the `uploads` service on path `/uploads`
import { ServiceAddons } from '@feathersjs/feathers';
import createService from 'feathers-mongoose';
import path from 'path';
import multer from 'multer';
import { Application } from '../../declarations';
import { Uploads } from './uploads.class';
import createModel from '../../models/uploads.model';
import hooks from './uploads.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    uploads: Uploads & ServiceAddons<any>;
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});
const multipartMiddleware = multer({ storage });

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  // app.use('/uploads', new Uploads(options, app));
  app.use(
    '/uploads',
    multipartMiddleware.array('file', 3),
    function (req, res, next) {
      if (req.feathers) {
        req.feathers.files = req.files;
      }
      next();
    },
    createService(options)
  );

  // Get our initialized service so that we can register hooks
  const service = app.service('uploads');

  service.hooks(hooks);
}
