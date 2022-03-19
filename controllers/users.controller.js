const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

//update user
exports.updateUser = async (req, res) => {
	try {
		const { id } = req.params;

		if (req.body.password) {
			req.body.password = await CryptoJS.AES.encrypt(
				req.body.password,
				process.env.CRYPTO_SECRET
			).toString();
		}

		const updatedUser = await User.findByIdAndUpdate(id, { $set: req.body }, { new: true });

		const { password, ...rest } = updatedUser._doc;

		res.status(200).json(rest);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

//delete user
exports.deleteUser = async (req, res) => {
	try {
		const { id } = req.params;

		await User.findByIdAndDelete(id);

		res.status(200).json({ message: "User has been deleted successfully!" });
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

//get user
exports.getUserById = async (req, res) => {
	try {
		const { id } = req.params;

		const user = await User.findById(id, { password: 0 });

		res.status(200).json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

//get users
exports.getAllUsers = async (req, res) => {
	try {
		const query = req.query.new;
		const users = query
			? await User.find({}, { password: 0 }).sort({ _id: -1 }).limit(5)
			: await User.find();
		res.status(200).json(users);
	} catch (err) {
		res.status(500).json(err);
	}
};

//get user
exports.getAllUsersStats = async (req, res) => {
	const date = new Date();
	const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

	try {
		const data = await User.aggregate([
			{ $match: { createdAt: { $gte: lastYear } } },
			{
				$project: {
					month: { $month: "$createdAt" },
				},
			},
			{
				$group: {
					_id: "$month",
					total: { $sum: 1 },
				},
			},
		]);
		res.status(200).json(data);
	} catch (err) {
		res.status(500).json(err);
	}
};
