import { delay } from "../utils";
import { axiosClient } from "./axios.service";

export const ApiService = {
  getHeadquarters: async () => {
    await delay(3000);
    return axiosClient.get("/headquarters");
  },
  getRooms: async (headquarterId?: string) => {
    await delay(3000);
    return axiosClient.get("/rooms", { params: { headquarterId } });
  },
  getElectricityMeters: async (headquarterId?: string) => {
    await delay(3000);
    return axiosClient.get("/electricityMeters", {
      params: {
        headquarterId,
      },
    });
  },
};
