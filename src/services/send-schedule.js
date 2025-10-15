import { apiConfig } from "./api-config.js";
import { fetchSchedules } from "./fetch-schedule.js";
import dayjs from "dayjs";

export async function sendSchedule({ id, client, pet, when, services }) {
  try {
    await fetch(`${apiConfig.baseURL}/schedulesPet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, client, pet, when, services })
    })

    fetchSchedules({date: dayjs(when).format("YYYY-MM-DD")})
  } catch(error) {
    console.log(error);
    alert("Não foi possível realizar o agendamento.")
  }
}