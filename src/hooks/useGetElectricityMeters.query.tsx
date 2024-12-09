import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useMemo } from "react";
import { IElectricityMeter } from "../interfaces";
import { ApiService } from "../services/api.service";

type Props = {
  headquarterId?: string;
};

const useGetElectricityMetersQuery = ({ headquarterId }: Props) => {
  const { data, isFetching } = useQuery<AxiosResponse<IElectricityMeter[]>>({
    queryKey: ["QK_GET_ELECTRICITY_METERS", headquarterId],
    queryFn: () => ApiService.getElectricityMeters(headquarterId),
    enabled: !!headquarterId,
  });

  const electricityMeters = useMemo(() => data?.data || [], [data]);

  return {
    electricityMeters,
    isFetching,
  };
};

export { useGetElectricityMetersQuery };
