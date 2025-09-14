const { getDb } = require('../database/db');
const { ObjectId } = require('mongodb');


const TRANSACTIONS_COLLECTION = 'transactions';
const ITEMS_PER_PAGE = 10;


const addTransaction = async (req, res) => {
  const { value, description, type } = req.body;
  const userId = req.userId;

  try {
    const db = getDb();
    const newTransaction = {
      userId: new ObjectId(userId),
      value,
      description,
      type,
      date: new Date(),
    };
    await db.collection(TRANSACTIONS_COLLECTION).insertOne(newTransaction);
    return res.status(201).send('Transação adicionada com sucesso!');
  } catch (err) {
    console.error('Erro ao adicionar transação:', err);
    return res.status(500).send('Erro interno do servidor.');
  }
};


const listTransactions = async (req, res) => {
  const userId = req.userId;
  const { page } = req.query;
  const pageNumber = parseInt(page) || 1;

  if (pageNumber < 1) {
    return res.status(400).send('O número da página deve ser um valor positivo.');
  }

  try {
    const db = getDb();
    const skipItems = (pageNumber - 1) * ITEMS_PER_PAGE;

    const transactions = await db
      .collection(TRANSACTIONS_COLLECTION)
      .find({ userId: new ObjectId(userId) })
      .sort({ date: -1 })
      .skip(skipItems)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    return res.status(200).send(transactions);
  } catch (err) {
    console.error('Erro ao listar transações:', err);
    return res.status(500).send('Erro interno do servidor.');
  }
};


const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  const { value, description, type } = req.body;

  try {
    const db = getDb();
    const result = await db.collection(TRANSACTIONS_COLLECTION).updateOne(
      {
        _id: new ObjectId(id),
        userId: new ObjectId(userId),
      },
      {
        $set: { value, description, type },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(401).send('Transação não encontrada ou não pertence ao usuário.');
    }

    return res.status(204).send();
  } catch (err) {
    console.error('Erro ao atualizar transação:', err);
    return res.status(500).send('Erro interno do servidor.');
  }
};


const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    const db = getDb(); 
    const result = await db.collection(TRANSACTIONS_COLLECTION).deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      return res.status(401).send('Transação não encontrada ou não pertence ao usuário.');
    }

    return res.status(204).send();
  } catch (err) {
    console.error('Erro ao deletar transação:', err);
    return res.status(500).send('Erro interno do servidor.');
  }
};

module.exports = {
  addTransaction,
  listTransactions,
  updateTransaction,
  deleteTransaction,
};