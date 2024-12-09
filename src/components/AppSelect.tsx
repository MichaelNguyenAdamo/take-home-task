import { Select, SelectProps } from "antd";

interface Props extends SelectProps {
  label: string;
  isFetching?: boolean;
}

const AppSelect = ({
  label,
  options,
  onPopupScroll,
  isFetching,
  ...rest
}: Props) => {
  return (
    <div className="flex flex-col gap-1">
      <label>{label}</label>
      <Select
        className="w-full"
        onPopupScroll={onPopupScroll}
        options={options}
        loading={isFetching}
        {...rest}
      />
    </div>
  );
};

export { AppSelect };
