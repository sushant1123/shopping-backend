const mongoose = require("mongoose");

exports.connection = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_ATLAS_URL);
		console.log("connected to te db successfully...");
	} catch (error) {
		console.log(error);
	}
};
