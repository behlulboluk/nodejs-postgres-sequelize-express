export const dbConfig = {
  HOST: 'localhost',
  USER: 'behlulboluk',
  PASSWORD: '123456',
  DB: 'behlulboluk',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
