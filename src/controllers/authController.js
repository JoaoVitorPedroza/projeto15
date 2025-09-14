const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { getDb } = require('../database/db');

const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const db = getDb();
    const usersCollection = db.collection('users');

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).send('E-mail já registrado.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
    });

    if (result.acknowledged) {
      res.status(201).send('Usuário registrado com sucesso!');
    } else {
      res.status(500).send('Falha ao registrar o usuário.');
    }
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).send('Erro interno do servidor.');
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = getDb();
    const usersCollection = db.collection('users');

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).send('Credenciais inválidas.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send('Credenciais inválidas.');
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login bem-sucedido!', token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).send('Erro interno do servidor.');
  }
};

module.exports = { signUp, signIn };
