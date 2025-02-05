import { useEffect, useState } from "react";
import FloatingDraggableCard from "../util/FloatingDraggableCard";
import DrawingControls from "./DrawingControls";
import StyleControls from "./StyleControls";
import AnimationControls from "./AnimationControls";
import { ANIMATION_TOOLNAMES } from "../util/constants";

export default function ControlPanel({
  openPanels,
  setOpenPanels,
  history,
  setHistory,
  toolbarState,
  setToolbarState,
  isAnimating,
  setIsAnimating,
  animationSpeed,
  setAnimationSpeed
}) {
  function toggleOpenPanels(panelName) {
    setOpenPanels(prev => {
      const panelIsOpen = prev.find(pn => pn === panelName);
      if (panelIsOpen) return prev.filter(pn => pn !== panelName);
      return [ ...prev, panelName ];
    });
  }

  const { snapshots, currIdx } = history;
  const animationShape = snapshots[currIdx].find(recipe => ANIMATION_TOOLNAMES.includes(recipe.name))
  const animationName = animationShape?.name;

  return (
    <FloatingDraggableCard
      title={"Control Panel"}
      setToolbarState={setToolbarState}
    >
      <DrawingControls
        history={history}
        setHistory={setHistory}
        toolbarState={toolbarState}
        isOpen={openPanels.includes('drawing')}
        toggleIsOpen={() => toggleOpenPanels('drawing')}
      />
      <StyleControls
        isOpen={openPanels.includes('style')}
        toggleIsOpen={() => toggleOpenPanels('style')}
      />
      <AnimationControls
        isAnimating={isAnimating}
        setIsAnimating={setIsAnimating}
        animationSpeed={animationSpeed}
        setAnimationSpeed={setAnimationSpeed}
        animationName={animationName}
        isOpen={openPanels.includes('animation')}
        toggleIsOpen={() => toggleOpenPanels('animation')}
      />
    </FloatingDraggableCard>
  );
}