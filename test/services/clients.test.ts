import app from '../../src/app';

describe('\'clients\' service', () => {
  it('registered the service', () => {
    const service = app.service('clients');
    expect(service).toBeTruthy();
  });
});
