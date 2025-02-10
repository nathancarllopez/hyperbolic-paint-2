import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

export default function Toaster({
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
  const containerStyle = isTouchDevice ?
    { bottom: "3rem", right: "1rem" } :
    { bottom: "4rem", right: "1rem" };  // To do: Why does this seem to work on Chrome Dev tools but not on my actual phone?

  return (
    <ToastContainer style={containerStyle}>
      {
        activeToasts.map((name, idx) => (
          <Toast
            key={`${name}-${idx}`}
            bg={idx === activeToasts.length - 1 ? "primary" : undefined}
            onClose={() => setActiveToasts(prev => prev.slice(1))}
            show={allToastInfo[name].show}
            delay={settings.toastDuration}
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
    </ToastContainer>
  );
}