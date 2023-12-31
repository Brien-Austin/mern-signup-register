const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: "string", required: true, unique: true },
    password: { type: "string", required: true },
  },
  { collection: "users" }
);

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
