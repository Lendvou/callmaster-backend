import * as authentication from '@feathersjs/authentication';
import { HookContext } from '@feathersjs/feathers';
import { discardQuery, fastJoin, iff } from 'feathers-hooks-common';

import readMessages from '../../hooks/read-messages';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

const messagesResolver = {
  joins: {
    user: () => async (message: any, { app }: HookContext) =>
      (message.user = (
        await app.service('users').find({
          query: { _id: message.userId, $limit: 1 },
          paginate: false,
        })
      )[0]),
    photos: () => async (message: any, { app }: HookContext) =>
      (message.photos = await app.service('uploads').find({
        query: { _id: { $in: message.photosIds } },
        paginate: false,
      })),
  },
};

const query = {
  user: true,
  photos: true,
};

export default {
  before: {
    all: [authenticate('jwt')],
    find: [
      iff(
        (context) => context.params.query && context.params.query.$read,
        readMessages(),
        discardQuery('$read')
      ),
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [fastJoin(messagesResolver, query)],
    find: [],
    get: [],
    create: [
      async (context: HookContext): Promise<HookContext> => {
        await context.app.service('chats').patch(context.result.chatId, {
          lastMessageDate: context.result.createdAt,
        });
        return context;
      },
    ],
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

// const messagesResolver = {
//   joins: {
//     author: $select => async (message, { app }) => message.author = (await app.service('users').find({
//       query: {
//         _id: message.authorId,
//         $limit: 1,
//         $select: $select || ['_id']
//       },
//       paginate: false
//     }))[0],
//     company: $select => async (message, { app }) => {
//       if (!message.systemInfo || !message.systemInfo.companyId) return null;
//       const company = (await app.service('insurance-companies').find({
//         query: {
//           _id: message.systemInfo.companyId,
//           $limit: 1,
//           $select: $select || ['_id']
//         },
//         paginate: false
//       }))[0];
//       delete message.systemInfo.companyId;
//       return message.systemInfo.company = company ? company.name : message.systemInfo.companyId;
//     },
//     photos: $select => async (message, { app }) => message.photos = await app.service('uploads').find({
//       query: {
//         _id: { $in: message.photosIds },
//         $select: $select || ['_id'],
//       },
//       paginate: false,
//     }),
//   }
// };

// const query = {
//   author: [['_id', 'email', 'firstName', 'lastName']],
//   company: [['_id', 'name']],
//   photos: [['_id', 'path', 'filename', 'originalname', 'mimetype']]
// };
