const express = require("express");

const treeController = require("../controllers/tree-controller");

const treeRouter = express.Router();

treeRouter.route("/")
    .post(treeController.addFolder)
    .get(treeController.getAllParentFolders)
    .put(treeController.updateDescription)
treeRouter.route("/deleteFolders")
    .post(treeController.deleteFolders)
// treeRouter.route("/fullTree")
//     .get(treeController.getAll)
treeRouter.route("/:id")
    .get(treeController.getAllFoldersByParent)
    .delete(treeController.deleteFolder)
treeRouter.route("/find")//כנראה לא צריך
    .get(treeController.getAllDescriptions)

treeRouter.route("/:id/:parent")
    .put(treeController.updateParent)

module.exports = treeRouter;