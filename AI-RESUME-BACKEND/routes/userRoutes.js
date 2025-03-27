const express = require("express");
const { getUserById, deleteUser } = require("../controllers/userController");
const router = express.Router();

router.get("/getuser/:id", getUserById);
router.delete("/deleteuser/:id", deleteUser);

module.exports = router;
