const functions = require('firebase-functions');
const express   = require('express');
const cors      = require('cors');
const admin     = require('firebase-admin');
admin.initializeApp()

const app = express();

// GET Functions
app.get('/', async (req, res) => {
    let snapshot = await admin.firestore().collection('products').get();

    let products = [];
    snapshot.forEach( (doc) => {
        let id = doc.id;
        let data = doc.data();

        products.push({ id, ...data });
    });

    res.status(200).send(JSON.stringify(products));
});

app.get('/:id', async (req, res) => {
    let snapshot = await admin.firestore().collection('products').doc(req.params.id).get();

    let productId   = snapshot.id;
    let productData = snapshot.data();

    res.status(200).send(JSON.stringify({ id: productId, ...productData }));
});

// POST Functions
app.post('/', async (req, res) => {

    let product = req.body;

    await admin.firestore().collection('products').add(product);

    res.status(201).send();
});

// PUT Funtions
app.put('/:id', async (req, res) => {
    let body = req.body

    await admin.firestore().collection('products').doc(req.params.id).update(body);

    res.status(200).send();
});

exports.product = functions.https.onRequest(app);

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  
    response.send("Hello from Firebase!");
});
