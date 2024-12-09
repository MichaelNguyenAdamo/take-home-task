import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useMemo } from "react";
import { IRoom } from "../interfaces";
import { ApiService } from "../services/api.service";

type Props = {
  headquarterId?: string;
};

const useGetRoomsQuery = ({ headquarterId }: Props) => {
  const { data, isFetching } = useQuery<AxiosResponse<IRoom[]>>({
    queryKey: ["QK_GET_ROOMS"],
    queryFn: () => ApiService.getRooms(),
    enabled: !!headquarterId,
  });

  const rooms = useMemo(() => data?.data || [], [data]);

  return {
    rooms,
    isFetching,
  };
};

export { useGetRoomsQuery };
