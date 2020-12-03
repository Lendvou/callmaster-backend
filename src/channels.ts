import '@feathersjs/transport-commons';
import { HookContext } from '@feathersjs/feathers';
import { Application } from './declarations';

export default function (app: Application): void {
  if (typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return;
  }

  app.on('connection', (connection: any): void => {
    // On a new real-time connection, add it to the anonymous channel
    app.channel('anonymous').join(connection);
  });

  app.on('login', async (authResult: any, { connection }: any) => {
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if (connection) {
      // Obtain the logged in user from the connection
      // const user = connection.user;

      // The connection is no longer anonymous, remove it
      app.channel('anonymous').leave(connection);

      // Add it to the authenticated user channel
      app.channel('authenticated').join(connection);

      const user = connection.user;

      if (user?.role === 'admin') {
        app.channel('admins').join(connection);
      }

      if (user) {
        app.service('users').patch(user._id, { isOnline: true });

        const idType = user.role === 'client' ? 'clientId' : 'operatorId';

        const chats = (await app.service('chats').find({
          query: { [idType]: user._id },
          paginate: false,
        })) as any[];
        // console.log('passed the chats', user.role, chats);

        const chatIds = chats.map((item: any) => item._id);

        chatIds.forEach((chatId) => {
          app.channel(`chats_${chatId}`).join(connection);
        });
        app.channel(`users_${user._id}`).join(connection);
        // if (user.role !== 'client') {
        //   app.channel(`operators_${user._id}`).join(connection);
        // }
      }
      console.log('ALL CHANNELS', app.channels);

      // if (user?.role === 'client') {
      //   const chats = (await app.service('chats').find({
      //     query: { clientId: user._id, $select: ['_id'] },
      //     paginate: false,
      //   })) as any[];
      //   const chatIds = chats.map((item: any) => item._id);

      //   chatIds.forEach((chatId) => {
      //     app.channel(`chats_${chatId}`).join(connection);
      //   });
      // }
      // if (user?.role === 'operator') {
      //   const chats = (await app.service('chats').find({
      //     query: { operatorId: user._id, $select: ['_id'] },
      //     paginate: false,
      //   })) as any[];

      //   const chatIds = chats.map((chat: any) => chat._id);

      //   chatIds.forEach((chatId) => {
      //     app.channel(`chats_${chatId}`).join(connection);
      //   });
      // }

      // Channels can be named anything and joined on any condition

      // E.g. to send real-time events only to admins use
      // if(user.isAdmin) { app.channel('admins').join(connection); }

      // If the user has joined e.g. chat rooms
      // if(Array.isArray(user.rooms)) user.rooms.forEach(room => app.channel(`rooms/${room.id}`).join(connection));

      // Easily organize users by email and userid for things like messaging
      // app.channel(`emails/${user.email}`).join(connection);
      // app.channel(`userIds/${user.id}`).join(connection);
    }
  });

  app.on('logout', (payload: any) => {
    if (payload?.user) {
      const user = payload.user;
      app.service('users').patch(user._id, { isOnline: false });
    }
  });

  app.on('disconnect', (payload: any) => {
    if (payload.user) {
      app.service('users').patch(payload.user._id, { isOnline: false });
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.publish((data: any, hook: HookContext) => {
    // Here you can add event publishers to channels set up in `channels.ts`
    // To publish only for a specific event use `app.publish(eventname, () => {})`

    console.log(
      'Publishing all events to all authenticated users. See `channels.ts` and https://docs.feathersjs.com/api/channels.html for more information.'
    ); // eslint-disable-line

    // e.g. to publish all service events to all authenticated users use
    return app.channel('authenticated');
  });

  // Here you can also add service specific event publishers
  // e.g. the publish the `users` service `created` event to the `admins` channel
  // app.service('users').publish('created', () => app.channel('admins'));

  // With the userid and email organization from above you can easily select involved users
  // app.service('messages').publish(() => {
  //   return [
  //     app.channel(`userIds/${data.createdBy}`),
  //     app.channel(`emails/${data.recipientEmail}`)
  //   ];
  // });

  app
    .service('messages')
    .publish(async (message: any, context: HookContext) => {
      const { app } = context;

      const currentChat = await app.service('chats').get(message.chatId);

      return [
        // app.channel(`chats_${message.chatId}`),
        // app.channel(`users_${message.userId}`),
        app.channel(`users_${currentChat.operatorId}`),
        app.channel(`users_${currentChat.clientId}`),
        app.channel('admins'),
      ];
    });
  app.service('chats').publish(async (chat: any) => [
    // app.channel(`chats_${chat._id}`),
    // app.channel(`operators_${chat.operatorId}`),
    app.channel(`users_${chat.operatorId}`),
    app.channel(`users_${chat.clientId}`),
    app.channel('admins'),
  ]);

  // console.log('ALL CHANNELS', app.channels);
}
