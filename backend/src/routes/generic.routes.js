const express = require("express");
const { controller } = require("../controllers/generic.controller");

function crudRoutes(table) {
  const router = express.Router();
  const c = controller(table);
  router.get("/", (req, res) => {
    const store = require("../database/db");
    res.json(store.list(table, { gestion: req.query.gestion }));
  });
  router.get("/:id", c.get);
  router.post("/", c.create);
  router.put("/:id", c.update);
  router.delete("/:id", c.remove);
  return router;
}

module.exports = { crudRoutes };
