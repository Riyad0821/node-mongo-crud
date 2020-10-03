const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


const password = 'UC6hLYmm2fFC7r2';

const uri = "mongodb+srv://MohammadRiyad:UC6hLYmm2fFC7r2@cluster0.qguwb.mongodb.net/firstdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use((err, req, res, next) => {
  res.locals.error = err;
  const status = err.status || 500;
  res.status(status);
  res.render('error');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


client.connect(err => {
  const productCollection = client.db("firstdb").collection("education");
  
  app.get('/products', (req, res) => {
    productCollection.find({}).limit(5)
    .toArray((err, documents) => {
        res.send(documents);
    })
  })
  
  app.get('/product/:id', (req, res) => {
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })
  
  
  app.post('/addProduct', (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
    .then(result => {
      console.log('one product added')
      res.redirect('/');
    })
  })

  app.patch('/update/:id', (req, res) => {
    console.log(req.body.price);
    productCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then (result => {
      res.sendStatus(result.modifiedCount)
    })
  })

  app.delete('/delete/:id', (req, res) => {
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0);
    })
  })

  console.log('Database Connected')
  
  //client.close();
});


app.listen(3000);