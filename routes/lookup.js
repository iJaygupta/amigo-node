var express = require("express");
const LookupController = require("../controllers/LookupController");

var router = express.Router();

router.post("/upload", LookupController.uploadCSV);


module.exports = router;