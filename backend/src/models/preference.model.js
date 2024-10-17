import mongoose, { Schema } from "mongoose";

const userPreferenceSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  ageGroup: {
    type: String,
    enum: ["15-25", ">25"],
    default: null,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    default: null,
  },
  dateRange: {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userPreferenceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const UserPreference = mongoose.model("UserPreference", userPreferenceSchema);

export { UserPreference };
