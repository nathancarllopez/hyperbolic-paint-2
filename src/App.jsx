import './App.css';
import { useState } from 'react';
import { ANIMATION_TOOLNAMES, INITIAL_SETTINGS } from './util/constants';
import FabDrawer from './fabDrawer/FabDrawer';
import HypCanvas from './hypCanvas/HypCanvas';
import Information from './information/Information';
import Toaster from './toaster/Toaster';
import Toolbar from './toolbar/Toolbar';
import Settings from './settings/Settings';
import AnimationControls from './toolbar/AnimationControls';
import StyleControls from './toolbar/StyleControls';

export default function App() {
  const [openDrawer, setOpenDrawer] = useState(null);
  const [clickTool, setClickTool] = useState("point");
  const [settings, setSettings] = useState(INITIAL_SETTINGS)
  const [history, setHistory] = useState({ snapshots: [[]], currIdx: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [zoomScale, setZoomScale] = useState(1);
  const [activeToasts, setActiveToasts] = useState([]);
  const [drawingColor, setDrawingColor] = useState("#FFFFFF");
  const [drawingWidth, setDrawingWidth] = useState(2);
  const [openDropdown, setOpenDropdown] = useState(null);

  const { snapshots, currIdx } = history;
  const someShapeSelected = snapshots[currIdx].some(drawing => drawing.isSelected && !ANIMATION_TOOLNAMES.includes(drawing.name));
  const animationShapePlaced = snapshots[currIdx].some(drawing => ANIMATION_TOOLNAMES.includes(drawing.name));

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      <FabDrawer
        title={"Information"}
        fabPlacement={{ top: 0, left: 0, margin: "1rem", position: "fixed" }}
        drawerPlacement={"start"}
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        setHistory={setHistory}
        setIsAnimating={setIsAnimating}
      >
        <Information/>
      </FabDrawer>

      <Toolbar
        clickTool={clickTool}
        setClickTool={setClickTool}
        history={history}
        setHistory={setHistory}
        setActiveToasts={setActiveToasts}
        drawingColor={drawingColor}
        setDrawingColor={setDrawingColor}
        drawingWidth={drawingWidth}
        setDrawingWidth={setDrawingWidth}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
      />

      {
        animationShapePlaced &&
          <AnimationControls
            history={history}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
            animationSpeed={animationSpeed}
            setAnimationSpeed={setAnimationSpeed}
          />
      }

      {
        someShapeSelected &&
          <StyleControls
            history={history}
            setHistory={setHistory}
          />
      }

      <HypCanvas
        clickTool={clickTool}
        settings={settings}
        history={history}
        setHistory={setHistory}
        isAnimating={isAnimating}
        animationSpeed={animationSpeed}
        zoomScale={zoomScale}
        setZoomScale={setZoomScale}
        setActiveToasts={setActiveToasts}
        drawingColor={drawingColor}
        drawingWidth={drawingWidth}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
      />

      <Toaster
        activeToasts={activeToasts}
        setActiveToasts={setActiveToasts}
        settings={settings}
      />

      <FabDrawer
        title={"Settings"}
        fabPlacement={{ top: 0, right: 0, margin: "1rem", position: "fixed" }}
        drawerPlacement="end"
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        setHistory={setHistory}
        setIsAnimating={setIsAnimating}
      >
        <Settings
          settings={settings}
          setSettings={setSettings}
        />
      </FabDrawer>
    </div>
  );
}