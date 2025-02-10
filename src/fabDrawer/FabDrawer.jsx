import Offcanvas from "react-bootstrap/Offcanvas";
import Fab from "./Fab";
import { ANIMATION_TOOLNAMES } from "../util/constants";

export default function FabDrawer({ 
  title,
  fabPlacement,
  drawerPlacement,
  openDrawer, 
  setOpenDrawer,
  setHistory,
  setIsAnimating,
  children
}) {
  function handleFabClick() {
    setOpenDrawer(title);
    setIsAnimating(false);

    clearActiveAndAnimationShapes();
  }

  function handleOffcanvasHide() {
    setOpenDrawer(null);
  }

  function clearActiveAndAnimationShapes() {
    setHistory(prev => {
      const { snapshots, currIdx } = prev;
      const currentSnapshot = snapshots[currIdx];
      const noActivePoints = currentSnapshot.every(drawing => !drawing.isActive);
      const noAnimationShape = currentSnapshot.every(drawing => !ANIMATION_TOOLNAMES.includes(drawing.name));
      if (noActivePoints && noAnimationShape) return prev;

      const snapshotsTillCurrent = snapshots.slice(0, currIdx + 1);
      const clearedCurrent = currentSnapshot.filter(drawing => {
        const notActive = drawing.isActive === false;
        const notAnimation = !ANIMATION_TOOLNAMES.includes(drawing.name);
        return notActive && notAnimation
      });

      return {
        snapshots: [ ...snapshotsTillCurrent, clearedCurrent ],
        currIdx: currIdx + 1
      }
    });
  }

  return (
    <>
      <Fab
        placement={fabPlacement}
        icon={title}
        onClick={handleFabClick}
      />

      <Offcanvas
        show={openDrawer === title}
        onHide={handleOffcanvasHide}
        placement={drawerPlacement}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title 
            className="fs-1"
          >
            { title }
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          { children }
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}