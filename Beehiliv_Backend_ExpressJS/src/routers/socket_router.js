const router = require("express").Router();
const socketController = require("../controllers/socketController");
const middleware = require("../middlewares/authMiddleware");



router.get("/", socketController.get);


module.exports = router;