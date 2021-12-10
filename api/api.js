const express = require('express');
const cors = require('cors');
const commands = require('./command.controller');
const bodyParser = require('body-parser');
const config = require('../config');
const path = require('path');
const app = express();
const port = config.port;

/*  Middlewares */
app.use(cors());
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'public')));

/* Routes */
app.get('/api/commands', commands.list);
app.post('/api/commands', commands.add);
// well.. I know I'm not using this HTTP verbs correctly, but who is gonna read this code besides me?
app.put('/api/commands/edit', commands.edit);
app.post('/api/commands/delete', commands.delete);

/* Start */
app.listen(port, () => {
  console.log('-----------------------------------------------');
  console.log(`   API corriendo en http://localhost:${port}`);
  console.log('-----------------------------------------------');
});
