import Offcanvas from "react-bootstrap/Offcanvas";

import Fab from "./Fab";
import { ANIMATION_TOOLNAMES } from "../util/constants";

export default function FabDrawer({ 
  title,
  // fabIcon,
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
      // console.log('clearActiveAndAnimationShapes');
      const { snapshots, currIdx } = prev;
      const currentSnapshot = snapshots[currIdx];
      const noActivePoints = !currentSnapshot.find(recipe => recipe.isActive);
      const noAnimationShape = !currentSnapshot.find(recipe => ANIMATION_TOOLNAMES.includes(recipe.name))
      if (noActivePoints && noAnimationShape) return prev;

      // console.log('clearing...')

      const snapshotsTillCurrent = snapshots.slice(0, currIdx + 1);
      const clearedCurrent = currentSnapshot.filter(recipe => {
        const notActive = recipe.isActive === false;
        const notAnimation = !ANIMATION_TOOLNAMES.includes(recipe.name);
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

// export default function FabDrawer({ 
//   isOpen, 
//   onClick, 
//   onHide, 
//   fabPlacement, 
//   title, 
//   fabIcon,
//   children
// }) {
//   const drawerPlacement = (() => {
//     switch(fabPlacement) {
//       case 'topLeft':
//         return 'start';
//       case 'topRight':
//         return 'end';
//       case 'bottomLeft':
//       case 'bottomRight':
//         return 'bottom'
//     }
//   })();

//   return (
//     <>
//       <Fab placement={fabPlacement} icon={fabIcon} onClick={onClick} />

//       <Offcanvas show={isOpen} onHide={onHide} placement={drawerPlacement}>
//         <Offcanvas.Header closeButton>
//           <Offcanvas.Title className="fs-2">{title}</Offcanvas.Title>
//         </Offcanvas.Header>
//         <Offcanvas.Body>
//           {children}
//         </Offcanvas.Body>
//       </Offcanvas>
//     </>
//   );
// }
