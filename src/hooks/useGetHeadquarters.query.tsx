import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useMemo } from "react";
import { IHeadquarter } from "../interfaces";
import { ApiService } from "../services/api.service";

const useGetHeadquartersQuery = () => {
  const { data, isFetching } = useQuery<AxiosResponse<IHeadquarter[]>>({
    queryKey: ["QK_GET_HEADQUARTERS"],
    queryFn: () => {
      return ApiService.getHeadquarters();
    },
  });

  const headquarters = useMemo(() => data?.data || [], [data]);

  return {
    headquarters,
    isFetching,
  };
};

export { useGetHeadquartersQuery };
