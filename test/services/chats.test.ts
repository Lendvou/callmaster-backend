import app from '../../src/app';

describe('\'chats\' service', () => {
  it('registered the service', () => {
    const service = app.service('chats');
    expect(service).toBeTruthy();
  });
});
