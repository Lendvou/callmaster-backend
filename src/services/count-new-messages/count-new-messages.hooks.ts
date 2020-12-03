import * as authentication from '@feathersjs/authentication';
import { HookContext } from '@feathersjs/feathers';
import { Types } from 'mongoose';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [authenticate('jwt')],
    find: [
      async (context: HookContext): Promise<HookContext> => {
        const {
          app,
          params: { user },
        } = context;

        const { Model } = app.service('messages');

        const searchRoleType =
          user?.role === 'client' ? { $ne: 'client' } : 'client';

        const response = (
          await Model.aggregate([
            {
              $match: {
                isRead: false,
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
              },
            },
            { $unwind: '$user' },
            // { $match: query },
            { $match: { 'user.role': searchRoleType } },
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0 } },
          ])
        )[0];

        context.result = response ? response : { count: 0 };

        return context;
      },
    ],
    get: [
      async (context: HookContext): Promise<HookContext> => {
        const {
          app,
          id,
          params: { user },
        } = context;

        const { Model } = app.service('messages');

        const searchRoleType =
          user?.role === 'client' ? { $ne: 'client' } : 'client';

        const response = (
          await Model.aggregate([
            {
              $match: {
                isRead: false,
                chatId: Types.ObjectId(id),
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
              },
            },
            { $unwind: '$user' },
            // { $match: query },
            { $match: { 'user.role': searchRoleType } },
            { $group: { _id: null, count: { $sum: 1 } } },
            { $project: { _id: 0 } },
          ])
        )[0];

        context.result = response ? response : { count: 0 };

        return context;
      },
    ],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
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
