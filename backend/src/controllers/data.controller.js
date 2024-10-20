import { asyncHandler } from "../utils/asyncHandler.js";
import { google } from "googleapis";
import { GOOGLE_SHEET_API_KEY, SPREADSHEET_ID } from "../constants.js";
import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

import { parse, isValid } from "date-fns";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getFeatures = asyncHandler(async (req, res) => {
  const { age, gender, startDate, endDate } = req.query;

  if (!validationResult(req).isEmpty()) {
    return res
      .status(400)
      .json(
        new ApiError(400, "Validation failed", validationResult(req).array())
      );
  }

  const sheets = google.sheets({
    version: "v4",
    auth: GOOGLE_SHEET_API_KEY,
  });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet3",
  });

  const rows = transformData(response.data.values);

  if (!rows || rows.length === 0) {
    return res.status(404).json(new ApiError(404, "No data found"));
  }

  const filterData = rows.filter(
    (row) =>
      (!age || age === row.Age) &&
      (!gender ||
        (row.Gender && gender.toLowerCase() === row.Gender.toLowerCase())) &&
      (!startDate ||
        parse(row.Day, "dd/MM/yyyy", new Date()) >=
          parse(startDate, "dd/MM/yyyy", new Date())) &&
      (!endDate ||
        parse(row.Day, "dd/MM/yyyy", new Date()) <=
          parse(endDate, "dd/MM/yyyy", new Date()))
  );

  const aggregatedData = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
  };

  filterData.forEach((row) => {
    aggregatedData.A += row.A;
    aggregatedData.B += row.B;
    aggregatedData.C += row.C;
    aggregatedData.D += row.D;
    aggregatedData.E += row.E;
    aggregatedData.F += row.F;
  });

  const transformedData = Object.keys(aggregatedData).map((feature) => ({
    feature: feature,
    total: aggregatedData[feature],
  }));

  res.status(200).json(
    new ApiResponse(
      200,
      {
        total: filterData.length,
        data: {
          Gender: !gender ? "All" : gender,
          Age: !age ? "All" : age,
          StartDate: !startDate ? "All" : startDate,
          EndDate: !endDate ? "All" : endDate,
          data: transformedData,
        },
      },
      "Success"
    )
  );
});

const transformData = (data) => {
  const headers = data[0]; // The first element is the headers
  const result = [];

  for (let i = 1; i < data.length; i++) {
    // Start from the second row
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = data[i][j]; // Assign header as key and data as value
    }
    result.push(obj); // Push the object into the result array
  }

  const transformedData = result.map((row) => ({
    ...row,
    A: Number(row.A),
    B: Number(row.B),
    C: Number(row.C),
    D: Number(row.D),
    E: Number(row.E),
    F: Number(row.F),
  }));

  return transformedData;
};

export const getTrend = asyncHandler(async (req, res) => {
  const { feature, age, gender, startDate, endDate } = req.query;

  if (!validationResult(req).isEmpty()) {
    return res
      .status(400)
      .json(
        new ApiError(400, "Validation failed", validationResult(req).array())
      );
  }

  const sheets = google.sheets({
    version: "v4",
    auth: GOOGLE_SHEET_API_KEY,
  });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet3",
  });

  const rows = transformData(response.data.values);

  if (!rows || rows.length === 0) {
    return res.status(404).json(new ApiError(404, "No data found"));
  }

  const filteredData = rows.filter(
    (row) =>
      (!age || age === row.Age) &&
      (!gender || gender.toLowerCase() === row.Gender.toLowerCase()) &&
      (!startDate ||
        parse(row.Day, "dd/MM/yyyy", new Date()) >=
          parse(startDate, "dd/MM/yyyy", new Date())) &&
      (!endDate ||
        parse(row.Day, "dd/MM/yyyy", new Date()) <=
          parse(endDate, "dd/MM/yyyy", new Date()))
  );

  const trendData = filteredData.reduce((acc, row) => {
    const day = row.Day;
    const value = row[feature];

    if (!acc[day]) {
      acc[day] = 0;
    }
    acc[day] += value;

    return acc;
  }, {});

  const transformedTrendData = Object.keys(trendData).map((date) => ({
    date,
    total: trendData[date],
  }));

  res.status(200).json(
    new ApiResponse(
      200,
      {
        feature,
        total: transformedTrendData.length,
        trendData: transformedTrendData,
      },
      "Success"
    )
  );
});
