module.exports = {
  apps: [
    {
      name: 'Api',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'develop',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
