const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

const authRoutes = require('./routes/auth.route');
const userPokemonRoutes = require('./routes/userPokemon.route');
const versionDetailsRoutes = require('./routes/versionDetails.route');
const pokedexRoutes = require('./routes/pokedex.route');
const pokemonRoutes = require('./routes/pokemon.route');
const locationsRoute = require('./routes/locations.route');
const encountersRoute = require('./routes/encounters.route');

app.use(cors());
app.use(express.json());

require('dotenv').config();

app.use('/api/', authRoutes);
app.use('/api/', userPokemonRoutes);
app.use('/api/', versionDetailsRoutes);
app.use('/api/', pokedexRoutes);
app.use('/api/', pokemonRoutes);
app.use('/api/', locationsRoute);
app.use('/api/', encountersRoute);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
