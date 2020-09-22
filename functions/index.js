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

    try {
        let snapshot = await db.collection('products').get();

        let products = [];
        snapshot.forEach( (doc) => {
            let id = doc.id;
            let data = doc.data();

            products.push({ id, ...data });
        });

        res.status(200).send(JSON.stringify(products));
    }
    catch(error) {
        console.log(error);
        res.status(500).send(error.message);
    }    
});

app.get('/:id', async (req, res) => {

    try {
        let product = await db.collection('products').doc(req.params.id).get();
    
        if (product.exists) {
            res.status(200).send(JSON.stringify({ id: product.id, ...product.data() }));
        }
        else {
            res.status(404).send();
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

// POST Functions
app.post('/', async (req, res) => {

    try {
        let product = req.body;

        if(!product.name || !product.type) {
            return res.status(400).send("Name and type is required.");
        }

        await db.collection('products').add(product);    

        return res.status(201).send();
    }
    catch(error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
});

// PUT Functions
app.put('/:id', async (req, res) => {

    try {
        let body = req.body
        
        if(!body.name && !body.name) {
            return res.status(400).send();
        }

        let productRef  = await db.collection('products').doc(req.params.id);
        let product     = await productRef.get();

        if(product.exists) {

            let updateResult = await productRef.update(body); 
            return res.status(200).send();
        }
        
        return res.status(404).send("Product not found.")
    }
    catch(error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
});

// DELETE Functions
app.delete('/:id', async (req, res) => {

    try {
        let productRef  = await db.collection('products').doc(req.params.id);
        let product     = await productRef.get();

        if(product.exists) {
            let deleteResult = await productRef.delete();
            return res.status(200).send();
        }

        return res.status(404).send();
    }
    catch(error) {
        console.log(error);
        return res.status(500).send(error.message);
    }  
});

exports.product = functions.https.onRequest(app);
