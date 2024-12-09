import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useMemo } from "react";
import { ITimeSeries, ITimeSeriesQuery } from "../interfaces";
import { ApiService } from "../services/api.service";

type Props = {
  query: ITimeSeriesQuery;
};

const useGetTimeSeriesQuery = ({ query }: Props) => {
  const { data, isFetching } = useQuery<AxiosResponse<ITimeSeries[]>>({
    queryKey: ["QK_GET_TIME_SERIES", query],
    queryFn: () => ApiService.getTimeSeries(query),
    enabled: !!query.roomId || !!query.electricityMeterId,
  });

  const timeSeries = useMemo(() => data?.data || [], [data]);

  return {
    timeSeries,
    isFetching,
  };
};

export { useGetTimeSeriesQuery };
