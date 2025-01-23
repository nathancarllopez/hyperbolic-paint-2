import { EPSILON, VERTICAL_AXIS_HEIGHT } from "../../constants";

export function getGeodesicParams(anchor1, anchor2, getMathCoordinates) {
  const xSeparation = anchor2.canvasX - anchor1.canvasX;
  const isACircle = Math.abs(xSeparation) > EPSILON;

  const center = isACircle ? computeGeodesicCenter(anchor1, anchor2) : Infinity;
  const radius = isACircle ? computeGeodesicRadius(anchor1, center, getMathCoordinates) : Infinity;

  return { isACircle, center, radius }
}

export function getHypCircleParams(center, anchor, getCanvasCoordinates) {
  const computeRadius = (eucCenter) => {
    return Math.sqrt((eucCenter.canvasX - anchor.canvasX) ** 2 + (eucCenter.canvasY - anchor.canvasY) ** 2);
  }

  const deltaX = anchor.mathX - center.mathX;
  if (Math.abs(deltaX) < EPSILON) {
    const mathY = (anchor.mathY ** 2 + center.mathY ** 2) / (2 * anchor.mathY);
    const eucCenter = getCanvasCoordinates(center.mathX, mathY);
    const radius = computeRadius(eucCenter);

    return { eucCenter, radius };
  }

  const deltaY = anchor.mathY - center.mathY;
  const midpointX = (anchor.mathX + center.mathX) / 2;
  const midpointY = (anchor.mathY + center.mathY) / 2;
  const slope = deltaY / deltaX;
  const centerOfGeod = midpointX + midpointY * slope;

  const mathY = anchor.mathY + (centerOfGeod - anchor.mathX) * (center.mathX - anchor.mathX) / anchor.mathY;
  const eucCenter = getCanvasCoordinates(center.mathX, mathY);
  const radius = computeRadius(eucCenter);
  
  return { eucCenter, radius };
}

export function getSegmentParams(anchor1, anchor2, getMathCoordinates) {
  const { isACircle, center, radius } = getGeodesicParams(anchor1, anchor2, getMathCoordinates);

  const xSeparation = anchor2.canvasX - anchor1.canvasX;
  const rightAnchor = xSeparation < 0 ? anchor1 : anchor2;
  const leftAnchor = xSeparation < 0 ? anchor2 : anchor1;
  const rotationAngle = computeAnchorAngle(rightAnchor, center, getMathCoordinates);
  const arcAngle = computeAnchorAngle(leftAnchor, center, getMathCoordinates) - rotationAngle;

  return { isACircle, center, radius, rotationAngle, arcAngle, anchor1, anchor2 };
}

export function getPolygonParams(anchors, getMathCoordinates) {
  return anchors.map((anchor, idx) => {
    const nextAnchor = anchors[(idx + 1) % anchors.length];
    return getSegmentParams(anchor, nextAnchor, getMathCoordinates);
  });
}

function computeGeodesicCenter(anchor1, anchor2) {
  const deltaY = anchor2.mathY - anchor1.mathY;
  const midpointX = (anchor2.mathX + anchor1.mathX) / 2;

  if (Math.abs(deltaY) < EPSILON) {
    return midpointX + window.innerWidth / 2;
  }

  const deltaX = anchor2.mathX - anchor1.mathX;
  const midpointY = (anchor2.mathY + anchor1.mathY) / 2;
  const slope = deltaY / deltaX;
  const perpSlope = -1 / slope;
  const yIntercept = midpointY - perpSlope * midpointX;
  const mathCenter = -yIntercept / perpSlope;
  
  return mathCenter + window.innerWidth / 2;
}

function computeGeodesicRadius(anchor, center, getMathCoordinates) {
  const { mathX } = getMathCoordinates(center, VERTICAL_AXIS_HEIGHT);
  return Math.sqrt((anchor.mathX - mathX) ** 2 + (anchor.mathY) ** 2);
}

function computeAnchorAngle(anchor, center, getMathCoordinates) {
  const { mathX, mathY } = getMathCoordinates(center, VERTICAL_AXIS_HEIGHT);
  const angle = Math.atan2(anchor.mathY - mathY, anchor.mathX - mathX);
  return (angle * 180) / Math.PI;
}