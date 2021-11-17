const express = require('express');
const bodyParser = require("body-parser");
require('dotenv').config();
const cors = require("cors");
const { MongoClient } = require('mongodb').MongoClient;
const ObjectId =  require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.djm8z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
     useNewUrlParser: true, 
     useUnifiedTopology: true,
     }); 
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(' motors Website');
});
client.connect( (err) => {
        const database = client.db("motors_portal");
        const servicesCollection = database.collection('services');
        const confirmApplyCollection = client
    .db("motors_portal")
    .collection("confirmApply");
  const reviewCollection = client
    .db("motors_portal")
    .collection("review");
  const adminCollection = client
    .db("motors_portal")
    .collection("admin");

        // GET API 
        app.get('/services', async(req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray((err, documents) => {
                res.send(documents);
              });
        });
        


        // GET Single ServicesCollection
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting service',id);
            const query = {_id:ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        });

        // POST API
        app.post('/services', async(req, res) =>{
            const service = req.body;
         console.log('hit the post api', service);
         const result = await servicesCollection.insertOne(service);
         console.log(result);
        res.json(result);

        });
        app.post("/addService", (req, res) => {
            console.log(req.body);
            universityCollection.insertOne(req.body).then((result) => {
              res.send(result.insertedCount > 0);
              console.log(result.insertedCount > 0);
            });
          });

        pp.post("/addReview", (req, res) => {
            console.log(req.body);
            reviewCollection.insertOne(req.body).then((result) => {
              res.send(result.insertedCount > 0);
              console.log(result.insertedCount > 0);
            });
          });

          app.get("/ClientReview", (req, res) => {
            reviewCollection.find({}).toArray((err, documents) => {
              res.send(documents);
            });
          });

          app.post("/addAdmin", (req, res) => {
            adminCollection.insertOne(req.body).then((result) => {
              console.log(result.insertedCount > 0);
              res.send(result.insertedCount > 0);
            });
          });
        

        // Delete API
        app.delete('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

        app.get("/allOrders", (req, res) => {
            confirmApplyCollection.find({}).toArray((err, documents) => {
              res.send(documents);
            });
          });

          app.get("/checkAdmin", (req, res) => {
            adminCollection
              .find({ email: req.query.email })
              .toArray((err, documents) => {
                console.log(documents.length > 0);
                res.send(documents.length > 0);
              });
          });
          app.patch("/updateStatus/:id", (req, res) => {
            console.log(req.body.optionValue);
            confirmApplyCollection
              .updateOne(
                { _id: ObjectId(req.params.id) },
                {
                  $set: { process: req.body.optionValue },
                }
              )
              .then((result) => {
                console.log(result.modifiedCount > 0);
                res.send(result.modifiedCount > 0);
              });
          });
          app.patch("/update/:id", (req, res) => {
            console.log(req.body.name);
            servicesCollection
              .updateOne(
                { _id: ObjectId(req.params.id) },
                {
                  $set: {
                    name: req.body.name,
                    location: req.body.name,
                    serviceCharge: req.body.serviceCharge,
                    type: req.body.type,
                  },
                }
              )
              .then((result) => {
                res.send(result.modifiedCount > 0);
                console.log(result.modifiedCount > 0);
              });
          });
          app.get("/serviceUpdate/:id", (req, res) => {
            console.log(req.params.id);
            servicesCollection
              .find({ _id: ObjectId(req.params.id) })
              .toArray((err, documents) => {
                res.send(documents[0]);
              });
          });
       });
app.listen(process.env.PORT || port);