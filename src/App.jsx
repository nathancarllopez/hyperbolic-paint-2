import { useEffect, useState } from 'react'
import './App.css'
import FabDrawer from './fabDrawer/FabDrawer'
import HypCanvas from './hypCanvas/HypCanvas'
import Toolbar from './toolbar/Toolbar'
import HistoryControls from './toolbar/HistoryControls'

export default function App() {
  const [openDrawer, setOpenDrawer] = useState(null)

  const [toolbarState, setToolbarState] = useState({
    clickTool: 'point',
    showCursorCoord: true,
  })
  function handleToolbarClick(toolName, toolValue, closeDrawer = true) {
    const stateAfterClick = {
      ...toolbarState,
      [toolName]: toolValue
    };
    setToolbarState(stateAfterClick);
    
    if (closeDrawer) {
      setOpenDrawer(null);
    }
  }

  const [history, setHistory] = useState([]);
  function handleUndoHistory() {
    if (!history.length) {
      console.log('no history')
      return;
    }

    const oneStepBack = [...history];
    oneStepBack.pop();
    setHistory(oneStepBack);
  }
  function handleUpdateHistory(newShape) {
    const currShapes = history.length ? history[history.length - 1] : [];
    setHistory([ ...history, [ ...currShapes, newShape]])
  }

  return (
    <div style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh"
    }}>
      <FabDrawer
        fabPlacement="topLeft"
        onDrawerOpen={() => setOpenDrawer('info')}
        onDrawerClose={() => setOpenDrawer(null)}
        isOpen={openDrawer === 'info'}
        title="Information"
        fabIcon="?"
      >
        <p>Information</p>
      </FabDrawer>

      {history.length > 0 && 
        <HistoryControls
          handleUndoClick={handleUndoHistory}
          disableUndo={!history.length}
        />
      }

      <HypCanvas
        toolbarState={toolbarState}
        shapes={history.length ? history[history.length - 1] : []}
        addShapes={handleUpdateHistory}
      />

      <FabDrawer
        fabPlacement="topRight"
        onDrawerOpen={() => setOpenDrawer('toolbar')}
        onDrawerClose={() => setOpenDrawer(null)}
        isOpen={openDrawer === 'toolbar'}
        title="Toolbar"
        fabIcon="+"
      >
        <Toolbar
          toolbarState={toolbarState}
          onClick={handleToolbarClick}
        />
      </FabDrawer>
    </div>
  );
}
