const mongoose = require("mongoose");
const Task = require("./task");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    default: "Anon",
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: [6, "Add more than 6 characters"],
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error("Use a Strong password");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number");
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

//Fetch Task
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "user",
});

//Public Profile
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  console.log(userObject);
  return userObject;
};

//Auth Token - Instance Method
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisisshit");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

//Login - Model Methods
userSchema.statics.credentials = async function (email, password) {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Unable to login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Unable to login");
    } else {
      return user;
    }
  } catch (e) {
    return { error: `Something went wrong ${e}` };
  }
};

//Hash the plain text password

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ user: user.id });
});

const User = mongoose.model("User", userSchema);
module.exports = User;
