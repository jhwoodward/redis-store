module.exports = {
  port: 6377,
  origins: ['http://localhost:3000','http://localhost:50009'],
  jwt: {
    secret: 'hello'
  }
};
