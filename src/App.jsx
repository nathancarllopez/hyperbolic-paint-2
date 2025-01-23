import './App.css'
import { useEffect, useRef, useState } from 'react'
import { ACTIVE_POINT_COLOR, ANIMATION_TOOLNAMES, HOLD_DURATION_THRESHOLD, INITIAL_ORIGIN_X, INITIAL_TOOLBARSTATE, VERTICAL_AXIS_HEIGHT } from './constants'
import { generateId } from './util/generateId'

import AnimationControls from './toolbar/AnimationControls'
import CenterOfRotation from './hypCanvas/animation shapes/CenterOfRotation'
import FabDrawer from './fabDrawer/FabDrawer'
import Geodesic from './hypCanvas/shapes/Geodesic'
import HistoryControls from './toolbar/HistoryControls'
import Horocycle from './hypCanvas/shapes/Horocycle'
import HypCanvas from './hypCanvas/HypCanvas'
import HypCircle from './hypCanvas/shapes/HypCircle'
import Point from './hypCanvas/shapes/Point'
import Polygon from './hypCanvas/shapes/Polygon'
import Segment from './hypCanvas/shapes/Segment'
import Toolbar from './toolbar/Toolbar'

export default function App() {
  const [openDrawer, setOpenDrawer] = useState(null);
  const [toolbarState, setToolbarState] = useState(INITIAL_TOOLBARSTATE);
  const [mouseCoords, setMouseCoords] = useState(null);
  const [history, setHistory] = useState({ snapshots: [[]], currIdx: 0 });
  const [activeCoords, setActiveCoords] = useState([]);
  const [shapeIsDragging, setShapeIsDragging] = useState(false);
  const [canvasIsDragging, setCanvasIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationShape, setAnimationShape] = useState(null);
  const [originX, setOriginX] = useState(INITIAL_ORIGIN_X);
  const [focusedShape, setFocusedShape] = useState(null);

  const appContainerRef = useRef(null);
  const mouseXRef = useRef(null);
  const holdStartTimeRef = useRef(null);
  const animationFrameRef = useRef(null);
  const selectedShapeRef = useRef(null);

  /**
   * useEffects
   */
  //#region
  /**
   * Ties keyboard shortcuts to the associated ui buttons
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      const undoPressed = (event.metaKey || event.ctrlKey ) && event.key === 'z';
      if (undoPressed) {
        event.preventDefault();
        handleUndoClick();
      }

      const selectedShape = selectedShapeRef.current;
      const deletePressed = ['Delete', 'Backspace'].includes(event.key);
      if (selectedShape && deletePressed) {
        event.preventDefault();

        const selectedId = selectedShape.id();
        selectedShapeRef.current = null;

        deleteDrawingInHistory(selectedId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);
  //#endregion

  /**
   * Event handlers
   */
  //#region
  function handleFabClick(fabDrawerName) {
    setActiveCoords([]);
    setAnimationShape(null);

    setOpenDrawer(fabDrawerName);
  }

  function handleToolbarClick(toolName, toolValue, closeDrawer = true) {
    setToolbarState({ ...toolbarState, [toolName]: toolValue });

    if (closeDrawer) {
      setOpenDrawer(null);
    }
  }

  function handleUndoClick() {
    setHistory(prev => {
      const { currIdx } = prev;
      return {
        ...prev,
        currIdx: Math.max(0, currIdx - 1)
      };
    })
  }

  function handleRedoClick() {
    setHistory(prev => {
      const { snapshots, currIdx } = prev;
      return {
        ...prev,
        currIdx: Math.min(snapshots.length - 1, currIdx + 1)
      };
    })
  }

  function handleMouseDown() {
    if (mouseCoords && mouseCoords.mathY < 0) return;
    mouseXRef.current = mouseCoords.canvasX;

    if (focusedShape) {
      selectedShapeRef.current = focusedShape;
      return;
    }
    
    selectedShapeRef.current = null;
    holdStartTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(checkHoldDuration);

    function checkHoldDuration() {
      const holdDuration = performance.now() - holdStartTimeRef.current;
      
      if (holdDuration >= HOLD_DURATION_THRESHOLD) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;

        if (toolbarState.clickTool === 'polygon' && activeCoords.length > 0) {
          if (activeCoords.length === 1) {
            // To do: Make this nicer, just a placeholder for now
            alert('you need to choose at least three points to make a polygon');
          } else {
            const longPress = true;
            addDrawingToHistory(mouseCoords, longPress);
          }
        }

        return;
      }

      animationFrameRef.current = requestAnimationFrame(checkHoldDuration);
    }
  }

  function handleMouseMove(event) {
    setFocusedShape(() => {
      if (event.target !== event.target.getStage()) {
        return event.target;
      }
      return null;
    });

    const currCoords = getMouseCoordinates(event)
    setMouseCoords(currCoords);

    const selectedShape = selectedShapeRef.current;
    if (mouseXRef.current === null || selectedShape !==  null) {
      return;
    }

    const dispX = currCoords.canvasX - mouseXRef.current;
    if (dispX !== 0) {
      setCanvasIsDragging(true);
      setOriginX(prev => prev + dispX);
      if (animationShape !== null) {
        setAnimationShape(recipe => {
          switch(recipe.name) {
            case 'rotation': {
              return {
                ...recipe,
                params: {
                  ...recipe.params,
                  canvasX: recipe.params.canvasX + dispX
                }
              };
            };
          };
        });
      };
      transformCurrentDrawings(recipe => {
        switch(recipe.name) {
          case 'horocycle':
          case 'point': {
            return {
              ...recipe,
              params: {
                ...recipe.params,
                canvasX: recipe.params.canvasX + dispX
              }
            };
          };

          case 'segment':
          case 'circle':
          case 'geodesic': {
            const { clicked1, clicked2 } = recipe.params;
            const dispClicked1 = {
              ...clicked1,
              params: {
                ...clicked1.params,
                canvasX: clicked1.params.canvasX + dispX
              }
            };
            const dispClicked2 = {
              ...clicked2,
              params: {
                ...clicked2.params,
                canvasX: clicked2.params.canvasX + dispX
              }
            };

            return {
              ...recipe,
              params: { clicked1: dispClicked1, clicked2: dispClicked2 }
            };
          };

          case 'polygon': {
            const { allClicked } = recipe.params;
            const dispAllClicked = allClicked.map(recipe => {
              return {
                ...recipe,
                params: {
                  ...recipe.params,
                  canvasX: recipe.params.canvasX + dispX
                }
              };
            });

            return {
              ...recipe,
              params: { allClicked: dispAllClicked }
            };
          };

          default: {
            throw new Error(`Unexpected shape name while dragging canvas: ${recipe.name}`);
          }
        }
      });
      mouseXRef.current = currCoords.canvasX;
    }
  }

  function handleMouseUp(event) {
    const coords = getMouseCoordinates(event)
    setMouseCoords(coords);

    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    const holdDuration = performance.now() - holdStartTimeRef.current;
    const wasHolding = holdDuration >= HOLD_DURATION_THRESHOLD;
    if (!shapeIsDragging && !canvasIsDragging && !wasHolding) {
      addDrawingToHistory(coords);
    }

    setCanvasIsDragging(false);
    mouseXRef.current = null;
  }

  function handleMouseLeave() {
    setFocusedShape(null);
    setMouseCoords(null);
  }

  function handleShapeDragStart() {
    setShapeIsDragging(true);
    copyCurrentDrawings();
  }

  function handleShapeDragMove(event, newParams, recipeId) {
    setMouseCoords(() => getMouseCoordinates(event));

    if (animationShape && animationShape.id === recipeId) {
      setAnimationShape(recipe => {
        return {
          ...recipe,
          params: newParams
        }
      })      
      return;
    }

    transformCurrentDrawings(recipe => {
      if (recipe.id !== recipeId) {
        return recipe;
      }

      return {
        ...recipe,
        params: newParams
      }
    });
  }

  function handleShapeDragEnd() {
    setShapeIsDragging(false);
  }
  
  function handlePlayPauseClick() {
    setIsAnimating(is => !is);
  }
  //#endregion

  /**
   * Utility functions
   */
  //#region
  function getMouseCoordinates(event) {
    const { x, y } = event.target.getStage().getPointerPosition();

    return {
      canvasX: x,
      canvasY: y,
      mathX: x - originX,
      mathY: Math.floor(VERTICAL_AXIS_HEIGHT - y)
    };
  }

  function getCanvasCoordinates(mathX, mathY) {
    return {
      canvasX: mathX + originX,
      canvasY: Math.floor(VERTICAL_AXIS_HEIGHT - mathY),
      mathX,
      mathY
    };
  }

  function getMathCoordinates(canvasX, canvasY) {
    return {
      canvasX,
      canvasY,
      mathX: canvasX - originX,
      mathY: Math.floor(VERTICAL_AXIS_HEIGHT - canvasY)
    };
  }

  function copyCurrentDrawings() {
    setHistory(prev => {
      const { snapshots, currIdx } = prev;
      const drawingsTillCurrent = snapshots.slice(0, currIdx + 1);
      const currentDrawings = [ ...snapshots[currIdx] ];

      return {
        snapshots: [ ...drawingsTillCurrent, currentDrawings ],
        currIdx: currIdx + 1,
      }
    });
  }

  function transformCurrentDrawings(mapFunc) {
    setHistory(prev => {
      const { snapshots, currIdx } = prev;
      const previousDrawings = snapshots.slice(0, currIdx);
      const transformedDrawings = snapshots[currIdx].map(recipe => mapFunc(recipe));

      return {
        ...prev,
        snapshots: [ ...previousDrawings, transformedDrawings ]
      };
    });
  }

  function addDrawingToHistory(lastClickedCoords, longPress = false) {
    const drawing = (() => {
      const recipe = {
        name: 'point',
        id: generateId(),
        isActive: false,
        params: lastClickedCoords
      };
      
      switch(toolbarState.clickTool) {
        case 'rotation':
        case 'horocycle':
        case 'point': {
          return {
            ...recipe,
            name: toolbarState.clickTool
          };
        }

        case 'segment':
        case 'circle':
        case 'geodesic': {
          if (activeCoords.length === 0) {
            return {
              ...recipe,
              isActive: true,
            };
          } 
          
          const clicked1 = {
            ...activeCoords[0],
            isActive: false,
          }
          const clicked2 = recipe;

          return {
            name: toolbarState.clickTool,
            id: generateId(),
            params: { clicked1, clicked2 }
          };
        }

        case 'polygon': {
          if (!longPress) {
            return {
              ...recipe,
              isActive: true,
            };
          }

          const firstVertices = activeCoords.map(recipe => {
            return {
              ...recipe,
              isActive: false,
            }
          });
          const lastVertex = recipe;

          return {
            name: toolbarState.clickTool,
            id: generateId(),
            params: {
              allClicked: [...firstVertices, lastVertex]
            }
          };
        }

        default: {
          throw new Error(`Unexpected click tool: ${toolbarState.clickTool}`);
        }
      }
    })();

    if (ANIMATION_TOOLNAMES.includes(toolbarState.clickTool)) {
      setAnimationShape(drawing);
      return;
    }

    if (drawing.isActive) {
      setActiveCoords(coords => [ ...coords, drawing ]);
      return;
    }

    setActiveCoords([]);
    setHistory(prev => {
      const { snapshots, currIdx } = prev;
      const drawingsTillCurrent = snapshots.slice(0, currIdx + 1);
      const newDrawings = [ ...snapshots[currIdx], drawing ];

      return {
        snapshots: [ ...drawingsTillCurrent, newDrawings ],
        currIdx: currIdx + 1
      }
    });
  }

  function deleteDrawingInHistory(idToDelete) {
    setHistory(prev => {
      const { snapshots, currIdx } = prev;
      const drawingsTillCurrent = snapshots.slice(0, currIdx + 1);
      const filteredDrawings = snapshots[currIdx].filter(recipe => recipe.id !== idToDelete);

      return {
        snapshots: [ ...drawingsTillCurrent, filteredDrawings ],
        currIdx: currIdx + 1,
      }
    });
  }
  //#endregion

  /**
   * This turns the shape data into components
   */
  const { snapshots, currIdx } = history;
  const drawings = [ ...snapshots[currIdx], ...activeCoords, animationShape ].filter(x => x !== null).map(
    (recipe) => {
      const { name, id, isActive, params } = recipe;

      if (isActive) {
        return (
          <Point
            key={id}
            id={id}
            clickedX={params.canvasX}
            clickedY={params.canvasY}
            getMathCoordinates={getMathCoordinates}
            color={ACTIVE_POINT_COLOR}
            isDraggable={false}
          />
        );
      }

      if (!name) {
        throw new Error(`Missing shape name from recipe: ${recipe}`);
      }

      switch(name) {
        case 'point': {
          return (
            <Point
              key={id}
              id={id}
              clickedX={params.canvasX}
              clickedY={params.canvasY}
              getMathCoordinates={getMathCoordinates}
              onDragStart={handleShapeDragStart}
              onDragMove={handleShapeDragMove}
              onDragEnd={handleShapeDragEnd}
            />
          )
        }
        case 'horocycle': {
          return (
            <Horocycle 
              key={id}
              id={id}
              clickedX={params.canvasX}
              clickedY={params.canvasY}
              getMathCoordinates={getMathCoordinates}
              getCanvasCoordinates={getCanvasCoordinates}
              onDragStart={handleShapeDragStart}
              onDragMove={handleShapeDragMove}
              onDragEnd={handleShapeDragEnd}
            />
          )
        }
        case 'geodesic': {
          return (
            <Geodesic
              key={id}
              id={id}
              clicked1={params.clicked1}
              clicked2={params.clicked2}
              getMathCoordinates={getMathCoordinates}
              onDragStart={handleShapeDragStart}
              onDragMove={handleShapeDragMove}
              onDragEnd={handleShapeDragEnd}
            />
          )
        }
        case 'circle': {
          return (
            <HypCircle
              key={id}
              id={id}
              clicked1={params.clicked1}
              clicked2={params.clicked2}
              getMathCoordinates={getMathCoordinates}
              getCanvasCoordinates={getCanvasCoordinates}
              onDragStart={handleShapeDragStart}
              onDragMove={handleShapeDragMove}
              onDragEnd={handleShapeDragEnd}
            />
          )
        }
        case 'segment': {
          return (
            <Segment
              key={id}
              id={id}
              clicked1={params.clicked1}
              clicked2={params.clicked2}
              getMathCoordinates={getMathCoordinates}
              onDragStart={handleShapeDragStart}
              onDragMove={handleShapeDragMove}
              onDragEnd={handleShapeDragEnd}
            />
          )
        }
        case 'polygon': {
          return (
            <Polygon
              key={id}
              id={id}
              allClicked={params.allClicked}
              getMathCoordinates={getMathCoordinates}
              onDragStart={handleShapeDragStart}
              onDragMove={handleShapeDragMove}
              onDragEnd={handleShapeDragEnd}
            />
          )
        }
        case 'rotation': {
          return (
            <CenterOfRotation
              key={id}
              id={id}
              clickedX={params.canvasX}
              clickedY={params.canvasY}
              getMathCoordinates={getMathCoordinates}
              getCanvasCoordinates={getCanvasCoordinates}
              onDragStart={handleShapeDragStart}
              onDragMove={handleShapeDragMove}
              onDragEnd={handleShapeDragEnd}
              isAnimating={isAnimating}
            />
          )
        }
        default: {
          throw new Error(`Unexpected shape name: ${name}`);
        }
      }
    }
  );

  return (
    <div ref={appContainerRef} style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh"
    }}>
      <FabDrawer
        isOpen={openDrawer === 'information'}
        onClick={() => handleFabClick('information')}
        onHide={() => setOpenDrawer(null)}
        fabPlacement="topLeft"
        title="Information"
        fabIcon="?"
      >
        <p>Information</p>
      </FabDrawer>

      {
        snapshots.length > 1 && toolbarState.showHistoryControls &&
          <HistoryControls
            undoDisabled={currIdx === 0}
            redoDisabled={currIdx === snapshots.length - 1}
            onUndoClick={handleUndoClick}
            onRedoClick={handleRedoClick}
          />
      }

      <HypCanvas
        toolbarState={toolbarState}
        mouseCoords={mouseCoords}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        originX={originX}
        getMathCoordinates={getMathCoordinates}
      >
        { drawings }
      </HypCanvas>

      {
        ANIMATION_TOOLNAMES.includes(toolbarState.clickTool) &&
          <AnimationControls
            isAnimating={isAnimating}
            playPauseDisabled={animationShape === null}
            onPlayPauseClick={handlePlayPauseClick}
          />
      }

      <FabDrawer
        isOpen={openDrawer === 'toolbar'}
        onClick={() => handleFabClick('toolbar')}
        onHide={() => setOpenDrawer(null)}
        fabPlacement="topRight"
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