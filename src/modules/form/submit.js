import dayjs from "dayjs";
import { sendSchedule } from "../../services/send-schedule.js";
import { fetchSchedules } from "../../services/fetch-schedule.js";
import { openingHours } from "../../utils/opening-hours.js";

const form = document.querySelector("form");
const clientName = document.getElementById("client");
const petName = document.getElementById("pet");
const phone = document.getElementById("phone");
const servicesDescription = document.getElementById("service");
const dateInputs = document.querySelectorAll('input[type="date"]');
const hourInput = document.getElementById("hourSchedule");

// telefone mask
phone.oninput = () => {
  let value = phone.value.replace(/[^0-9]/g, "");
  if (value.length > 11) value = value.slice(0, 11);
  phone.value =
    value.length <= 10
      ? value.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3")
      : value.replace(/(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
};

// datas mínimas
const todayStr = dayjs().format("YYYY-MM-DD");
dateInputs.forEach((input) => {
  input.value ||= todayStr;
  input.min = todayStr;
});

// submit
form.onsubmit = async (e) => {
  e.preventDefault();

  try {
    const client = clientName.value.trim();
    const pet = petName.value.trim();
    const services = servicesDescription.value.trim();
    const date = document.getElementById("dateSchedule").value;
    const selectedTime = hourInput.value.trim(); // agora é text + datalist

    if (!client || !pet) {
      alert("Por favor, digite corretamente o nome do tutor e do pet.");
      return;
    }
    if (!services) {
      alert("Por favor, insira uma descrição dos serviços.");
      return;
    }
    if (!openingHours.includes(selectedTime)) {
      alert("Selecione um horário válido da lista.");
      return;
    }

    // checagem final de conflito (concorrência)
    const schedules = await fetchSchedules({ date });
    const booked = schedules.map((s) => dayjs(s.when).format("HH:mm"));
    if (booked.includes(selectedTime)) {
      alert("Este horário já foi agendado. Escolha outro.");
      return;
    }

    // gera when a partir da data + hora:minuto
    const [hh, mm] = selectedTime.split(":").map((n) => parseInt(n, 10));
    const when = dayjs(date).hour(hh).minute(mm).second(0).millisecond(0);

    const id = String(Date.now());
    await sendSchedule({ id, client, pet, when, services });

    clientName.value = "";
    petName.value = "";
    phone.value = "";
    servicesDescription.value = "";
    hourInput.value = "";

    window.location.reload();
  } catch (error) {
    console.log(error);
    alert("Não foi possível realizar o agendamento.");
  }
};