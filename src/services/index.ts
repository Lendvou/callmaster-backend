import { Application } from '../declarations';
import users from './users/users.service';
import clients from './clients/clients.service';
import chats from './chats/chats.service';
import messages from './messages/messages.service';
import uploads from './uploads/uploads.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(clients);
  app.configure(chats);
  app.configure(messages);
  app.configure(uploads);
}
