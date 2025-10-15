import { apiConfig } from "./api-config.js";

export async function cancel({id}) {
  try {
      await fetch(`${apiConfig.baseURL}/schedulesPet/${id}`, {
        method: "DELETE",
      })
  } catch (error) {
    console.log(error);
    alert("Não foi possível realizar o cancelamento.")
    
  }
}
