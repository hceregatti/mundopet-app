import dayjs from "dayjs";
import { fetchSchedules } from "../services/fetch-schedule.js";
import { openingHours } from "../utils/opening-hours.js"; // array de "HH:mm"

// Preenche a lista (datalist)
function populateHoursList(hours = []) {
  const hourList = document.getElementById("hourList");
  hourList.innerHTML = "";
  hours.forEach((time) => {
    const option = document.createElement("option");
    option.value = time;
    hourList.appendChild(option);
  });
}

// Calcula horários livres com base na data
async function updateAvailableHours(date) {
  const now = dayjs(); // hora atual
  let selectedDate = dayjs(date).startOf("day"); // data escolhida no input

  // ⚠️ Se a data for hoje e a hora atual for depois do último horário disponível:
  const lastHour = openingHours[openingHours.length - 1];
  const lastHourToday = dayjs()
    .hour(parseInt(lastHour.split(":")[0]))
    .minute(parseInt(lastHour.split(":")[1]));

  if (selectedDate.isSame(now, "day") && now.isAfter(lastHourToday)) {
    // 👉 muda automaticamente a data para amanhã
    selectedDate = now.add(1, "day").startOf("day");
    document.getElementById("dateSchedule").value =
      selectedDate.format("YYYY-MM-DD");
  }

  // 📅 busca os agendamentos da data atualizada
  const schedules = await fetchSchedules({
    date: selectedDate.format("YYYY-MM-DD"),
  });
  const bookedHours = schedules.map((s) => dayjs(s.when).format("HH:mm"));

  // 🧠 se for hoje, filtra também horários que já passaram
  const freeHours = openingHours.filter((hour) => {
    const [h, m] = hour.split(":").map(Number);
    const thisTime = selectedDate.hour(h).minute(m);

    // se for hoje, só deixa horários futuros
    if (selectedDate.isSame(now, "day")) {
      return !bookedHours.includes(hour) && thisTime.isAfter(now);
    }
    // se for outra data, só remove os que já estão ocupados
    return !bookedHours.includes(hour);
  });

  populateHoursList(freeHours);
}
// Controla abrir/fechar formulário
export function formIn() {
  const newScheduleBtn = document.getElementById("btn-schedule");
  const form = document.querySelector("form");
  const sectionSchedules = document.getElementById("schedules");

  const clientName = document.getElementById("client");
  const petName = document.getElementById("pet");
  const phone = document.getElementById("phone");
  const serviceDescription = document.getElementById("service");
  const dateInput = document.getElementById("dateSchedule");

  newScheduleBtn.addEventListener("click", async () => {
    form.classList.remove("hidden");
    newScheduleBtn.classList.add("hidden");
    sectionSchedules.classList.add("active");

    const today = dayjs().format("YYYY-MM-DD");
    document.getElementById("dateSchedule").value = today;

    const date = today;
    dateInput.value = date;

    await updateAvailableHours(today);

    const closeForm = document.getElementById("btn-close");
    closeForm.onclick = () => {
      sectionSchedules.classList.remove("active");
      form.classList.add("hidden");
      newScheduleBtn.classList.remove("hidden");

      clientName.value = "";
      petName.value = "";
      phone.value = "";
      serviceDescription.value = "";
      document.getElementById("hourSchedule").value = "";
    };
  });
}

// Inicializa: define data e procura horários livres
document.addEventListener("DOMContentLoaded", async () => {
  const dateInput = document.getElementById("dateSchedule");
  const today = dayjs().format("YYYY-MM-DD");
  dateInput.value = today;

  // procura inicialmente com todos (ou já filtrado do dia atual)
  await updateAvailableHours(today);

  // quando o usuário mudar a data do formulário, atualiza a lista
  dateInput.addEventListener("change", async (e) => {
    await updateAvailableHours(e.target.value);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  hoursList(openingHours);
});

formIn();
