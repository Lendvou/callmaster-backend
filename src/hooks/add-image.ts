import { BadRequest } from '@feathersjs/errors';
import { Hook, HookContext } from '@feathersjs/feathers';

// eslint-disable-next-line
export default function (options = {}): Hook {
  return async (context: HookContext) => {
    const {
      app,
      params: { files },
    } = context;

    if (!files || files.length === 0) {
      throw new BadRequest('No files found to upload');
    }

    const apiUrl = app.get('apiUrl');
    context.data = files.map((f: any) => {
      const file = { ...f };
      file.path = `${apiUrl}/uploads/${file.filename}`;
      return file;
    });

    return context;
  };
}
