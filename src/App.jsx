import './App.css';
import { useEffect, useRef, useState } from 'react';

import { ANIMATION_TOOLNAMES, INITIAL_SETTINGS } from './util/constants';

import FabDrawer from './fabDrawer/FabDrawer';
import HypCanvas from './hypCanvas/HypCanvas';
import Information from './information/Information';
import Toaster from './toaster/Toaster';
import Toolbar from './toolbar/Toolbar';
import Settings from './settings/Settings';
import AnimationControls from './toolbar/AnimationControls';

export default function App() {
  /** State */
  //#region
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
  // const [screenOrientation, setScreenOrientation] = useState(screen.orientation.type);
  // const [canvasDimensions, setCanvasDimensions] = useState({ heigth: window.innerHeight, width: window.innerWidth });
  //#endregion

  // console.log(canvasDimensions);

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
        fabPlacement={{ top: 0, left: 0 }}
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
        // setToastToShow={setToastToShow}
        setActiveToasts={setActiveToasts}
        drawingColor={drawingColor}
        setDrawingColor={setDrawingColor}
        drawingWidth={drawingWidth}
        setDrawingWidth={setDrawingWidth}
        // styleDropdownOpen={styleDropdownOpen}
        // setStyleDropdownOpen={setStyleDropdownOpen}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
      />

      {
        ANIMATION_TOOLNAMES.includes(clickTool) &&
          <AnimationControls
            history={history}
            isAnimating={isAnimating}
            setIsAnimating={setIsAnimating}
            animationSpeed={animationSpeed}
            setAnimationSpeed={setAnimationSpeed}
          />
      }

      <HypCanvas
        clickTool={clickTool}
        settings={settings}
        history={history}
        setHistory={setHistory}
        isAnimating={isAnimating}
        setIsAnimating={setIsAnimating}
        animationSpeed={animationSpeed}
        zoomScale={zoomScale}
        // setShowToast={setShowToast}
        // setToastToShow={setToastToShow}
        setActiveToasts={setActiveToasts}
        drawingColor={drawingColor}
        drawingWidth={drawingWidth}
        // styleDropdownOpen={styleDropdownOpen}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        // canvasDimensions={canvasDimensions}
      />

      {/* Style and Animation panels go here */}

      <Toaster
        // toastToShow={toastToShow}
        // setToastToShow={setToastToShow}
        activeToasts={activeToasts}
        setActiveToasts={setActiveToasts}
        settings={settings}
      />

      <FabDrawer
        title={"Settings"}
        fabPlacement={{ top: 0, right: 0 }}
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