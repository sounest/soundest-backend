const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getAllContacts,
  getAllArtists,
  deleteOneuser,
  deleteOneAllcontact,
  deleteOneartists,
  approveartists,
  postlogin,
  register,
} = require("../controller/admin-controller");

const { protect } = require("../middlewears/auth-middlewear");
const { adminmiddlewear } = require("../middlewears/admin-middlewear");

router.post("/adminlogin", postlogin);
router.post("/register", register);

router.get("/users", protect, adminmiddlewear, getAllUsers);
router.get("/contacts", protect, adminmiddlewear, getAllContacts);
router.get("/artists", protect, adminmiddlewear, getAllArtists);

router.delete("/users/:id", protect, adminmiddlewear, deleteOneuser);
router.delete("/contacts/:id", protect, adminmiddlewear, deleteOneAllcontact);
router.delete("/artists/:id", protect, adminmiddlewear, deleteOneartists);

router.patch("/artists/:id/approve", protect, adminmiddlewear, approveartists);

module.exports = router;
