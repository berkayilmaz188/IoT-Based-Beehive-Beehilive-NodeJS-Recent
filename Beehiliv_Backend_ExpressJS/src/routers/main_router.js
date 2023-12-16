const router = require("express").Router();
const mainController = require("../controllers/mainController");
const middleware = require("../middlewares/authMiddleware");
const passport = require("passport");
require("../config/passport")(passport);

router.get("/", middleware.ensureAuthenticated, mainController.showMainPage);
router.post("/login", middleware.ensurenotAuthenticated, mainController.login);
router.post(
  "/register",
  middleware.ensurenotAuthenticated,
  mainController.register
);
router.post("/change", middleware.ensureAuthenticated, mainController.change);
router.get("/verify/:mail/:jwt", mainController.verify);
router.post("/getpasswordreset",mainController.sendPasswordReset);
router.post("/passwordreset/:token",mainController.resetPassword);
router.get("/getlog",middleware.ensureAuthenticated,mainController.getLog);
module.exports = router;
