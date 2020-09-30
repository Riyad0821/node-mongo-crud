const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const password = 'UC6hLYmm2fFC7r2';

const uri = "mongodb+srv://MohammadRiyad:UC6hLYmm2fFC7r2@cluster0.qguwb.mongodb.net/firstdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


client.connect(err => {
  const productCollection = client.db("firstdb").collection("education");
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
    .then(result => {
      console.log('one product added')
      res.send('success');
    })
  })
  console.log('Database Connected')
  
  //client.close();
});


app.listen(3000);