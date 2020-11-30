import { Hook, HookContext } from '@feathersjs/feathers';
import fs from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);

// eslint-disable-next-line
export default function (options = {}): Hook {
  return async (context: HookContext) => {
    const { result } = context;

    await unlinkAsync(`./public/uploads/${result.filename}`);

    return context;
  };
}
