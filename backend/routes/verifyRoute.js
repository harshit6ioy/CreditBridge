const express = require("express");
const router = express.Router();
const controller = require("../controllers/verifyController");
const auth = require("../middleware/auth");
const upload = require("../utils/multerConfig");


router.post("/verify-user", controller.verifyUser);


router.post(
  "/apply-loan",
  upload.fields([
    { name: "pan", maxCount: 1 },
    { name: "salarySlip", maxCount: 1 }
  ]),
  controller.applyLoan
);


router.put("/admin/update-loan/:id", auth, controller.adminUpdateLoan);
router.get("/all-loans", auth, controller.getAllLoans);
router.get("/approved-loans", auth, controller.getApprovedLoans);
router.get("/rejected-loans", auth, controller.getRejectedLoans);
router.get("/user-loans/:bankId", controller.getUserLoans);

module.exports = router;
