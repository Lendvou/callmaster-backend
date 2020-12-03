// messages after: { find }

import { Hook, HookContext } from '@feathersjs/feathers';

/**
 * Set isRead to true on each message in response
 */
export default (): Hook => {
  return async (context: HookContext) => {
    const {
      service,
      params: { user, query },
    } = context;

    if (!query || !query.chatId || !user) {
      return context;
    }
    const authorRole = user.role === 'client' ? 'operator' : 'client';
    // user.role === 'client' ? { $ne: 'client' } : { $ne: 'operator' };

    await service.patch(
      null,
      { isRead: true },
      {
        query: {
          chatId: query.chatId,
          authorRole,
          isRead: false,
        },
        $multi: true,
      }
    );

    return context;
  };
};
