import { DownloadOutlined } from "@ant-design/icons";
import { Col, Dropdown, MenuProps, Row, Typography } from "antd";
import { useState } from "react";
import { AppDateRangePicker, AppSelect } from "./components";
import { useGetHeadquartersQuery } from "./hooks";
import { useGetRoomsQuery } from "./hooks/useGetRooms.query";

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

  const { headquarters, isFetching } = useGetHeadquartersQuery();
  const { rooms, isFetching: isRoomsFetching } = useGetRoomsQuery({
    headquarterId: headquarterId,
  });

  const handleMenuClick: MenuProps["onClick"] = () => {};

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
          />
        </Col>
        <Col span={6}>
          <AppSelect
            label="Select Electricity Meter"
            options={[]}
            placeholder="Select electricity meter"
          />
        </Col>
        <Col span={6}>
          <AppSelect
            label="Select Time Series"
            options={[]}
            placeholder="Select Time Series"
          />
        </Col>
        <Col span={6}>
          <AppDateRangePicker label="Select Date Range" />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div className="flex justify-between items-center">
            <Typography.Title level={4}>Time series 1</Typography.Title>
            <Dropdown.Button
              menu={{
                items,
                onClick: handleMenuClick,
              }}
              type="primary"
              trigger={["click"]}
              icon={<DownloadOutlined />}
              className="flex-none w-auto"
            >
              Download
            </Dropdown.Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default App;
