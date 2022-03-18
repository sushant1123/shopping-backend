const CryptoJS = require("crypto-js");
const User = require("../models/user.model");

exports.register = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		const obj = { username, email };
		if (!password?.length) {
			return res.status(500).json({ message: "Passwod is required" });
		}
		obj.password = await CryptoJS.AES.encrypt(password, process.env.CRYPTO_SECRET).toString();

		const newUser = new User(obj);

		const user = await newUser.save();

		res.status(200).json(user);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

exports.login = async (req, res) => {
	//TODO
};
