import { Params, ServiceMethods } from '@feathersjs/feathers';
import { Application, ServiceModels } from '../../declarations';

interface Data {
  secret?: string;

  user?: any;
  accessToken?: string;
  chats?: any[];
}

interface ServiceOptions {}

declare module '../../declarations' {
  interface ServiceModels {
    auth: Data;
  }
}

export class Auth implements Partial<ServiceMethods<Data>> {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: Data, params?: Params): Promise<Data> {
    return data;
  }
}
