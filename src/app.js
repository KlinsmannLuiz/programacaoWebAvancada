require('dotenv').config();
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const pokemonRoutes = require('./routes/pokemonsRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());

app.use(express.static('public'))

app.use(session({
    store: SQLiteStore({db:'app.db', dir:'./database'}),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000 *60*30,
        httpOnly: true,
        secure: false
    },
}))

app.use('/api/pokemon', pokemonRoutes);
app.use('/api', authRoutes);

module.exports = app;