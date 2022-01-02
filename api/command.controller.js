const db = require('../database/db');
const { eventEmitter } = require('../bot/commansUpdater');

const controller = {};

controller.list = (req, res) => {
  const commands = db.getData('/commands');
  eventEmitter.emit('updateCommands', commands); // TODO: remove
  res.send({ commands });
  return commands;
};

controller.add = (req, res) => {
  db.push('/commands[]', {
    name: req.body.name,
    value: req.body.value,
  });
  db.save();
  const commands = db.getData('/commands');
  eventEmitter.emit('updateCommands', commands);
  res.send({ commands });
};
controller.edit = (req, res) => {
  const oldOne = req.body.oldOne;
  const newOne = req.body.newOne;

  let commands = db.getData('/commands');
  commands = commands.map((el) => {
    if (el.name == oldOne.name && el.value == oldOne.value) {
      return { name: newOne.name, value: newOne.value };
    }
    return el;
  });
  db.push('/', { commands });
  db.save();
  eventEmitter.emit('updateCommands', commands);
  res.send({ commands });
};
controller.delete = (req, res) => {
  const name = req.body.name;
  const value = req.body.value;

  let commands = db.getData('/commands');
  commands = commands.filter((el) => el.name != name && el.value != value);
  db.push('/', { commands });
  db.save();
  eventEmitter.emit('updateCommands', commands);
  res.send({ commands });
};

exports.controller = controller;
exports.emitter = eventEmitter;
