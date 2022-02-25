import React, { useRef, useState, useEffect } from 'react';

import {
	CardComponent,
	CardContainer,
	CaretContainer,
	Wrapper,
	HoverCard,
} from './styles';
import { CaretDownFilled, CaretUpFilled } from '@ant-design/icons';
import SpanLength from '../SpanLength';
import SpanName from '../SpanName';
import { pushDStree } from 'store/actions';
import { getMetaDataFromSpanTree, getTopLeftFromBody } from '../utils';
import { ITraceMetaData } from '..';
import { Col, Row } from 'antd';
import { SPAN_DETAILS_LEFT_COL_WIDTH } from 'pages/TraceDetail/constants'

const Trace = (props: TraceProps): JSX.Element => {
	const {
		name,
		activeHoverId,
		setActiveHoverId,
		globalSpread,
		globalStart,
		serviceName,
		startTime,
		value,
		serviceColour,
		id,
		setActiveSelectedId,
		activeSelectedId,
		level,
		activeSpanPath,
		isExpandAll
	} = props;

	const [isOpen, setOpen] = useState<boolean>(activeSpanPath[level] === id);

	useEffect(() => {
		setOpen(isExpandAll || activeSpanPath[level] === id)
	}, [isExpandAll, activeSpanPath])
	const isOnlyChild = props.children.length === 1;
	const [top, setTop] = useState<number>(0);

	const ref = useRef<HTMLUListElement>(null);

	const onMouseEnterHandler = () => {
		setActiveHoverId(props.id);
		if (ref.current) {
			const { top } = getTopLeftFromBody(ref.current);
			setTop(top);
		}
	};

	const onMouseLeaveHandler = () => {
		setActiveHoverId('');
	};

	const { totalSpans } = getMetaDataFromSpanTree(props);

	const inMsCount = value / 1e6;
	const nodeLeftOffset = ((startTime * 1e6 - globalStart) * 1e8) / globalSpread;
	const width = (value * 1e8) / globalSpread;
	const toolTipText = `${name}\n${inMsCount} ms`;

	const panelWidth = SPAN_DETAILS_LEFT_COL_WIDTH - level * 9;

	return (
		<>
			<Wrapper
				onMouseEnter={onMouseEnterHandler}
				onMouseLeave={onMouseLeaveHandler}
				isOnlyChild={isOnlyChild}
				ref={ref}
			>
				<HoverCard
					top={top}
					isHovered={activeHoverId === id}
					isSelected={activeSelectedId === id}
				/>

				<CardContainer
					onClick={() => {
						setActiveSelectedId(id);
					}}
				>
					<Col flex={`${panelWidth}px`} style={{ overflow: 'hidden' }}>
						<Row style={{ flexWrap: 'nowrap' }}>
							<Col>
								{totalSpans !== 1 && (
									<CardComponent
										onClick={(e) => {
											e.stopPropagation()
											setOpen((state) => !state);
										}}
									>
										{totalSpans}
										<CaretContainer>
											{!isOpen ? <CaretDownFilled /> : <CaretUpFilled />}
										</CaretContainer>
									</CardComponent>
								)}
							</Col>
							<Col>
								<SpanName name={name} serviceName={serviceName} />
							</Col>
						</Row>
					</Col>
					<Col flex={'1'} >
						<SpanLength
							leftOffset={nodeLeftOffset.toString()}
							width={width.toString()}
							bgColor={serviceColour}
							toolTipText={toolTipText}
							id={id}
							inMsCount={inMsCount}
						/>
					</Col>
				</CardContainer>

				{isOpen && (
					<>
						{props.children.map((child) => (
							<Trace
								key={child.id}
								activeHoverId={props.activeHoverId}
								setActiveHoverId={props.setActiveHoverId}
								{...child}
								globalSpread={globalSpread}
								globalStart={globalStart}
								setActiveSelectedId={setActiveSelectedId}
								activeSelectedId={activeSelectedId}
								level={level + 1}
								activeSpanPath={activeSpanPath}
								isExpandAll={isExpandAll}
							/>
						))}
					</>
				)}
			</Wrapper>
		</>
	);
};

interface ITraceGlobal {
	globalSpread: ITraceMetaData['spread'];
	globalStart: ITraceMetaData['globalStart'];
}

interface TraceProps extends pushDStree, ITraceGlobal {
	activeHoverId: string;
	setActiveHoverId: React.Dispatch<React.SetStateAction<string>>;
	setActiveSelectedId: React.Dispatch<React.SetStateAction<string>>;
	activeSelectedId: string;
	level: number;
	activeSpanPath: string[];
	isExpandAll: boolean;
}

export default Trace;
