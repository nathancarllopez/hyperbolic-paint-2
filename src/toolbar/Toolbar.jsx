import ButtonGroup from "react-bootstrap/ButtonGroup";
import HistoryControlButtons from "./HistoryControlButtons";
import FloatingDraggableCard from "../util/FloatingDraggableCard";
import StylesDropdown from "./StylesDropdown";
import GenericDropdown from "./GenericDropdown";
import { useEffect, useState } from "react";

export default function Toolbar({
  clickTool, setClickTool,
  history, setHistory,
  setActiveToasts,
  drawingColor, setDrawingColor,
  drawingWidth, setDrawingWidth,
  // styleDropdownOpen, setStyleDropdownOpen
  openDropdown, setOpenDropdown
}) {
  const [isVertical, setIsVertical] = useState(screen.orientation.type.includes('portrait'));
  // const [dropDirection, setDropDirection] = useState();

  // useEffect(() => {
  //   const handleOrientationChange = (event) => {
  //     // console.log('toolbar');
  //     setIsVertical(event.target.type.includes('portrait'))
  //   }

  //   screen.orientation.addEventListener('change', handleOrientationChange);

  //   return () => {
  //     screen.orientation.removeEventListener('change', handleOrientationChange);
  //   }
  // }, []);

  function handleDragStop(_, data) {
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
      placement={{ top: 0 }}
      centered={true}
    >
      <ButtonGroup vertical={isVertical}>
        <GenericDropdown
          title={"Shapes"}
          itemInfo={shapesInfo}
          clickTool={clickTool}
          setClickTool={setClickTool}
          setActiveToasts={setActiveToasts}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        <GenericDropdown
          title={"Animations"}
          itemInfo={animationsInfo}
          clickTool={clickTool}
          setClickTool={setClickTool}
          setActiveToasts={setActiveToasts}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        <StylesDropdown
          drawingColor={drawingColor}
          setDrawingColor={setDrawingColor}
          drawingWidth={drawingWidth}
          setDrawingWidth={setDrawingWidth}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />

        <HistoryControlButtons
          history={history}
          setHistory={setHistory}
        />
      </ButtonGroup>
    </FloatingDraggableCard>
  );
}