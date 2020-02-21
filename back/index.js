const express = require('express');
const cors = require('cors');
const mysqlDb = require('./mysqlDb');
const objects = require('./app/objects');
const categories = require('./app/categories');
const places = require('./app/places');

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.use('/objects', objects);

app.use('/categories', categories);

app.use('/places', places);

const run = async () => {

    await mysqlDb.connect();

    app.listen(port, () => {
        console.log(`HTTP life on http://localhost:${port}/`);
    });

    process.on('exit', () => {
        mysqlDb.disconnect();
    })
};

run().catch(e => {
    console.error(e);
});