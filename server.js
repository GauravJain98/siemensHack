const express = require('express');
const fs = require('fs');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const { hashGen } = require('./ipfsHashGeneration');

const port = process.env.PORT || 5000;

const app = express();

app.set('view engine', 'hbs');

app.use(express.static(`${__dirname}/`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
hbs.registerPartials(`${__dirname}/views/partials`);

app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    res.render('index.hbs');
});

app.get('/about', (req, res) => {
    res.render('about.hbs');
});
app.get('/organs', (req, res) => {
    res.render('organs.hbs');
});
app.get('/store', (req, res) => {
    res.render('store.hbs');
});

app.get('/data', (req, res) => {
    res.sendFile(`${__dirname}/hash.json`);
});

app.get('/allOrganData', (req, res) => {
    res.sendFile(`${__dirname}/organs.json`);
});

app.post('/allOrganData', (req, res) => {
    fs.writeFileSync(
        `${__dirname}/organs.json`,
        JSON.stringify(req.body, null, 2),
        'utf-8'
    );
});

app.post('/home', (req, res) => {
    hashGen(req.body).then(result => {
        Hash = {
            hash: result
        };
        fs.writeFileSync(
            `${__dirname}/hash.json`,
            JSON.stringify(Hash, null, 2),
            'utf-8'
        );
        res.redirect('/home');
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
