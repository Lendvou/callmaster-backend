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
    operator: ($select: string[]) => async (
      chat: any,
      { app }: HookContext
    ) => {
      const operator = await app.service('users').get(chat.operatorId, {
        query: { $select },
      });
      chat.operator = operator;
    },
    client: ($select: string[]) => async (chat: any, { app }: HookContext) => {
      const client = await app.service('users').get(chat.clientId, {
        query: { $select },
      });
      chat.client = client;
    },

    clientUnreadMessages: () => async (chat: any, { app }: HookContext) => {
      const { total } = await app.service('messages').find({
        query: {
          isRead: false,
          chatId: chat._id,
          authorRole: 'operator',
        },
      });
      chat.clientUnreadMessages = total;
    },
    operatorUnreadMessages: () => async (chat: any, { app }: HookContext) => {
      const { total } = await app.service('messages').find({
        query: {
          isRead: false,
          chatId: chat._id,
          authorRole: 'client',
        },
      });
      chat.operatorUnreadMessages = total;
    },
  },
};

const chatQuery = {
  lastMessage: true,
  // user: true,
  operator: [['firstName', 'lastName', 'avatar', 'isOnline', 'role']],
  client: [['firstName', 'lastName', 'avatar', 'isOnline', 'role']],
  clientUnreadMessages: true,
  operatorUnreadMessages: true,
};

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      async ({ service, data }: HookContext): Promise<void> => {
        const { total } = await service.find({
          query: {
            clientId: data.clientId,
            operatorId: data.operatorId,
          },
        });

        if (total > 0) {
          throw Error('Instance already exists');
        }
      },
    ],
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
