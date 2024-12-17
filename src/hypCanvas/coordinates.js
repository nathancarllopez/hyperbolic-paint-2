import { VERTICAL_AXIS_HEIGHT } from "./constants";

export function getPointerCoordinates(event) {
  const position = event.target.getStage().getPointerPosition();

  return {
    canvasX: position.x,
    canvasY: position.y,
    mathX: position.x - window.innerWidth / 2,
    mathY: Math.floor(VERTICAL_AXIS_HEIGHT - position.y)
  }
}

export function getCanvasCoordinates(mathX, mathY) {}

export function getMathCoordinates(canvasX, canvasY) {}