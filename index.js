const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
// conditional port
const port = process.env.PORT || 5000;

const uri = "mongodb+srv://asifrequest:asifrequest@cluster0.ekz7tsq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


//middleware
app.use(cors());
app.use(express.json());


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      //create a collection in mongodb
      const database = client.db("insertDB");
      const usersCollection = database.collection("users");
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      //get data from mongodb and send it to users api
      app.get('/users', async(req,res)=>{
         const cursor = usersCollection.find();
         //converting cursor data to array
         const results = await cursor.toArray();
         res.send(results);
      })
      //post method to get data from client site and sending it to database
      app.post('/users', async(req,res)=>{
        const user = req.body;
        console.log('new user',user);
        const result = await usersCollection.insertOne(user);
        res.send(result);
  })

  //find specific user
  app.get('/users/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const user = await usersCollection.findOne(query);
      res.send(user);
  })
  //update data on database
  app.put('/users/:id', async (req, res) => {
    const id = req.params.id; 
    const user = req.body;
    const query = { _id: new ObjectId(id) };
    const options = { upsert: true };
    const updatedUser = {
        $set: {
            name: user.name,
            email: user.email
        }
    };

    const result = await usersCollection.updateOne(query, updatedUser, options);
    res.send(result);
});
  //delete function
  app.delete('/users/:id',async(req,res)=>{
     const id = req.params.id;
     console.log('please delete id from database', id);
     const query = {_id: new ObjectId(id)}
     const result = await usersCollection.deleteOne(query);
     res.send(result)
  })

    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }
  run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('simple crud is running')
})



app.listen(port, ()=>{
    console.log(`simple crud is running on port, ${port}`)
})


/*
: asifrequest

*/