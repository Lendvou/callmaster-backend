import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { HookContext } from '@feathersjs/feathers';
import { fastJoin } from 'feathers-hooks-common';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

const usersResolver = {
  joins: {
    avatar:
      () =>
      async (user: any, { app }: HookContext) => {
        return (user.avatar = user.avatarId
          ? await app.service('uploads').get(user.avatarId)
          : undefined);
      },
  },
};

const query = {
  avatar: true,
};

export default {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [hashPassword('password'), assignNum()],
    // create: [ hashPassword('password') ],
    update: [hashPassword('password'), authenticate('jwt')],
    patch: [hashPassword('password'), authenticate('jwt')],
    remove: [authenticate('jwt')],
  },

  after: {
    all: [
      fastJoin(usersResolver, query),
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};

function assignNum() {
  return async (context: HookContext) => {
    const res = await context.service.find({ query: { $limit: 1 } });

    if (context.data) {
      context.data.num = res.total + 1;
    }

    return context;
  };
}
