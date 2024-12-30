const express = require("express");
const approvalsController = require("../controllers/approvals-controller");
const approvalRouter = express.Router();

approvalRouter.route("/correctionsAndPeirushim")
    .get(approvalsController.getAllCorrectionAndPeirushim) 
    

approvalRouter.route("/corrections")
    .put(approvalsController.updateHandwriting)
    .post(approvalsController.deleteCorrections)
    // .post(approvalsController.addCorrections)

approvalRouter.route("/updateCorr")
    .put(approvalsController.updateCorrections)

approvalRouter.route("/peirushim/:id")
    .get(approvalsController.getHandwritingByIdWithPeirushim)
    .put(approvalsController.approvePeirush)
    .delete(approvalsController.deletePeirush)


// approvalRouter.route("/comments")
//     // .get(approvalsController.getAllComments) 
//     .delete(approvalsController.deleteComment)

// approvalRouter.route("/comments/:id")
//     .put(approvalsController.approveComment)
//     .get(approvalsController.getComment)

module.exports = approvalRouter;