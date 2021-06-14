import { BadRequest } from '@feathersjs/errors';
import { HookContext } from '../../app';
import { ServiceModels } from '../../declarations';

export default {
  before: {
    all: [],
    create: [
      async (context: HookContext<ServiceModels['auth']>) => {
        const { app, data } = context;

        if (!data || !data.secret) {
          throw new BadRequest('Field secret is required');
        }

        let user = (<any[]>await app.service('users').find({
          query: {
            secret: data.secret,
            $limit: 1,
          },
          paginate: false,
        }))[0];

        if (!user) {
          user = <any[]>await app.service('users').create({
            secret: data.secret,
          });
        }

        const authentication = await app.service('authentication').create(
          {
            secret: data.secret,
            strategy: 'secret',
          },
          { provider: 'rest' }
        );

        const chats = <any[]>await app.service('chats').find({
          query: {
            userId: user.id,
          },
          user,
          paginate: false,
        });

        context.result = {
          accessToken: authentication.accessToken,
          user: authentication.user,
          chats,
        };

        return context;
      },
    ],
  },

  after: {
    all: [],
    create: [],
  },

  error: {
    all: [],
    create: [],
  },
};
