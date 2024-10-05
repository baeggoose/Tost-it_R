const express = require("express");
const router = express.Router();

module.exports = (laterController) => {
  router.post("/add", laterController.addLater);
  router.get("/", laterController.getLaters);
  router.put("/edit/:id", laterController.updateLater);
  router.delete("/delete/:id", laterController.deleteLater);

  return router;
};
