import { Line, LineConfig } from "@ant-design/charts";
import { DownloadOutlined } from "@ant-design/icons";
import { Col, Dropdown, MenuProps, Row, Spin, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { unparse } from "papaparse";
import { useMemo, useState } from "react";
import { toast, TypeOptions } from "react-toastify";
import {
  AppDateRangePicker,
  AppSelect,
  DownloadPreviewModal,
} from "./components";
import {
  useGetElectricityMetersQuery,
  useGetHeadquartersQuery,
  useGetRoomsQuery,
  useGetTimeSeriesByIdQuery,
  useGetTimeSeriesQuery,
} from "./hooks";
import { ITimestampData } from "./interfaces";
import { delay } from "./utils";

const items: MenuProps["items"] = [
  {
    key: "csv",
    label: "Download CSV file",
  },
  {
    key: "json",
    label: "Download JSON file",
  },
  {
    key: "csv-fail",
    label: "Download CSV file (fail)",
  },
  {
    key: "json-fail",
    label: "Download JSON file (fail)",
  },
];

function App() {
  const [headquarterId, setHeadquarterId] = useState<string | undefined>();
  const [roomId, setRoomId] = useState<string | undefined>();
  const [electricityMeterId, setElectricityMeterId] = useState<
    string | undefined
  >();
  const [timeSeriesId, setTimeSeriesId] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [isShowPreviewModal, setIsShowPreviewModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { headquarters, isFetching } = useGetHeadquartersQuery();

  const { rooms, isFetching: isRoomsFetching } = useGetRoomsQuery({
    headquarterId,
  });

  const { electricityMeters, isFetching: isMeterFetching } =
    useGetElectricityMetersQuery({
      headquarterId,
    });

  const { timeSeries, isFetching: isTimeSeriesFetching } =
    useGetTimeSeriesQuery({
      query: {
        ...(roomId && { roomId }),
        ...(electricityMeterId && { electricityMeterId }),
      },
    });

  const { timeSeriesDetail, isFetching: isTimeSeriesDetailFetching } =
    useGetTimeSeriesByIdQuery({
      id: timeSeriesId,
      startDate: dateRange?.[0],
      endDate: dateRange?.[1],
    });

  const chartConfig: LineConfig = useMemo(
    () => ({
      data: {
        value: timeSeriesDetail?.data || [],
        transform: [
          {
            type: "fold",
            fields: [
              ...((roomId && ["temperature", "humidity"]) || []),
              ...((electricityMeterId && ["energyConsumption", "cost"]) || []),
            ],
            key: "type",
            value: "value",
          },
        ],
      },
      xField: (item: ITimestampData) => {
        return dayjs(item.timestamp).format("YYYY-MM-DD");
      },
      yField: "value",
      colorField: "type",
      axis: {
        x: { labelAutoHide: "greedy" },
      },
      smooth: true,
    }),
    [timeSeriesDetail, roomId, electricityMeterId]
  );

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    switch (e.key) {
      case "csv":
        return onDownloadCsvFile();
      case "json":
        return onDownloadJsonFile();
      case "json-fail":
        return onDownloadJsonFile(false);

      default:
        return onDownloadCsvFile(false);
    }
  };

  const onDownloadCsvFile = async (success = true) => {
    if (!timeSeriesDetail) return;

    try {
      setIsDownloading(true);

      if (!success) {
        await delay(3000);
        throw new Error("Download CSV file failed");
      }

      let csvContent = "";

      const timeseriesCSV = unparse(timeSeriesDetail.data, { header: true });
      csvContent += `${timeSeriesDetail?.name}\n${timeseriesCSV}`;

      await delay(3000);

      await onDownloadFile(
        csvContent,
        "text/csv;charset=utf-8;",
        `${timeSeriesDetail.name}.csv`
      );

      onShowNotification(
        "success",
        "The CSV file has been downloaded successfully"
      );

      onShowPreviewModal();
    } catch (error) {
      onShowNotification("error", (error as Error).message);
    } finally {
      setIsDownloading(false);
    }
  };
  const onDownloadJsonFile = async (success = true) => {
    if (!timeSeriesDetail) return;

    try {
      setIsDownloading(true);

      if (!success) {
        await delay(3000);
        throw new Error("Download JSON file failed");
      }

      const jsonContent = JSON.stringify(
        {
          ...timeSeriesDetail.data,
        },
        null,
        2
      );

      await delay(3000);

      await onDownloadFile(
        jsonContent,
        "application/json",
        `${timeSeriesDetail.name}.json`
      );

      onShowNotification(
        "success",
        "The JSON file has been downloaded successfully"
      );

      onShowPreviewModal();
    } catch (error) {
      onShowNotification("error", (error as Error).message);
    } finally {
      setIsDownloading(false);
    }
  };

  const onDownloadFile = (content: string, type: string, fileName: string) => {
    return new Promise((resolve) => {
      const blob = new Blob([content], { type });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      resolve({ success: true });
    });
  };

  const onResetTimeSeries = () => {
    setTimeSeriesId(undefined);
  };

  const onShowPreviewModal = () => {
    setIsShowPreviewModal(true);
  };
  const onClosePreviewModal = () => {
    setIsShowPreviewModal(false);
  };

  const onShowNotification = (type: TypeOptions, message: string) => {
    toast(message, {
      type,
    });
  };

  return (
    <div className="flex flex-col gap-6 py-6 px-8">
      <Typography.Title level={2}>Time Series Download</Typography.Title>
      <Row gutter={[24, 16]}>
        <Col span={6}>
          <AppSelect
            label="Select Headquarter"
            options={headquarters.map((hq) => ({
              label: hq.name,
              value: hq.id,
            }))}
            isFetching={isFetching}
            onChange={(value) => setHeadquarterId(value)}
            value={headquarterId}
            placeholder="Select headquarter"
            showSearch
            optionFilterProp="label"
          />
        </Col>
        {!electricityMeterId && (
          <Col span={6}>
            <AppSelect
              label="Select Room"
              options={rooms.map((room) => ({
                label: room.name,
                value: room.id,
              }))}
              onChange={(value) => setRoomId(value)}
              value={roomId}
              isFetching={isRoomsFetching}
              placeholder="Select room"
              allowClear
              onClear={onResetTimeSeries}
              showSearch
              optionFilterProp="label"
            />
          </Col>
        )}
        {!roomId && (
          <Col span={6}>
            <AppSelect
              label="Select Electricity Meter"
              options={electricityMeters.map((meter) => ({
                label: meter.name,
                value: meter.id,
              }))}
              onChange={(value) => setElectricityMeterId(value)}
              value={electricityMeterId}
              isFetching={isMeterFetching}
              placeholder="Select electricity meter"
              allowClear
              onClear={onResetTimeSeries}
              showSearch
              optionFilterProp="label"
            />
          </Col>
        )}
        <Col span={6}>
          <AppSelect
            label="Select Time Series"
            options={timeSeries.map((e) => ({
              label: e.name,
              value: e.id,
            }))}
            onChange={(value) => setTimeSeriesId(value)}
            value={timeSeriesId}
            isFetching={isTimeSeriesFetching}
            placeholder="Select Time Series"
            showSearch
            optionFilterProp="label"
          />
        </Col>
        {timeSeriesId && (
          <>
            <Col span={6}>
              <AppDateRangePicker
                label="Select Date Range"
                value={dateRange}
                onChange={(date) => {
                  setDateRange(date as [Dayjs, Dayjs] | null);
                }}
              />
            </Col>
          </>
        )}
      </Row>
      {timeSeriesId && (
        <Row>
          <Col span={24}>
            <div className="flex justify-between items-center">
              <Typography.Title level={4}>
                {timeSeriesDetail?.name}
              </Typography.Title>
              <Dropdown.Button
                menu={{
                  items,
                  onClick: handleMenuClick,
                }}
                type="primary"
                trigger={["click"]}
                icon={<DownloadOutlined />}
                className="flex-none w-auto"
                loading={isDownloading}
              >
                Download
              </Dropdown.Button>
            </div>

            <Line
              {...chartConfig}
              loading={isTimeSeriesDetailFetching}
              loadingTemplate={
                <div className="flex justify-center items-center">
                  <Spin />
                </div>
              }
            />
          </Col>
        </Row>
      )}
      <DownloadPreviewModal
        open={isShowPreviewModal}
        centered
        title={timeSeriesDetail?.name}
        onCancel={onClosePreviewModal}
        footer={null}
        width={600}
        timeSeriesDetail={timeSeriesDetail}
        type={roomId ? "room" : "electricityMeter"}
      />
    </div>
  );
}

export default App;
