import { useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Fade from "react-bootstrap/Fade";
import Image from "react-bootstrap/Image";

import HistoryControlButtons from "./HistoryControlButtons";
import FloatingDraggableCard from "../util/FloatingDraggableCard";
import StylesDropdown from "./StylesDropdown";
import GenericDropdown from "./GenericDropdown";
import Fab from "../fabDrawer/Fab";
import closeIcon from "../assets/x-lg.svg";

export default function Toolbar({
  clickTool, setClickTool,
  history, setHistory,
  setActiveToasts,
  drawingColor, setDrawingColor,
  drawingWidth, setDrawingWidth,
  openDropdown, setOpenDropdown
}) {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const [isVertical, setIsVertical] = useState(screen.orientation.type.includes('portrait'));
  const [isExpanded, setIsExpanded] = useState(true);

  function handleDragStop(_, data) {
    if (!isExpanded) return;

    setIsVertical(prev => {
      const toolbarContainer = data.node;
      const { left, right, top, bottom } = toolbarContainer.getBoundingClientRect();

      if (prev) {
        if (top < 0 || bottom > window.innerHeight) {
          return !prev;
        }
        return prev;
      }

      if (left < 0 || right > window.innerWidth) {
        return !prev;
      }
      return prev;
    });
  }

  const shapesInfo = [
    { name: 'point', label: "Point" },
    { name: 'geodesic', label: "Line" },
    { name: 'segment', label: "Line Segment" },
    { name: 'polygon', label: "Polygon" },
    { name: 'circle', label: "Circle" },
    { name: 'horocycle', label: "Horocycle" },
  ];

  const animationsInfo = [
    { name: 'rotation', label: "Rotation" },
    { name: 'translation', label: "Translation" }
  ];

  return (
    <FloatingDraggableCard
      handleDragStop={handleDragStop}
      placement={{ top: isTouchDevice ? "0.5rem" : "1rem" }}
      centered={true}
    >
      <Fade
        in={!isExpanded}
        mountOnEnter
        unmountOnExit
      >
        <Fab
          placement={{ top: 0 }}
          onClick={() => setIsExpanded(!isExpanded)}
          onTouchStart={() => setIsExpanded(!isExpanded)}
          icon={"Toolbar"}
        />
      </Fade>

      <Fade
        in={isExpanded}
        mountOnEnter
        unmountOnExit
      >
        <ButtonGroup
          vertical={isVertical}
          size={isTouchDevice ? 'sm' : 'lg'}
        >
          <GenericDropdown
            title={"Shapes"}
            itemInfo={shapesInfo}
            clickTool={clickTool}
            setClickTool={setClickTool}
            setActiveToasts={setActiveToasts}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            toolbarIsVertical={isVertical}
          />

          <GenericDropdown
            title={"Animations"}
            itemInfo={animationsInfo}
            clickTool={clickTool}
            setClickTool={setClickTool}
            setActiveToasts={setActiveToasts}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            toolbarIsVertical={isVertical}
          />

          <StylesDropdown
            drawingColor={drawingColor}
            setDrawingColor={setDrawingColor}
            drawingWidth={drawingWidth}
            setDrawingWidth={setDrawingWidth}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            toolbarIsVertical={isVertical}
          />

          <HistoryControlButtons
            history={history}
            setHistory={setHistory}
          />
        </ButtonGroup>
      </Fade>

      {
        isExpanded &&
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            onTouchStart={() => setIsExpanded(!isExpanded)}
            className="rounded-circle"
            size={isTouchDevice ? "sm" : 'lg'}
            style={{
              position: "absolute",
              right: isTouchDevice ? "-0.5rem" : "-1rem",
              top: isTouchDevice ? "-0.5rem" : "-1rem",
            }}
          >
            <Image src={closeIcon} fluid/>
          </Button>
      }
    </FloatingDraggableCard>
  );
}