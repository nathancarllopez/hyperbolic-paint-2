import { Line } from "react-konva"
import { VERTICAL_AXIS_HEIGHT } from "../constants";

export default function Axes() {
  return (
    <>
      <Line
        y={VERTICAL_AXIS_HEIGHT}
        points={[0, 0, window.innerWidth, 0]}
        stroke="white"
      />
      <Line
        x={window.innerWidth / 2}
        points={[0, 0, 0, VERTICAL_AXIS_HEIGHT]}
        stroke="white"
      />
    </>
  );
}