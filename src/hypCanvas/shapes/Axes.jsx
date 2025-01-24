import { Group, Line, Text } from "react-konva"
import { AXES_COLOR, AXES_LABEL_FONT_SIZE, AXES_STROKE_WIDTH, AXIS_TICK_LENGTH, AXIS_TICK_SEPARATION, VERTICAL_AXIS_HEIGHT } from "../../util/constants";
import { Fragment } from "react";

export default function Axes({
  // originCoords,
  originX,
  getMathCoordinates,
  toolbarState,
  zoomScale
}) {
  const vertTicks = [];
  let position = VERTICAL_AXIS_HEIGHT;
  while (position > 0) {
    position -= AXIS_TICK_SEPARATION;
    const { mathY: label } = getMathCoordinates(originX, position);
    vertTicks.push({ position, label });
  }

  const posHorzTicks = [];
  position = originX;
  while (position < window.innerWidth) {
    position += AXIS_TICK_SEPARATION;
    const { mathX: label } = getMathCoordinates(position, VERTICAL_AXIS_HEIGHT);
    posHorzTicks.push({ position, label });
  }

  const negHorzTicks = [];
  position = originX;
  while (position > 0) {
    position -= AXIS_TICK_SEPARATION;
    const { mathX: label } = getMathCoordinates(position, VERTICAL_AXIS_HEIGHT);
    negHorzTicks.push({ position, label });
  }

  return (
    <Group>
      {/** Horizontal */}
      <Line 
        points={[0, VERTICAL_AXIS_HEIGHT, window.innerWidth, VERTICAL_AXIS_HEIGHT]}
        stroke={AXES_COLOR}
        strokeWidth={AXES_STROKE_WIDTH}
      />
      {
        toolbarState.showAxisTicks && posHorzTicks.map(({ position, label }, idx) => (
          <Fragment key={idx}>
            <Line
              points={[position, VERTICAL_AXIS_HEIGHT - AXIS_TICK_LENGTH, position, VERTICAL_AXIS_HEIGHT + AXIS_TICK_LENGTH]}
              stroke={AXES_COLOR}
            />
            <Text
              x={position + AXES_LABEL_FONT_SIZE / 2}
              y={VERTICAL_AXIS_HEIGHT + AXIS_TICK_LENGTH + 5}
              text={label}
              fill={AXES_COLOR}
              fontSize={AXES_LABEL_FONT_SIZE}
              rotation={90}
            />
          </Fragment>
        ))
      }
      {
        toolbarState.showAxisTicks && negHorzTicks.map(({ position, label }, idx) => (
          <Fragment key={idx}>
            <Line
              points={[position, VERTICAL_AXIS_HEIGHT - AXIS_TICK_LENGTH, position, VERTICAL_AXIS_HEIGHT + AXIS_TICK_LENGTH]}
              stroke={AXES_COLOR}
            />
            <Text
              x={position + AXES_LABEL_FONT_SIZE / 2}
              y={VERTICAL_AXIS_HEIGHT + AXIS_TICK_LENGTH + 5}
              text={label}
              fill={AXES_COLOR}
              fontSize={AXES_LABEL_FONT_SIZE}
              rotation={90}
            />
          </Fragment>
        ))
      }

      {/** Vertical */}
      <Line
        points={[originX, 0, originX, VERTICAL_AXIS_HEIGHT]}
        stroke={AXES_COLOR}
        strokeWidth={AXES_STROKE_WIDTH}
      />
      {
        toolbarState.showAxisTicks && vertTicks.map(({ position, label }, idx) => (
          <Fragment key={idx}>
            <Line
              points={[originX - AXIS_TICK_LENGTH, position, originX + AXIS_TICK_LENGTH, position]}
              stroke={AXES_COLOR}
            />
            <Text
              x={originX + AXIS_TICK_LENGTH + 5}
              y={position - AXES_LABEL_FONT_SIZE / 2}
              text={label}
              fill={AXES_COLOR}
              fontSize={AXES_LABEL_FONT_SIZE}
            />
          </Fragment>
        ))
      }
    </Group>
  );
}