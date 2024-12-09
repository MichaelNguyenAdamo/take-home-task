import { delay } from "../utils";
import { axiosClient } from "./axios.service";

export const ApiService = {
  getHeadquarters: async () => {
    await delay(3000);
    return axiosClient.get("/headquarters");
  },
};
