import { Group, Line, Text } from "react-konva"
import { AXES_COLOR, AXES_LABEL_FONT_SIZE, AXES_STROKE_WIDTH, AXIS_TICK_LENGTH, AXIS_TICK_SEPARATION, VERTICAL_AXIS_HEIGHT } from "../../util/constants";
import { Fragment } from "react";

export default function Axes({
  // originX,
  originCoords,
  getMathCoordinates,
  settings,
  zoomScale
}) {
  const vertTicks = [];
  let position = originCoords.y;
  while (position > 0) {
    position -= AXIS_TICK_SEPARATION;
    const { mathY: label } = getMathCoordinates(originCoords.x, position);
    vertTicks.push({ position, label });
  }

  const posHorzTicks = [];
  position = originCoords.x;
  while (position < window.innerWidth) {
    position += AXIS_TICK_SEPARATION;
    const { mathX: label } = getMathCoordinates(position, originCoords.y);
    posHorzTicks.push({ position, label });
  }

  const negHorzTicks = [];
  position = originCoords.x;
  while (position > 0) {
    position -= AXIS_TICK_SEPARATION;
    const { mathX: label } = getMathCoordinates(position, originCoords.y);
    negHorzTicks.push({ position, label });
  }

  return (
    <Group>
      {/** Horizontal */}
      <Line 
        points={[0, originCoords.y, window.innerWidth, originCoords.y]}
        stroke={AXES_COLOR}
        strokeWidth={AXES_STROKE_WIDTH}
      />
      {
        settings.showAxisTicks && posHorzTicks.map(({ position, label }, idx) => (
          <Fragment key={idx}>
            <Line
              points={[position, originCoords.y - AXIS_TICK_LENGTH, position, originCoords.y + AXIS_TICK_LENGTH]}
              stroke={AXES_COLOR}
            />
            <Text
              x={position + AXES_LABEL_FONT_SIZE / 2}
              y={originCoords.y + AXIS_TICK_LENGTH + 5}
              text={label}
              fill={AXES_COLOR}
              fontSize={AXES_LABEL_FONT_SIZE}
              rotation={90}
            />
          </Fragment>
        ))
      }
      {
        settings.showAxisTicks && negHorzTicks.map(({ position, label }, idx) => (
          <Fragment key={idx}>
            <Line
              points={[position, originCoords.y - AXIS_TICK_LENGTH, position, originCoords.y + AXIS_TICK_LENGTH]}
              stroke={AXES_COLOR}
            />
            <Text
              x={position + AXES_LABEL_FONT_SIZE / 2}
              y={originCoords.y + AXIS_TICK_LENGTH + 5}
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
        points={[originCoords.x, 0, originCoords.x, originCoords.y]}
        stroke={AXES_COLOR}
        strokeWidth={AXES_STROKE_WIDTH}
      />
      {
        settings.showAxisTicks && vertTicks.map(({ position, label }, idx) => (
          <Fragment key={idx}>
            <Line
              points={[originCoords.x - AXIS_TICK_LENGTH, position, originCoords.x + AXIS_TICK_LENGTH, position]}
              stroke={AXES_COLOR}
            />
            <Text
              x={originCoords.x + AXIS_TICK_LENGTH + 5}
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