import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
			select: false,
		},
		theme: {
			type: String,
			enum: ["dark", "light"],
			default: "dark",
		},
	},
	{ timestamps: true },
);

UserSchema.pre("save", async function () {
	if (!this.isModified("password")) return;
	this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = function (plain) {
	return bcrypt.compare(plain, this.password);
};

export default mongoose.model("User", UserSchema);
