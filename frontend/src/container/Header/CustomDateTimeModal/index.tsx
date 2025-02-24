import { Modal } from 'antd';
import React, { useState } from 'react';
export type DateTimeRangeType = [Dayjs | null, Dayjs | null] | null;
import DatePicker from 'components/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

const CustomDateTimeModal = ({
	visible,
	onCreate,
	onCancel,
}: CustomDateTimeModalProps): JSX.Element => {
	const [
		customDateTimeRange,
		setCustomDateTimeRange,
	] = useState<DateTimeRangeType>();

	function handleRangePickerOk(date_time: DateTimeRangeType): void {
		setCustomDateTimeRange(date_time);
	}

	function disabledDate(current: Dayjs): boolean {
		if (current > dayjs()) {
			return true;
		} else {
			return false;
		}
	}

	return (
		<Modal
			visible={visible}
			title="Chose date and time range"
			okText="Apply"
			cancelText="Cancel"
			onCancel={onCancel}
			style={{ position: 'absolute', top: 60, right: 40 }}
			onOk={(): void => onCreate(customDateTimeRange ? customDateTimeRange : null)}
		>
			<RangePicker
				disabledDate={disabledDate}
				onOk={handleRangePickerOk}
				showTime
			/>
		</Modal>
	);
};

interface CustomDateTimeModalProps {
	visible: boolean;
	onCreate: (dateTimeRange: DateTimeRangeType) => void;
	onCancel: () => void;
}

export default CustomDateTimeModal;
