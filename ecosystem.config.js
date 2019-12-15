module.exports = {
  apps : [{
    name: 'AuthenticationService',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: true,
    env: {
      DB_USER: '',
      DB_PASSWORD: '',
      DB_HOST: 'localhost',
      DB_PORT: '27017',
      DB_NAME: 'evnotify',
      AUTHORIZATION_SERVICE: 'http://localhost:3001/authorization'
    }
  }]
};
