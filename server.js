const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

//init app
const app = express();

//Set port
const port = 3000;

//Database connection
const mongojs = require('mongojs');
const db = mongojs('clientkeeper', ['clients']);

//Set static path
app.use(express.static(path.join(__dirname, 'public')));

//Init BodyParser middleware
app.use(bodyParser.json());

//Allow Request from Angular
app.use((req, res, next) => {
  //Site you wish to allow connection
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  //Methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  //Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  //Pass to the next layer of middleware
  next();
});

//Routes
app.get('/', (req, res) => {
  res.send('Please use /api/clients');
});

//Get Clients - GET
app.get('/api/clients', (req, res, next) => {
  db.clients.find().sort({first_name:1}, (err, clients) => {
    if(err){
      res.send(err);
    }
    res.json(clients);
  });
});

//Update Clients - PUT
app.put('/api/clients/:id', (req, res, next) => {
  const id = req.params.id;
  db.clients.findAndModify({query: {_id: mongojs.ObjectId(id)},
    update: {
      $set: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone
      }},
      new: true
    }, (err, client) => {
      res.json(client);
    });
});

//Post Clients - POST
app.post('/api/clients', (req, res, next) => {
  db.clients.insert(req.body, (err, client) => {
    if(err){
      res.send(err);
    }
    res.json(client);
  });
});

//Delete Clients - DELETE
app.delete('/api/clients/:id', (req, res, next) => {
  const id = req.params.id;
  db.clients.remove({_id: mongojs.ObjectId(id)}, (err, client) => {
    if(err){
      res.send(err);
    }
    res.json(client);
  });
});

//Init Port, DEV use 3000
app.listen(port, () => {
  console.log('Server running on port '+port);
});
