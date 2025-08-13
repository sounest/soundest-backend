const express = require("express");
const router = express.Router();
const authController = require("../controller/auth-controller");
const { protect } = require("../middlewears/auth-middlewear"); 

router.get("/", authController.home);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/verifyemail", authController.verifyemail);
router.post("/resendOtp", authController.resendOtp);
router.put("/profile", protect, authController.profile); 
router.delete("/delete-account", authController.deleteAccount)
// router.delete("/delete", )

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;



// router.route("/my1app").get((req, res) => {
//     res.status(200).send("Welcome 2nd to my app page");
//   });

// router.get("/myapp", (req, res) => {
//     res.status(200).send("Welcome 2nd to my app page");
//   });