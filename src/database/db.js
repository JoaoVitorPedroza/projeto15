const { MongoClient } = require('mongodb');


const uri = process.env.DATABASE_URL;

let db;
let client;

const connectDb = async () => {
  if (db) {
    return db;
  }
  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db();
    console.log('Conexão com o MongoDB estabelecida!');
    return db;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
};


const getDb = () => {
  if (!db) {
    throw new Error('Banco de dados não conectado!');
  }
  return db;
};


module.exports = { connectDb, getDb };