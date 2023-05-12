const express = require('express');
const DB = require('./db');
const bodyParser = require('body-parser');
const cors = require('cors');
const imageRoute = require('./routes/image-route');

const app = express();
const database = new DB();

app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/upload', imageRoute);

require('./routes/user')(app, database);
require('./routes/recipe')(app, database);
require('./routes/ingredient')(app, database);
require('./routes/favoritesList')(app, database);
require('./routes/comment')(app, database);

app.listen('5000', () => {
    console.log(`Server listening`);
})
