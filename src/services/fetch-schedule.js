import { apiConfig } from "./api-config.js";
import dayjs from "dayjs";
import { createSchedules } from "../modules/form/createSchedules.js";

export async function fetchSchedules({date}) {
  try {
    const response = await fetch(`${apiConfig.baseURL}/schedulesPet`);
    const data = await response.json()

    const dailySchedules = data.filter((schedule) => dayjs(date).isSame(schedule.when, "day"));

    // limpa as listas antes de renderizar os novos agendamentos
    document.getElementById("morning").innerHTML = "";
    document.getElementById("afternoon").innerHTML = "";
    document.getElementById("night").innerHTML = "";

    dailySchedules.forEach((schedule) => createSchedules({schedule}))

    return dailySchedules;
  } catch(error) {
    console.log(error);
    alert("Não foi possível exibir os agendamentos desse dia.")
    
  }
} 