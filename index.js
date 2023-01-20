const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
// const corsConfig = {
//     origin: 'http://localhost:3000/',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE']
// }
// app.use(cors(corsConfig))
// app.options("*", cors(corsConfig))
app.use(express.json());




const uri = "mongodb+srv://db-user:70G9bWFd5Hen88WQ@cluster0.oxzfl.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        const userCollection = client.db("insertDB").collection("haiku");
        // const user = {
        //     name: 'akhi',
        //     email: 'akhi@gmail.com'
        // }
        // const result = await userCollection.insertOne(user);
        // console.log(result);

    //    post mane create oparetion
        app.post("/users", async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

    // get mane read oparetion
        app.get("/users", async (req, res) => {
            const result = await userCollection.find({}).toArray();
            res.send(result);
        });

        // delete paretion
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const result = await userCollection.deleteOne({ _id: ObjectId(id) });
            console.log(result);
            res.send(result);
        })

        // update user
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const result = await userCollection.findOne({ _id: ObjectId(id) });
            console.log(result);
            res.send(result);
        })

        app.put("/users/:id", async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            const filter = { _id: ObjectId(id) };
            const option = {upsert: true};
            const updateUser = {
                $set: {
                    name: user.name,
                    email: user.email
                },
            };
            const result = await userCollection.updateOne(
                filter,
                updateUser,
                option
            );
            res.send(result);
        });
    }
    finally{

    }
}

run().catch(err => console.log(err));

app.get("/", (req, res) => {
    res.send("Getting successfully");
});

app.listen(port, () => {
    console.log("listening on port", port);
});