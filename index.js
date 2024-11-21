const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ewhtdrn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const newsCollection = client.db('newspaperDB').collection('news');
    const usersCollection = client.db('newspaperDB').collection('users');

    //users related api

    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result)
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return
      }
      const result = await usersCollection.insertOne(user);
      res.send(result)
    })


    //news related api.
    app.get('/news', async (req, res) => {
      const result = await newsCollection.find().toArray();
      res.send(result)
    })

    app.get('/news/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await newsCollection.findOne(query);
      res.send(result)
    })

    app.post('/news', async (req, res) => {
      const news = req.body;
      const result = await newsCollection.insertOne(news);
      res.send(result)
    })

    app.delete('/news/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await newsCollection.deleteOne(query);
      res.send(result)
    })

    app.get('/myNews', async (req, res) => {
      const email = req.query.email;      
      const query = { "author.email" : email };
      const result = await newsCollection.find(query).toArray();
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
  } finally {
    //
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('My server is running.')
})

app.listen(port, () => {
  console.log('My server is running on port : ', port);
})