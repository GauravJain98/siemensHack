const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const axios = require('axios');

const { hashGen } = require('./ipfsHashGeneration');

const port = process.env.PORT || 5000;

const app = express();

app.set('view engine', 'hbs');

app.use(express.static(`${__dirname}/`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    res.render(`${__dirname}/donorForm.hbs`);
});

app.post('/home', (req, res) => {
    console.log(req.body);
    hashGen(req.body).then(console.log);
    res.redirect('/home');
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
