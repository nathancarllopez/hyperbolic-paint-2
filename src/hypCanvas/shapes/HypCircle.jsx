import { FREE_ANCHOR_COLOR, FIXED_ANCHOR_COLOR } from "../../util/constants";
import { Circle, Group } from "react-konva";
import Point from "./Point";
import { getHypCircleParams } from "../math/geometry";

export default function HypCircle({
  id,
  clicked1,
  clicked2,
  getMathCoordinates,
  getCanvasCoordinates,
  onDragStart,
  onDragMove,
  onDragEnd,
  isSelected,
  color,
  strokeWidth,
  anchorRadius,
  originY
}) {
  const center = clicked1.params;
  const anchor = clicked2.params;
  const { eucCenter, radius } = getHypCircleParams(center, anchor, getCanvasCoordinates);

  function handleCenterDragMove(event) {
    const konvaCenter = event.target;
    const centerCoords = getMathCoordinates(konvaCenter.x(), konvaCenter.y());

    const dispVector = {
      x: anchor.canvasX - center.canvasX,
      y: anchor.canvasY - center.canvasY
    };
    const anchorY = centerCoords.canvasY + dispVector.y;
    const awayFromBoundary = anchorY < originY - anchorRadius;
    const anchorCoords = awayFromBoundary ?
      getMathCoordinates(centerCoords.canvasX + dispVector.x, centerCoords.canvasY + dispVector.y) : 
      { ...clicked2.params };
    
    const newParams = {
      clicked1: {
        ...clicked1,
        params: centerCoords,
      },
      clicked2: {
        ...clicked2,
        params: anchorCoords
      }
    };
    const drawingId = konvaCenter.getParent().id();

    onDragMove(event, newParams, drawingId);
  }

  function handleAnchorDragMove(event) {
    const konvaAnchor = event.target;

    const newParams = {
      clicked1: { ...clicked1 },
      clicked2: {
        ...clicked2,
        params: getMathCoordinates(konvaAnchor.x(), konvaAnchor.y()),
      }
    };
    const drawingId = konvaAnchor.getParent().id();

    onDragMove(event, newParams, drawingId);
  }

  return (
    <Group id={id}>
      <Circle 
        x={eucCenter.canvasX}
        y={eucCenter.canvasY}
        radius={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        listening={false}
      />
      <Point
        clickedX={center.canvasX}
        clickedY={center.canvasY}
        getMathCoordinates={getMathCoordinates}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={handleCenterDragMove}
        color={FIXED_ANCHOR_COLOR}
        strokeWidth={strokeWidth}
        isSelected={isSelected}
        radius={anchorRadius}
        originY={originY}
      />
      <Point
        clickedX={anchor.canvasX}
        clickedY={anchor.canvasY}
        getMathCoordinates={getMathCoordinates}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragMove={handleAnchorDragMove}
        color={FREE_ANCHOR_COLOR}
        strokeWidth={strokeWidth}
        isSelected={isSelected}
        radius={anchorRadius}
        originY={originY}
      />
    </Group>
  );
}