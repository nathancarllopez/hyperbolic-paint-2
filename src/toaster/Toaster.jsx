import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { TOAST_DELAY } from "../util/constants";

export default function Toaster({
  // toastToShow,
  // setToastToShow,
  activeToasts,
  setActiveToasts,
  settings
}) {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const clickTap = isTouchDevice ? "Tap" : "Click";
  const allToastInfo = {
    polygonError: {
      header: "Error",
      body: "A polygon needs at least three vertices.",
      show: true
    },
    point: {
      header: "Point tool selected",
      body: `${clickTap} once to place a point.`,
      show: settings.showToolbarInstructions
    },
    geodesic: {
      header: "Line tool selected",
      body: `${clickTap} twice to draw a line.`,
      show: settings.showToolbarInstructions
    },
    segment: {
      header: "Line Segment tool selected",
      body: `${clickTap} twice to draw a line segment.`,
      show: settings.showToolbarInstructions
    },
    polygon: {
      header: "Polygon tool selected",
      body: `${clickTap} as many times as you'd like to draw a polygon. ${clickTap} and hold to place the last vertex.`,
      show: settings.showToolbarInstructions
    },
    circle: {
      header: "Circle tool selected",
      body: `${clickTap} twice to draw a circle, first for the center and second to determine the radius.`,
      show: settings.showToolbarInstructions
    },
    horocycle: {
      header: "Horocycle tool selected",
      body: `${clickTap} once to draw a horocycle tangent to the x-axis below where you clicked.`,
      show: settings.showToolbarInstructions
    },
    rotation: {
      header: "Rotation tool selected",
      body: `${clickTap} once to choose the center of rotation.`,
      show: settings.showToolbarInstructions
    },
    translation: {
      header: "Translation tool selected",
      body: `${clickTap} twice to draw the axis of translation.`,
      show: settings.showToolbarInstructions
    },
  }

  function handleToastClose(toRemove) {
    setActiveToasts(prev => prev.filter(toastName => toastName !== toRemove));
  }

  return (
    <ToastContainer position="bottom-end" className="p-3">
      {
        activeToasts.map((name, idx) => (
          <Toast
            key={`${name}-${idx}`}
            bg={idx === activeToasts.length - 1 ? "primary" : undefined}
            onClose={() => handleToastClose(name)}
            show={allToastInfo[name].show}
            delay={TOAST_DELAY}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">{ allToastInfo[name].header }</strong>
            </Toast.Header>
            <Toast.Body>
              { allToastInfo[name].body }
            </Toast.Body>
          </Toast>
        ))
      }

      {/* {
        allToastInfo.map(({ name, header, body, show }) => (
          <Toast
            key={name}
            onClose={() => handleToastClose(name)}
            show={show && activeToasts.includes(name)}
            delay={TOAST_DELAY}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">{ header }</strong>
            </Toast.Header>
            <Toast.Body>{ body }</Toast.Body>
          </Toast>
        ))
      } */}
    </ToastContainer>
  );
}