export interface ITimeSeriesQuery {
  roomId?: string;
  electricityMeterId?: string;
}

export interface ITimestampData {
  timestamp: string;
  temperature: string;
  humidity: string;
  energyConsumption: string;
  cost: string;
}

export interface ITimeSeries {
  id: string;
  roomId: string;
  electricityMeterId: string;
  name: string;
  data: ITimestampData[];
}
