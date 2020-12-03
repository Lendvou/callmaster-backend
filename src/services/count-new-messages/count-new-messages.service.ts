// Initializes the `count-new-messages` service on path `/count-new-messages`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { CountNewMessages } from './count-new-messages.class';
import hooks from './count-new-messages.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'count-new-messages': CountNewMessages & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate'),
  };

  // Initialize our service with any options it requires
  app.use('/count-new-messages', new CountNewMessages(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('count-new-messages');

  service.hooks(hooks);
}
