const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
	try {
		const auth = req.headers.authorization;

		const token = auth?.split(" ")[1];

		if (!token) {
			return res.status(401).json({ message: "You are not authenticated! Please login to continue" });
		}

		await jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
			if (error) {
				return res.status(403).json({ message: "Token is not valid!" });
			}
			if (user) {
				req.user = user;
				next();
			} else {
				return res.status(500).json({ message: "Something went wrong!" });
			}
		});
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

const verifyTokenAndAuthorization = (req, res, next) => {
	try {
		verifyToken(req, res, () => {
			if (req.user.id === req.params.id || req.user.isAdmin) {
				next();
			} else {
				return res.status(403).json({ message: "You are not allowed to perform this action." });
			}
		});
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

const verifyTokenAndAdmin = (req, res, next) => {
	try {
		verifyToken(req, res, () => {
			if (req.user.isAdmin) {
				next();
			} else {
				return res.status(403).json({ message: "You are not allowed to perform this action." });
			}
		});
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
};

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };
