import app from '../../src/app';

describe('\'count-new-messages\' service', () => {
  it('registered the service', () => {
    const service = app.service('count-new-messages');
    expect(service).toBeTruthy();
  });
});
