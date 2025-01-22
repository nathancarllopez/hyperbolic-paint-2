import { useEffect, useRef, useState } from 'react'
import './App.css'
import FabDrawer from './fabDrawer/FabDrawer'
import HypCanvas from './hypCanvas/HypCanvas'
import Toolbar from './toolbar/Toolbar'
import HistoryControls from './toolbar/HistoryControls'
import { ACTIVE_POINT_COLOR, ANIMATION_TOOLNAMES, AXES_STROKE_WIDTH, HOLD_DURATION_THRESHOLD, INITIAL_ORIGIN_X, INITIAL_TOOLBARSTATE, VERTICAL_AXIS_HEIGHT } from './constants'
import Point from './hypCanvas/shapes/Point'
import { generateId } from './util/generateId'
import Geodesic from './hypCanvas/shapes/Geodesic'
import Horocycle from './hypCanvas/shapes/Horocycle'
import HypCircle from './hypCanvas/shapes/HypCircle'
import Segment from './hypCanvas/shapes/Segment'
import Polygon from './hypCanvas/shapes/Polygon'
import AnimationControls from './toolbar/AnimationControls'
import CenterOfRotation from './hypCanvas/animation shapes/CenterOfRotation'
import { getMobiusAnimation } from './hypCanvas/math/mobiusTransformations'

export default function App() {
  const [openDrawer, setOpenDrawer] = useState(null);
  const [toolbarState, setToolbarState] = useState(INITIAL_TOOLBARSTATE);
  const [mouseCoords, setMouseCoords] = useState(null);
  const [drawingHistory, setDrawingHistory] = useState([[]]);
  const [drawingsIdx, setDrawingsIdx] = useState(0);
  const [activeCoords, setActiveCoords] = useState([]);
  // const [isDragging, setIsDragging] = useState(false);
  const [shapeIsDragging, setShapeIsDragging] = useState(false);
  const [canvasIsDragging, setCanvasIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationShape, setAnimationShape] = useState(null);
  // const [originCoords, setOriginCoords] = useState(INITIAL_ORIGIN_COORDS);
  const [originX, setOriginX] = useState(INITIAL_ORIGIN_X);
  const [focusedShape, setFocusedShape] = useState(null);
  const [selectedShape, setSelectedShape] = useState(null);
  const [zoomScale, setZoomScale] = useState(1);

  const appContainerRef = useRef(null);
  // const mouseCoordsRef = useRef(null);
  const mouseXRef = useRef(null);
  const holdStartTimeRef = useRef(null);
  const animationFrameRef = useRef(null);

  //#region
  /**
   * Ties keyboard shortcuts to the associated ui buttons
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      // console.log('keyDown');
      const undoPressed = (event.metaKey || event.ctrlKey ) && event.key === 'z';
      if (undoPressed) {
        event.preventDefault();
        handleUndoClick();
      }

      // console.log(event.key);
      // console.log(event.code);
      // const readyToAnimate = ANIMATION_TOOLNAMES.includes(toolbarState.clickTool) && animationShape !== null;
      // const playPausePressed = event.key === 'k' || event.code === "Space";
      // if (readyToAnimate && playPausePressed) {
      //   event.preventDefault();
      //   handlePlayPauseClick();
      // }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  /**
   * Associates wheel events with zooming in and out
   */
  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault();
      setZoomScale(prevScale => prevScale + event.deltaY);
    }

    const appContainer = appContainerRef.current;
    appContainer.addEventListener('wheel', handleWheel);

    return () => {
      appContainer.removeEventListener('wheel', handleWheel);
    }
  }, [])
  
  //#region
  // /**
  //  * Starts/stops animations
  //  */
  // useEffect(() => {
  //   if (!isAnimating || animationShape === null) return;

  //   copyCurrentDrawings();
    
  //   const animationMobius = getMobiusAnimation(animationShape);
  //   let animationFrameId = requestAnimationFrame(doAnimation);

  //   function doAnimation() {
  //     if (!isAnimating) {
  //       cancelAnimationFrame(animationFrameId);
  //       return;
  //     }

  //     transformCurrentDrawings(recipe => animationMobius(recipe));
  //     transformAnimationShape();

  //     animationFrameId = requestAnimationFrame(doAnimation);  
  //   }

  //   return () => {
  //     cancelAnimationFrame(animationFrameId);
  //   }
  // }, [isAnimating]);
  //#endregion
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

  function handleMouseDown() {
    if (mouseCoords && mouseCoords.mathY < 0) return;
    mouseXRef.current = mouseCoords.canvasX;

    if (focusedShape) {
      setSelectedShape(focusedShape);
      return;
    }

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

    if (mouseXRef.current === null || selectedShape !==  null) {
      // console.log('no mouseXRef');
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

        // if (Object.hasOwn(recipe.params, "canvasX")) {
        //   return {
        //     ...recipe,
        //     params: {
        //       ...recipe.params,
        //       canvasX: recipe.params.canvasX + dispX
        //     }
        //   }
        // }

        // if (Object.hasOwn(recipe.params, "clicked1")) {
        //   return {
        //     ...recipe,
        //     params: {
        //       clicked1: {
        //         ...recipe.params.clicked1,
        //         params: {
        //           ...recipe.params.clicked1.params,
        //           canvasX: recipe.params.clicked1.params.canvasX + dispX
        //         }
        //       },
        //       clicked2: {
        //         ...recipe.params.clicked2,
        //         params: {
        //           ...recipe.params.clicked2.params,
        //           canvasX: recipe.params.clicked2.params.canvasX + dispX
        //         }
        //       },
        //     }
        //   }
        // }

        // return {
        //   ...recipe,
        //   params: {
        //     allClicked: recipe.params.allClicked.map(clicked => {
        //       return {
        //         ...clicked,
        //         params: {
        //           ...clicked.params,
        //           canvasX: clicked.params.canvasX + dispX
        //         }
        //       }
        //     })
        //   }
        // }
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
    setSelectedShape(null);
    mouseXRef.current = null;
  }

  function handleMouseLeave() {
    setFocusedShape(null);
    setMouseCoords(null);
  }

  function handleUndoClick() {
    setDrawingsIdx(idx => Math.max(0, idx - 1));
  }

  function handleRedoClick() {
    setDrawingsIdx(idx => Math.min(drawingHistory.length - 1, idx + 1));
  }

  function handleShapeDragStart() {
    // console.log('start shape drag');

    setShapeIsDragging(true);

    copyCurrentDrawings();
  }

  function handleShapeDragMove(event, newParams, recipeId) {
    // console.log('dragging shape')

    // handleMouseMove(event);
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
    // console.log('drag shape end')

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
    setDrawingHistory(history => {
      const historyTillPresent = history.slice(0, drawingsIdx + 1);
      const present = [ ...history[drawingsIdx] ];

      return [ ...historyTillPresent, present ];
    });
    setDrawingsIdx(idx => idx + 1);
  }

  function transformCurrentDrawings(modFunc) {
    setDrawingHistory(history => {
      const prevHistory = history.slice(0, history.length - 1);
      const currentDrawings = history[history.length - 1];
      const transformedDrawings = currentDrawings.map(recipe => modFunc(recipe));

      return [ ...prevHistory, transformedDrawings];
    });
  }

  function addDrawingToHistory(lastClickedCoords, longPress = false) {
    const recipe = {
      name: 'point',
      id: generateId(),
      isActive: false,
      params: lastClickedCoords
    };
    const drawing = (() => {
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

    // console.log(drawing);

    if (ANIMATION_TOOLNAMES.includes(toolbarState.clickTool)) {
      setAnimationShape(drawing);
      return;
    }

    if (drawing.isActive) {
      setActiveCoords(coords => [ ...coords, drawing ]);
      return;
    }

    const newDrawings = [ ...drawingHistory[drawingsIdx], drawing ];
    setActiveCoords([]);
    setDrawingHistory(history => [ ...history.slice(0, drawingsIdx + 1), newDrawings ]);
    setDrawingsIdx(idx => idx + 1);
  }
  //#endregion

  /**
   * This turns the shape data in drawingHistory[drawingsIdx] into components
   */
  const drawings = [ ...drawingHistory[drawingsIdx], ...activeCoords, animationShape ].filter(
    x => x !== null
  ).map(
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
              // onDragStart={handleDragStart}
              // onDragMove={handleDragMove}
              // onDragEnd={handleDragEnd}
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
              // onDragStart={handleDragStart}
              // onDragMove={handleDragMove}
              // onDragEnd={handleDragEnd}
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
              // onDragStart={handleDragStart}
              // onDragMove={handleDragMove}
              // onDragEnd={handleDragEnd}
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
              // onDragStart={handleDragStart}
              // onDragMove={handleDragMove}
              // onDragEnd={handleDragEnd}
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
              // onDragStart={handleDragStart}
              // onDragMove={handleDragMove}
              // onDragEnd={handleDragEnd}
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
              // onDragStart={handleDragStart}
              // onDragMove={handleDragMove}
              // onDragEnd={handleDragEnd}
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
              // onDragStart={handleDragStart}
              // onDragMove={handleDragMove}
              // onDragEnd={handleDragEnd}
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
        drawingHistory.length > 1 && toolbarState.showHistoryControls &&
          <HistoryControls
            undoDisabled={drawingsIdx === 0}
            redoDisabled={drawingsIdx === drawingHistory.length - 1}
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
        // canvasIsDragging={canvasIsDragging}
        originX={originX}
        getMathCoordinates={getMathCoordinates}
        zoomScale={zoomScale}
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
