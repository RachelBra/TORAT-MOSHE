const express = require("express");
const usersController = require("../controllers/users-controller");
const userController = require("../controllers/users-controller");
const usersRouter = express.Router();
const verifyJWT = require("../middleware/verifyJWT")

usersRouter.route("/logIn/:email/:password")//changepassword2
    .get(userController.logIn)

usersRouter.route("/getUserById/:id")//changepassword2
    .get(userController.getUserById)

usersRouter.route("/localStorage/:id")
    .get(userController.localStorage)

usersRouter.route("/register")
    .post(userController.register)

usersRouter.route("/updatePassword1/:email")//token
    .put(userController.updatePassword1)

usersRouter.route("/updatePassword2")//token
    .put(userController.updatePassword2)

usersRouter.route("/CancelReceiptEmails/:id")
    .put(verifyJWT, userController.cancelReceiptEmails)

usersRouter.route("/receiptEmails/:id")
    .put(verifyJWT, userController.confirmReceiptEmails)

usersRouter.route("/emailToManager")
    .put(usersController.sendEmailToManger)

usersRouter.route("/sendEmailToUser")
    .put(usersController.sendEmailToUser)

usersRouter.route("/emailToUsers")
    .put(usersController.sendEmailToUsers)///////fti

usersRouter.route("/authorization")
    .put(userController.updateUserAuthorization) //verifyJWT,

usersRouter.route("/usersList")
    .get(userController.getAllUsers)

module.exports = usersRouter;


