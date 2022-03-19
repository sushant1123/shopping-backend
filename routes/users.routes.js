const express = require("express");
const router = express.Router();

const {
	updateUser,
	deleteUser,
	getUserById,
	getAllUsers,
	getAllUsersStats,
} = require("../controllers/users.controller");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middlewares/verifyToken");

router.put("/:id", verifyTokenAndAuthorization, updateUser);
router.delete("/:id", verifyTokenAndAuthorization, deleteUser);
router.get("/find/:id", verifyTokenAndAdmin, getUserById);
router.get("/", verifyTokenAndAdmin, getAllUsers);
router.get("/stats", verifyTokenAndAdmin, getAllUsersStats);

module.exports = router;
