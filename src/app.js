require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDb } = require('./database/db');
const authRoutes = require('./routes/authRoutes');
const transactionsRoutes = require('./routes/transactionsRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());


connectDb().then(() => {
  app.use(authRoutes);
  app.use(transactionsRoutes);

  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}).catch(err => {
  console.error("Erro ao conectar ao banco de dados:", err);
});