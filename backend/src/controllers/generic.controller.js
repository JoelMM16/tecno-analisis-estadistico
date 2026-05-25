const store = require("../database/db");

function controller(table) {
  return {
    list: (_req, res) => res.json(store.all(table)),
    get: (req, res) => res.json(store.get(table, req.params.id)),
    create: (req, res) => res.status(201).json(store.insert(table, req.body)),
    update: (req, res) => res.json(store.update(table, req.params.id, req.body)),
    remove: (req, res) => res.json(store.remove(table, req.params.id))
  };
}

module.exports = { controller };
