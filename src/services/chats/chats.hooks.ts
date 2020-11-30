import * as authentication from '@feathersjs/authentication';
import { HookContext } from '@feathersjs/feathers';
import { fastJoin } from 'feathers-hooks-common';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const chatResolver = {
  joins: {
    lastMessage: () => async (chat: any, { app }: HookContext) =>
      (chat.lastMessage = (
        await app.service('messages').find({
          query: {
            $limit: 1,
            $sort: { createdAt: -1 },
            chatId: chat._id,
          },
          paginate: false,
        })
      )[0]),
  },
};

const chatQuery = {
  lastMessage: true,
};

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [fastJoin(chatResolver, chatQuery)],
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
