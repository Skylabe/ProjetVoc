const express = require('express');
const mongoose = require('mongoose');
const body = require('body-parser');

const Words = require('./words'); // on importe notre model
const Pack = require('./pack');
const Food = require('./food');
 
mongoose.connect('mongodb+srv://root:root@kitchen.dj3ag6n.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true});

let app = express(); // création de l'objet représentant notre application express
app.use(body());
let port = 8081;

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.post('/addPack', async(req, res) => {
    const name = req.body.name;

    if(!name){
        res.send('Aucun nom');
    }

    const newPack = new Pack({
        name: name,
        nb: 0
    });

    await newPack.save();
    res.json(newPack);
})

app.get('/getAllPacks', async (req, res) => {
    const packs = await Pack.find(); // On récupère tout les livres
    await res.json(packs);
});

app.delete('/deletePack/:id', async(req, res) => {
    const id = req.params.id
    const suppr = await Pack.deleteOne({_id : id})
    res.json(suppr)
     
});

app.post('/addWord', async (req, res) => {
    const originalWord = req.body.originalWord; // récupération des variables du body
    const tradWord = req.body.tradWord;
    const packId = req.body.packId;
 
    if (!originalWord || !tradWord) { // on vérifie que les trois variables sont présentes
        res.send('Il manque un argument obligatoire');
        return;
    }
 
    const newWord = new Words({ // création d'un objet représentant notre nouveau livre
        originalWord : originalWord,
        tradWord : tradWord,
        packId: packId
    });
     
    await newWord.save() // sauvegarde asynchrone du nouveau livre
    res.json(newWord)
    return;
 
});

app.get('/getAllWords', async (req, res) => {
    const words = await Words.find(); // On récupère tout les livres
    await res.json(words);
});

app.get('/getWordsPack/:id', async(req, res) => {
    const words = await Words.find({packId : req.params.id});
    res.json(words);
});

app.get('/getWord/:id', async (req, res) => {
    const id = req.params.id // on récupère la valeure dans l'url
    const word = await Words.findOne({_id : id}) // on récupère le livre grâce à son _id
    res.json(word)
 
});

app.delete('/deleteWord/:id', async(req, res) => {
    const id = req.params.id
    const suppr = await Words.deleteOne({_id : id})
    res.json(suppr)
     
});

app.patch('/editWord/:id', async(req, res) => {
    const id = req.params.id
    const word = await Words.findOne({_id : id}) // on récupere le livre pour pouvoir le modifier
    // on récupère les valeurs potentiellement modifiées
    const originalWord = req.body.originalWord;
    const tradWord = req.body.tradWord
     
    // on vérifie maintenant si les valeurs sont remplies, si elles le sont on modifie l'ancienne valeure par la nouvelle
     
    if (originalWord) {
        word.originalWord = originalWord;
    }
    if (tradWord) {
        word.tradWord = tradWord;
    }

    await word.save() // on sauvegarde les modifications
     
    res.json(word)
});

app.patch('/updatePackNumber/:id/:type', async(req, res) => {
    const type = req.params.type;
    const id = req.params.id;
    const pack = await Pack.findOne({_id : id})
    pack.nb = type === 'MINUS' ? pack.nb-1 : pack.nb+1;
    await pack.save() // on sauvegarde les modifications
     
    res.json(pack)
});

app.post('/addFood', async (req, res) => {
    const name = req.body.name; // récupération des variables du body
    const expiration = req.body.expiration;
    const quantity = req.body.quantity;
    const unit = req.body.unit;
    const categories = req.body.categories;
    const storage = req.body.storage;
 
    if (!name) { // on vérifie que les trois variables sont présentes
        res.send('Il manque un argument obligatoire');
        return;
    }
 
    const newFood = new Food({ // création d'un objet représentant notre nouveau livre
        name: name,
		expiration: expiration,
		quantity: quantity,
		unit: unit,
		categories: categories,
		storage: storage
    });
     
    await newFood.save() // sauvegarde asynchrone du nouveau livre
    res.json(newFood)
    return;
});

app.get('/getAllFoods', async (req, res) => {
    const foods = await Food.find(); // On récupère tout les livres
    await res.json(foods);
});
 
app.listen(port, () =>  { // ecoute du serveur sur le port 8080
    console.log('le serveur fonctionne');
});