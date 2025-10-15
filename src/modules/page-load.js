import dayjs from "dayjs";
import { fetchSchedules } from "../services/fetch-schedule.js";

document.addEventListener("DOMContentLoaded", async () => {
  const showDate = document.getElementById("dateShow");
  if (!showDate.value) showDate.value = dayjs().format("YYYY-MM-DD");
  await fetchSchedules({ date: showDate.value });
});

document.getElementById("dateShow").addEventListener("change", (e) => {
  fetchSchedules({ date: e.target.value });
});