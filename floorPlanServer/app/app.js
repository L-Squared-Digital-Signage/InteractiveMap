const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 8080

const mongoose = require("mongoose")
const MongoClient = require('mongodb').MongoClient
let url = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}`
console.log("DB_URL :- ",`${url}`)

const cors = require("cors")

const corsOptions ={
   origin:'*',
   credentials:false,
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))

app.use(express.json())

app.get('/', (req, res) => {
  res.send('I\'m on!')
})


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

//Middleware

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Database

//Configure mongoose
mongoose.connect(
  `${url}/${process.env.MONGO_DB_NAME}?authSource=admin`,
  (err) => {
    if (err) {
      console.log("err", err)
    } else {
      console.log("Connected to MongoDB");
    }
  }
)


//Schemas

const commonSchema = new mongoose.Schema({
  data: Array
})

const DestOR = mongoose.model('destinationors', commonSchema)
const DestMT = mongoose.model('destinationmts', commonSchema)
const DestFC = mongoose.model('destinationfcs', commonSchema)
const DestPE = mongoose.model('destinationpes', commonSchema)

const PathOR = mongoose.model('pathors', commonSchema)
const PathMT = mongoose.model('pathmts', commonSchema)
const PathFC = mongoose.model('pathfcs', commonSchema)
const PathPE = mongoose.model('pathpes', commonSchema)

module.exports = DestOR, DestMT, DestFC, DestPE, PathOR, PathMT, PathFC, PathPE


/////////// DESTINATION ////////////

//Open Rooms
app.post('/destinations/open-room', (req, res) => {
  var destData = new DestOR(req.body);
  destData.save()
    .then(item => {
      res.send("item saved to database");
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    })
})

app.get('/destinations/open-room', (req, res) => {
  MongoClient.connect(url, (err, db) => {
    if (err) throw err
    var dbo = db.db("floorpath_db")
    dbo.collection("destinationors").find({}).toArray((err, result) => {
      if (err) throw err
      res.send(result)
      db.close()
    })
  })
})

//Meetings
app.post('/destinations/meeting', (req, res) => {
  var destData = new DestMT(req.body);
  destData.save()
    .then(item => {
      res.send("item saved to database");
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    })
})

app.get('/destinations/meeting', (req, res) => {
  MongoClient.connect(url, (err, db) => {
    if (err) throw err
    var dbo = db.db("floorpath_db")
    dbo.collection("destinationmts").find({}).toArray((err, result) => {
      if (err) throw err
      res.send(result)
      db.close()
    })
  })
})

//Facilities
app.post('/destinations/facility', (req, res) => {
  var destData = new DestFC(req.body);
  destData.save()
    .then(item => {
      res.send("item saved to database");
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    })
})

app.get('/destinations/facility', (req, res) => {
  MongoClient.connect(url, (err, db) => {
    if (err) throw err
    var dbo = db.db("floorpath_db")
    dbo.collection("destinationfcs").find({}).toArray((err, result) => {
      if (err) throw err
      res.send(result)
      db.close()
    })
  })
})

//People
app.post('/destinations/people', (req, res) => {
  var destData = new DestPE(req.body);
  destData.save()
    .then(item => {
      res.send("item saved to database");
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    })
})

app.get('/destinations/people', (req, res) => {
  MongoClient.connect(url, (err, db) => {
    if (err) throw err
    var dbo = db.db("floorpath_db")
    dbo.collection("destinationpes").find({}).toArray((err, result) => {
      if (err) throw err
      console.log(result)
      res.send(result)
      db.close()
    })
  })
})


//////////// PATH ////////////

//Open Rooms
app.post('/paths/open-room', (req, res) => {
  var pathData = new PathOR(req.body)
  pathData.save()
    .then(item => {
      res.send("item saved to database");
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    })
})

app.get('/paths/open-room', (req, res) => {
  MongoClient.connect(url, (err, db) => {
    if (err) throw err
    var dbo = db.db("floorpath_db")
    dbo.collection("pathors").find({}).toArray((err, result) => {
      if (err) throw err
      res.send(result)
      db.close()
    })
  })
})

//Meetings
app.post('/paths/meeting', (req, res) => {
  var pathData = new PathMT(req.body)
  pathData.save()
    .then(item => {
      res.send("item saved to database");
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    })
})

app.get('/paths/meeting', (req, res) => {
  MongoClient.connect(url, (err, db) => {
    if (err) throw err
    var dbo = db.db("floorpath_db")
    dbo.collection("pathmts").find({}).toArray((err, result) => {
      if (err) throw err
      res.send(result)
      db.close()
    })
  })
})

//Facilities
app.post('/paths/facility', (req, res) => {
  var pathData = new PathFC(req.body)
  pathData.save()
    .then(item => {
      res.send("item saved to database");
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    })
})

app.get('/paths/facility', (req, res) => {
  MongoClient.connect(url, (err, db) => {
    if (err) throw err
    var dbo = db.db("floorpath_db")
    dbo.collection("pathfcs").find({}).toArray((err, result) => {
      if (err) throw err
      res.send(result)
      db.close()
    })
  })
})

//People
app.post('/paths/people', (req, res) => {
  var pathData = new PathPE(req.body)
  pathData.save()
    .then(item => {
      res.send("item saved to database");
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    })
})

app.get('/paths/people', (req, res) => {
  MongoClient.connect(url, (err, db) => {
    if (err) throw err
    var dbo = db.db("floorpath_db")
    dbo.collection("pathpes").find({}).toArray((err, result) => {
      if (err) throw err
      res.send(result)
      db.close()
    })
  })
})

