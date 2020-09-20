const functions = require('firebase-functions');
const express   = require('express');
const cors      = require('cors');
const admin     = require('firebase-admin');
admin.initializeApp()
const db = admin.firestore();

const app = express();

app.use(cors({origin: true}));

// GET Functions
app.get('/', async (req, res) => {
    let snapshot = await db.collection('products').get();

    let products = [];
    snapshot.forEach( (doc) => {
        let id = doc.id;
        let data = doc.data();

        products.push({ id, ...data });
    });

    res.status(200).send(JSON.stringify(products));
});

app.get('/:id', async (req, res) => {
    let snapshot = await db.collection('products').doc(req.params.id).get();

    let productId   = snapshot.id;
    let productData = snapshot.data();

    res.status(200).send(JSON.stringify({ id: productId, ...productData }));
});

// POST Functions
app.post('/', async (req, res) => {

    let product = req.body;

    await db.collection('products').add(product);

    res.status(201).send();
});

// PUT Functions
app.put('/:id', async (req, res) => {
    let body = req.body

    await db.collection('products').doc(req.params.id).update(body);

    res.status(200).send();
});

// DELETE Functions
app.delete('/:id', async (req, res) => {
    await db.collection('products').doc(req.params.id).delete();

    res.status(200).send();
});

exports.product = functions.https.onRequest(app);
