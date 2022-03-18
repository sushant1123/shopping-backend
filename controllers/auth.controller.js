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

//TODO
exports.login = async (req, res) => {
	try {
		const { username } = req.body;

		const user = await User.findOne({ username: username });

		if (!user) {
			return res.status(401).json({ message: "Wrong credentials" });
		}

		const hashedPass = await CryptoJS.AES.decrypt(user.password, process.env.CRYPTO_SECRET);
		const pwd = hashedPass.toString(CryptoJS.enc.Utf8);

		if (pwd !== req.body.password) {
			return res.status(401).json({ message: "Wrong credentials" });
		}

		const { password, ...rest } = user._doc;

		return res.status(200).json(rest);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};
