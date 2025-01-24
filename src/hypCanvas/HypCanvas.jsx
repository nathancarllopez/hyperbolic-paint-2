import { useEffect, useState, useRef } from "react";
import { Label, Layer, Stage, Tag, Text, Rect, Group } from "react-konva";
import Konva from "konva";

import Axes from "./shapes/Axes";
import Geodesic from "./shapes/Geodesic";
import Point from "./shapes/Point";
import { ACTIVE_POINT_COLOR, CURSOR_COORD_COLOR, CURSOR_FONT_SIZE, HOLD_DURATION_THRESHOLD, VERTICAL_AXIS_HEIGHT } from "../util/constants";
// import { getMathCoordinatesOld, getMouseCoordinatesOld } from "./math/coordinates";
import Horocycle from "./shapes/Horocycle";
import { generateId } from "../util/generateId";
import HypCircle from "./shapes/HypCircle";
import Segment from "./shapes/Segment";
import Polygon from "./shapes/Polygon";
import CenterOfRotation from "./animation shapes/CenterOfRotation";

export default function HypCanvas({
  toolbarState,
  mouseCoords,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  // canvasIsDragging,
  originX,
  getMathCoordinates,
  zoomScale,
  children
}) {
  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      {/* AXES LAYER */}
      <Layer>
        <Axes 
          originX={originX}
          getMathCoordinates={getMathCoordinates}
          toolbarState={toolbarState}
          zoomScale={zoomScale}
        />
      </Layer>

      {/* CURSOR LAYER */}
      <Layer>
        {/* {
          toolbarState.showMouseCoords && mouseCoords && !canvasIsDragging && 
            <Text
              x={mouseCoords.canvasX}
              y={mouseCoords.canvasY}
              offsetX={-5}
              offsetY={CURSOR_FONT_SIZE * 1.1}
              text={`(${mouseCoords.mathX}, ${mouseCoords.mathY})`}
              fill={CURSOR_COORD_COLOR}
              fontSize={CURSOR_FONT_SIZE}
            />
        } */}
        {
          toolbarState.showMouseCoords && mouseCoords && 
            <Text
              x={mouseCoords.canvasX}
              y={mouseCoords.canvasY}
              offsetX={-5}
              offsetY={CURSOR_FONT_SIZE * 1.1}
              text={`(${mouseCoords.mathX}, ${mouseCoords.mathY})`}
              fill={CURSOR_COORD_COLOR}
              fontSize={CURSOR_FONT_SIZE}
            />
        }
      </Layer>

      {/* SHAPES LAYER */}
      <Layer>{ children }</Layer>
    </Stage>
  );
}