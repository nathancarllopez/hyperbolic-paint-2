/** For mobile devices */
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

/** For canvas */
export const ACTIVE_POINT_COLOR = "yellow";
export const CURSOR_COORD_COLOR = "white";
export const CURSOR_FONT_SIZE = 24;
export const FIXED_ANCHOR_COLOR = "red";
export const FREE_ANCHOR_COLOR = "blue";
export const ANIMATION_SHAPE_COLOR = "orange";
export const DASH_LENGTH = 10;
export const DASH_SEPARATION = 20;
export const AXIS_TICK_LENGTH = 4;
export const AXIS_TICK_SEPARATION = 50;
export const AXES_COLOR = "gray";
export const AXES_LABEL_FONT_SIZE = 12;
export const AXES_STROKE_WIDTH = 2;
export const SELECT_BOX_COLOR = "white";

/** Math */
export const EPSILON = 1e-3;

/** Initial state values */
export const INITIAL_SETTINGS = {
  showMouseCoords: true,
  showAxisTicks: true,
  showToolbarInstructions: true,
  pointRadius: 8,
  holdDuration: 500,
  toastDuration: 5000
};
export const INITIAL_ORIGIN_COORDS = {
  x: window.innerWidth / 2,
  y: isTouchDevice ? window.innerHeight * 0.90 : window.innerHeight * 0.95
};
export const INITIAL_CANVAS_DIMENSIONS = {
  width: window.innerWidth,
  height: window.innerHeight
};

/** For code */
export const ANIMATION_TOOLNAMES = ['rotation', 'translation'];

/** Candidates for settings */
export const ERROR_MESSAGE_DURATION = 3 * 1000;

/** To be deleted */
export const ANIM_SPEED_DAMPENER = 0.1;


