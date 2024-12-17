import Offcanvas from "react-bootstrap/Offcanvas";

import Fab from "./Fab";

export default function FabDrawer({ fabPlacement, onDrawerOpen, onDrawerClose, isOpen, title, fabIcon, children }) {
  const drawerPlacement = (() => {
    switch(fabPlacement) {
      case 'topLeft':
        return 'start';
      case 'topRight':
        return 'end';
      case 'bottomLeft':
      case 'bottomRight':
        return 'bottom'
    }
  })();

  return (
    <>
      <Fab placement={fabPlacement} icon={fabIcon} onClick={onDrawerOpen} />

      <Offcanvas show={isOpen} onHide={onDrawerClose} placement={drawerPlacement}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="fs-2">{title}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {children}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
