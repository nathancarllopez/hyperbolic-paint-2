import { VERTICAL_AXIS_HEIGHT } from "../../constants";

export function getMouseCoordinatesOld(event) {
  const position = event.target.getStage().getPointerPosition();

  return {
    canvasX: position.x,
    canvasY: position.y,
    mathX: position.x - window.innerWidth / 2,
    mathY: Math.floor(VERTICAL_AXIS_HEIGHT - position.y)
  }
}

export function getCanvasCoordinatesOld(mathX, mathY) {
  return {
    canvasX: mathX + window.innerWidth / 2,
    canvasY: Math.floor(VERTICAL_AXIS_HEIGHT - mathY),
    mathX,
    mathY
  }
}

export function getMathCoordinatesOld(canvasX, canvasY) {
  return {
    canvasX,
    canvasY,
    mathX: canvasX - window.innerWidth / 2,
    mathY: Math.floor(VERTICAL_AXIS_HEIGHT - canvasY)
  }
}