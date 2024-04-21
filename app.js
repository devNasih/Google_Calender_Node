const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3000;
require("dotenv").config();
const dayjs = require("dayjs");
// npm Module which Import
const { google } = require("googleapis");
// This is the Scopes Which the Google Api Provides

const calender = google.calendar({
  version: "v3",
  auth: process.env.GOOGLE_CALENDER_API_KEY,
});

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);
const scopes = ["https://www.googleapis.com/auth/calendar"];
app.get("/google", (req, res) => {
  console.log(
    process.env.GOOGLE_CALENDER_API_KEY,
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  console.log(url);
  res.redirect(url);
});

app.get("/google/redirect", async (req, res) => {
  const code = req.query.code;
  console.log(code);
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  res.json({ message: "You Are Successfully LoggedIn" });
});

app.get("/schedule_events", async (req, res) => {
  console.log(dayjs(new Date()).add(1, "day").toString());
  await calender.events.insert({
    calendarId: "primary",
    auth: oauth2Client,
    requestBody: {
      summary: "Testtttttttttt",
      description: "A chance to hear more about Google's developer products.",
      start: {
        dateTime: dayjs(new Date()).add(1, "day").toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: dayjs(new Date()).add(1, "day").toISOString(),
        timeZone: "Asia/Kolkata",
      },
    },
  });
  res.json({ message: "Done" });
});
app.listen(PORT, () => console.log(`Server Running on PORT:${PORT}`));
