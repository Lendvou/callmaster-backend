/* eslint-disable */
import {
  Id,
  NullableId,
  Paginated,
  Params,
  ServiceMethods,
} from '@feathersjs/feathers';
import { Application } from '../../declarations';

interface Data {
  count: number;
}

interface ServiceOptions {}

declare module '../../declarations' {
  interface ServiceModels {
    'count-new-messages': Data;
  }
}

export class CountNewMessages implements ServiceMethods<Data> {
  app: Application;
  options: ServiceOptions;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;
  }

  async find(params?: Params): Promise<Data[] | Paginated<Data>> {
    return [];
  }

  async get(id: Id, params?: Params): Promise<Data> {
    return {
      count: 0,
    };
  }

  async create(data: Data, params?: Params): Promise<Data> {
    return data;
  }

  async update(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  async patch(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  async remove(id: NullableId, params?: Params): Promise<Data> {
    return { count: 0 };
  }
}
