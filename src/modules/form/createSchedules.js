import dayjs from "dayjs";
import { cancel } from "../../services/cancel.js";

export function createSchedules({schedule}) {
  
  const sectionSchedules = document.getElementById("schedules")
  const newScheduleBtn = document.getElementById("btn-schedule");
  const form = document.querySelector("form");

  const morning = document.getElementById("morning");
  const afternoon = document.getElementById("afternoon");
  const night = document.getElementById("night");
 
  const li = document.createElement("li");
  li.classList.add("schedules")
  li.setAttribute("data-id", schedule.id)

  const div = document.createElement("div");

  const hourSchedule = document.createElement("h3");
  hourSchedule.innerText = dayjs(schedule.when).format("HH:mm");

  const petName = document.createElement("span");
  petName.innerText = schedule.pet;

  const clientName = document.createElement("small");
  clientName.innerText = ` / ${schedule.client}`;

  petName.appendChild(clientName);
  div.append(hourSchedule, petName);

  const servicesElement = document.createElement("span");
  servicesElement.innerText = schedule.services;

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove")
  removeBtn.innerText = "Remover agendamento"

  removeBtn.onclick = async () => {
    await cancel({ id: schedule.id })
    li.remove()
  }

  li.append(div, servicesElement, removeBtn)

  const hourValue = dayjs(schedule.when).hour()
  if(hourValue < 13) {
    morning.append(li)
  } else if (hourValue >= 13 && hourValue < 18){
    afternoon.append(li)
  } else if (hourValue >= 18) {
    night.append(li)
  }
}