const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

const authRoutes = require('./routes/auth.route');
const pokemonRoutes = require('./routes/poketracker.route');

app.use(cors());
app.use(express.json());

require('dotenv').config();

// Use authRoutes middleware
app.use('/api/', authRoutes);

// Use pokemonRoutes middleware
app.use('/api/', pokemonRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
