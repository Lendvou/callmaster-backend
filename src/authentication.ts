import { ServiceAddons } from '@feathersjs/feathers';
import {
  AuthenticationBaseStrategy,
  AuthenticationRequest,
  AuthenticationService,
  JWTStrategy,
} from '@feathersjs/authentication';
import { LocalStrategy } from '@feathersjs/authentication-local';
import { expressOauth } from '@feathersjs/authentication-oauth';

import { Application } from './declarations';
import { BadRequest, Unavailable } from '@feathersjs/errors';

declare module './declarations' {
  interface ServiceTypes {
    authentication: AuthenticationService & ServiceAddons<any>;
  }
}

class SecretStrategy extends AuthenticationBaseStrategy {
  async authenticate(data: AuthenticationRequest) {
    if (!this.app) {
      throw new Unavailable();
    }
    if (!data || !data.secret) {
      throw new BadRequest('Field secret is required');
    }

    const user = await this.app.service('users').find({
      query: {
        secret: data.secret,
        $limit: 1,
      },
      paginate: false,
    })[0];

    if (!user) {
      throw new BadRequest('There is no registered user');
    }

    return {
      authentication: { strategy: this.name },
      [this.configuration && this.configuration.entity ? this.configuration.entity : 'user']: user,
    };
  }
}

export default function (app: Application): void {
  const authentication = new AuthenticationService(app);

  authentication.register('jwt', new JWTStrategy());
  authentication.register('local', new LocalStrategy());
  authentication.register('secret', new SecretStrategy());

  app.use('/authentication', authentication);
  app.configure(expressOauth());
}
