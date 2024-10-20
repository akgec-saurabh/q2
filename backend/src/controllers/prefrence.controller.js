import { asyncHandler } from "../utils/asyncHandler.js";
import { UserPreference } from "../models/preference.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { parse } from "date-fns";

export const createOrUpdatePreference = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { age, gender, startDate, endDate } = req.body;
  const parsedStartDate = parse(startDate, "dd-MM-yyyy", new Date());
  const parsedEndDate = parse(endDate, "dd-MM-yyyy", new Date());
  const updatedPreference = await UserPreference.findOneAndUpdate(
    { userId },
    {
      $set: {
        ageGroup: age,
        gender,
        "dateRange.startDate": parsedStartDate,
        "dateRange.endDate": parsedEndDate,
      },
    },
    { new: true, upsert: true }
  );
  res
    .status(200)
    .json(new ApiResponse(200, updatedPreference, "Preference updated"));
});

export const getPreference = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const preference = await UserPreference.findOne({ userId });

  if (!preference) {
    return res
      .status(404)
      .json(new ApiError(404, "Preference not found for the user"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, preference, "Preference retrived successfully"));
});

export const deletePreference = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;

  const existingPreference = await UserPreference.findOne({ userId });

  if (!existingPreference) {
    return res
      .status(404)
      .json(new ApiError(404, "Preference not found for the user"));
  }

  await UserPreference.findOneAndDelete({ userId });
  res
    .status(200)
    .json(new ApiResponse(200, null, "Preference deleted successfully"));
});
