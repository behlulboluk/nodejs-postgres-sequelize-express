import express from 'express';
import bodyParser from 'body-parser';
import Sequelize from 'sequelize';
import routes from './app/routes/route';
import cors from 'cors';
import config from 'dotenv';
config.config();

// create express app
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(cors());
app.use(routes);

const sequelize = new Sequelize(process.env.POSTGRES_CONNECT_STRING);
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// // Connecting to the database
// mongoose.connect(dbConfig.url, {
//     useNewUrlParser: true
// }).then(() => {
//     console.log("Successfully connected to the database");
// }).catch(err => {
//     console.log('Could not connect to the database. Exiting now...', err);
//     process.exit();
// });

// define a simple route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Location Project'
  });
});

//app routes
// app.route("/note")
//     .get(note.getNote)
//     .post(note.postNote);
// app.route("/note/:noteId")
//     .get(note.getNotes)
//     .delete(note.deleteNote)
//     .put(note.updateNote);

// require('./app/routes/note.route')(app);

// listen for requests
app.listen(process.env.PORT, () => {
  console.log(`Our server is running on port ${process.env.PORT} - http://localhost:${process.env.PORT}/`);
});

export default app;
