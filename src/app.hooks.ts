import Errors from '@feathersjs/errors';
import { HookContext } from '@feathersjs/feathers';
// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

export default {
  before: {
    all: [],
    find: [],
    get: [],
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
    all: [
      (ctx: HookContext): HookContext => {
        if (ctx.error) {
          console.log('HOOK ERROR', (ctx as any).code, ctx.error);
        }
        return ctx;
      },
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
