import { Arc, Layer, Rect, Stage, Text } from "react-konva";
import { useEffect, useRef, useState } from "react";

import { ACTIVE_POINT_COLOR, ANIM_SPEED_DAMPENER, ANIMATION_TOOLNAMES, CURSOR_COORD_COLOR, CURSOR_FONT_SIZE, HOLD_DURATION_THRESHOLD, INITIAL_ORIGIN_X, VERTICAL_AXIS_HEIGHT } from "../util/constants";
import Axes from "./shapes/Axes";
import AxisOfTranslation from "./animation shapes/AxisOfTranslation";
import CenterOfRotation from "./animation shapes/CenterOfRotation";
import Point from "./shapes/Point";
import Horocycle from "./shapes/Horocycle";
import Geodesic from "./shapes/Geodesic";
import HypCircle from "./shapes/HypCircle";
import Segment from "./shapes/Segment";
import Polygon from "./shapes/Polygon";
import { generateId } from "../util/generateId";
import MobiusTransformation from "./math/mobiusTransformations";

export default function HypCanvas({
  clickTool,
  settings,
  history, setHistory,
  isAnimating, setIsAnimating,
  animationSpeed,
  zoomScale,
  setActiveToasts,
  drawingColor,
  drawingWidth,
  openDropdown, setOpenDropdown,
  // canvasDimensions
}) {
  // console.log(canvasDimensions);

  /** State */
  //#region
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const [mouseCoords, setMouseCoords] = useState(null);
  const [shapeIsDragging, setShapeIsDragging] = useState(false);
  const [canvasIsDragging, setCanvasIsDragging] = useState(false);
  // const [originX, setOriginX] = useState(INITIAL_ORIGIN_X);
  const [originCoords, setOriginCoords] = useState({ x: window.innerWidth / 2, y: 0.95 * window.innerHeight });
  const [canvasDimensions, setCanvasDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  //#endregion

  /** Refs */
  //#region
  // const appContainerRef = useRef(null);
  const stageRef = useRef(null);
  const mouseXRef = useRef(null);
  const holdStartTimeRef = useRef(null);
  const mouseAnimFrameRef = useRef(null);
  const clickedShapeRef = useRef(null);
  const holdIndicatorRef = useRef(null);
  //#endregion

  /** Effects */
  //#region
  useEffect(() => { // Binds keyboard shortcuts for desktop users
    const handleKeyDown = (event) => {
      const undoPressed = (event.metaKey || event.ctrlKey ) && event.key === 'z';
      if (undoPressed) {
        event.preventDefault();
        setHistory(prev => {
          const { currIdx } = prev;
          return {
            ...prev,
            currIdx: Math.max(0, currIdx - 1)
          }
        });
      }

      const { snapshots, currIdx } = history;
      const aDrawingIsSelected = snapshots[currIdx].find(recipe => recipe.isSelected) !== undefined;
      const deletePressed = ['Delete', 'Backspace'].includes(event.key);
      if (aDrawingIsSelected && deletePressed) {
        event.preventDefault();
        deleteSelectedDrawing();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [history]);

  useEffect(() => { // Controls zooming in and out
    const handleWheel = (event) => {
      event.preventDefault();
      console.log(event.deltaY);
    }
    
    const stage = stageRef.current;
    stage.addEventListener('wheel', handleWheel);

    return () => {
      stage.removeEventListener('wheel', handleWheel);
    }
  }, [zoomScale]);

  useEffect(() => { // Updates canvas size when window is resized or 
    const handleWindowResize = () => {
      setCanvasDimensions({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener('resize', handleWindowResize);
    if (isTouchDevice) {
      screen.orientation.addEventListener('change', handleWindowResize);
    }

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      if (isTouchDevice) {
        screen.orientation.removeEventListener('change', handleWindowResize);
      }
    }
  }, []);

  useEffect(() => { // Updates shapes while animating
    if (!isAnimating) return;

    const { snapshots, currIdx } = history;
    const animationShape = snapshots[currIdx].find(recipe => ANIMATION_TOOLNAMES.includes(recipe.name));
    if (!animationShape) return;

    copyCurrentDrawings();
    const animationFunc = getAnimationFunction(animationShape);
    let animationFrame = requestAnimationFrame(doAnimation);

    function doAnimation() {
      if (!isAnimating) {
        cancelAnimationFrame(animationFrame);
        return;
      }

      transformCurrentDrawings(recipe => animationFunc(recipe, animationSpeed * ANIM_SPEED_DAMPENER));

      animationFrame = requestAnimationFrame(doAnimation);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
    }
  }, [isAnimating, animationSpeed]);
  //#endregion

  /** Drawing utility functions */
  //#region
  function getCurrentCoordinates(konvaEvent) {
    const { x, y } = konvaEvent.target.getStage().getPointerPosition();

    return {
      canvasX: x,
      canvaY: y,
      mathX: x - originCoords.x,
      mathY: Math.floor(originCoords.y - y)
    };

    // return {
    //   canvasX: x,
    //   canvasY: y,
    //   mathX: x - originX,
    //   mathY: Math.floor(VERTICAL_AXIS_HEIGHT - y)
    // };
  }

  function getCanvasCoordinates(mathX, mathY) {
    return {
      canvasX: mathX + originCoords.x,
      canvasY: Math.floor(originCoords.y - mathY),
      mathX,
      mathY
    };

    // return {
    //   canvasX: mathX + originX,
    //   canvasY: Math.floor(VERTICAL_AXIS_HEIGHT - mathY),
    //   mathX,
    //   mathY
    // };
  }

  function getMathCoordinates(canvasX, canvasY) {
    return {
      canvasX,
      canvasY,
      mathX: canvasX - originCoords.x,
      mathY: Math.floor(originCoords.y - canvasY)
    };
    
    // return {
    //   canvasX,
    //   canvasY,
    //   mathX: canvasX - originX,
    //   mathY: Math.floor(VERTICAL_AXIS_HEIGHT - canvasY)
    // };
  }

  function addDrawingToHistory(lastClickedCoords, longPress = false) {
    const { snapshots, currIdx } = history;
    const currActiveCoords = snapshots[currIdx].filter(recipe => recipe.isActive);

    const drawing = ((activeCoords) => {
      const recipe = {
        name: 'point',
        id: generateId(),
        isActive: false,
        isSelected: false,
        styles: { color: drawingColor, strokeWidth: drawingWidth },
        params: lastClickedCoords // { canvasX, canvasY, mathX, mathY }
      };
      
      switch(clickTool) {
        case 'rotation':
        case 'horocycle':
        case 'point': {
          return {
            ...recipe,
            name: clickTool
          };
        }

        case 'translation':
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
            ...recipe,
            name: clickTool,
            id: generateId(),
            styles: { ...recipe.styles },
            params: { clicked1, clicked2 }
          }
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
            ...recipe,
            name: clickTool,
            id: generateId(),
            styles: { ...recipe.styles },
            params: { allClicked: [ ...firstVertices, lastVertex ] }
          }
        }

        default: {
          throw new Error(`Unexpected click tool: ${clickTool}`);
        }
      }
    })(currActiveCoords);

    setHistory(prev => {
      // console.log('addDrawingToHistory')
      const { snapshots, currIdx } = prev;
      const snapshotsTillCurrent = snapshots.slice(0, currIdx + 1);
      const currentSnapshot = [ ...snapshots[currIdx] ];

      const newDrawings = (() => {
        if (ANIMATION_TOOLNAMES.includes(drawing.name)) {
          const noAnimationShapes = currentSnapshot.filter(recipe => !ANIMATION_TOOLNAMES.includes(recipe.name) && !recipe.isActive);
          return [ ...noAnimationShapes, drawing ];
        } else if (!drawing.isActive) {
          const noActivePoints = currentSnapshot.filter(recipe => !recipe.isActive);
          return [ ...noActivePoints, drawing ];
        }
        return [ ...currentSnapshot, drawing ];
      })();

      return {
        snapshots: [ ...snapshotsTillCurrent, newDrawings ],
        currIdx: currIdx + 1
      };
    });
  }

  function copyCurrentDrawings() {
    // console.log('copying')
    setHistory(prev => {
      const { snapshots, currIdx } = prev;
      const snapshotsTillCurrent = snapshots.slice(0, currIdx + 1);
      const currentSnapshot = [ ...snapshots[currIdx] ];

      return {
        snapshots: [ ...snapshotsTillCurrent, currentSnapshot ],
        currIdx: currIdx + 1,
      }
    });
  }

  function transformAllDrawings(mapFunc) {
    // console.log('transforming all');
    setHistory(prev => {
      const { snapshots, currIdx } = prev;
      const snapshotsTillCurrent = snapshots.slice(0, currIdx + 1);
      const transformedSnapshots = snapshotsTillCurrent.map(
        snapshot => snapshot.map(recipe => mapFunc(recipe))
      );

      return { ...prev, snapshots: transformedSnapshots };
    })
  }

  function transformCurrentDrawings(mapFunc) {
    // console.log('transforming current')
    setHistory(prev => {
      const { snapshots, currIdx } = prev;
      const previousSnapshots = snapshots.slice(0, currIdx);
      const currentSnapshot = snapshots[currIdx];
      const transformedCurrent = currentSnapshot.map(recipe => mapFunc(recipe));

      // if (currentSnapshot.length > 0 && transformedCurrent.length > 0) {
      //   console.log('before', currentSnapshot[0].params);
      //   console.log('after', transformedCurrent[0].params);
      // }

      return { ...prev, snapshots: [ ...previousSnapshots, transformedCurrent ] };
    });
  }

  function deleteSelectedDrawing() {
    // console.log('deleteSelectedDrawing');
    setHistory(prev => {
      const { snapshots, currIdx } = prev;
      const snapshotsTillCurrent = snapshots.slice(0, currIdx + 1);
      const currentSnapshot = snapshots[currIdx];
      
      const noDrawingSelected = currentSnapshot.every(recipe => !recipe.isSelected);
      if (noDrawingSelected) return prev;

      const filteredSnapshot = currentSnapshot.filter(recipe => !recipe.isSelected);

      return {
        snapshots: [ ...snapshotsTillCurrent, filteredSnapshot ],
        currIdx: currIdx + 1
      }
    });
  }

  function getAnimationFunction(animationShape) {
    const mobius = (() => {
      const { params } = animationShape;
      switch(animationShape.name) {
        case "rotation": {
          return (animationSpeed) => MobiusTransformation.rotateAboutPoint(params, animationSpeed);
        };

        case "translation": {
          const { clicked1, clicked2 } = params;
          return (animationSpeed) => MobiusTransformation.translateBetweenPoints(clicked1.params, clicked2.params, animationSpeed);
        }

        default: {
          throw new Error(`Unexpected animation shape: ${animationShape}`)
        }
      }
    })();

    return (recipe, animationSpeed) => {
      const { name, params } = recipe;
      if (name === animationShape.name) return recipe;
      
      const animationFunc = mobius(animationSpeed);
      switch(name) {
        case "point":
        case "horocycle": {
          const { re, im } = animationFunc.applyToCoords(params);
          return {
            ...recipe,
            params: getCanvasCoordinates(re, im)
          };
        };

        case "segment":
        case "circle":
        case "geodesic": {
          const { clicked1, clicked2 } = params;
          const [animatedClicked1, animatedClicked2] = [clicked1, clicked2].map(recipe => {
            const { params } = recipe;
            const animatedParams = animationFunc.applyToCoords(params); // Now a ComplexNumber, see ./math/complexNumber.js
            return {
              ...recipe,
              params: getCanvasCoordinates(animatedParams.re, animatedParams.im)
            };
          });

          return {
            ...recipe,
            params: { clicked1: animatedClicked1, clicked2: animatedClicked2 }
          };
        }

        case 'polygon': {
          const { allClicked } = params;
          const animatedAllClicked = allClicked.map(recipe => {
            const { params } = recipe;
            const animatedParams = animationFunc.applyToCoords(params); // Now a ComplexNumber, see ./math/complexNumber.js
            return {
              ...recipe,
              params: getCanvasCoordinates(animatedParams.re, animatedParams.im)
            }
          });

          return {
            ...recipe,
            params: { allClicked: animatedAllClicked }
          };
        }

        default: {
          throw new Error(`Unexpected shape name while rotating: ${name}`)
        }
      }
    }
  }
  //#endregion

  /** Event handlers */
  //#region
  function handleMouseDown(konvaEvent) {
    konvaEvent.evt.preventDefault();

    if (openDropdown !== null) {
      setOpenDropdown(null);
      return;
    }

    if (isAnimating) {
      setIsAnimating(false);
    }

    const clickCoords = getCurrentCoordinates(konvaEvent);
    const outOfBounds = clickCoords.mathY < 0;
    if (outOfBounds) return;

    setMouseCoords(isTouchDevice ? null : clickCoords);
    mouseXRef.current = clickCoords.canvasX;

    const { snapshots, currIdx } = history;
    const selectedShape = snapshots[currIdx].find(recipe => recipe.isSelected);
    const konvaShape = konvaEvent.target;
    const shapeId = konvaShape.getParent()?.id()
    const someShapeClicked = konvaShape !== konvaShape.getStage() && shapeId !== undefined;
    if (someShapeClicked) {
      const selectedShapeClicked = selectedShape?.id === shapeId;
      
      if (selectedShape && selectedShapeClicked) {
        clickedShapeRef.current = null;
      } else {
        clickedShapeRef.current = konvaShape;
      }
      
      transformCurrentDrawings(recipe => ({ ...recipe, isSelected: false }));
      return;
    }

    // transformCurrentDrawings(recipe => ({ ...recipe, isSelected: false }));

    const activeCoords = snapshots[currIdx].filter(recipe => recipe.isActive);
    const holdIndicator = holdIndicatorRef.current;

    clickedShapeRef.current = null;
    holdStartTimeRef.current = performance.now();
    mouseAnimFrameRef.current = requestAnimationFrame(checkHoldDuration);

    function checkHoldDuration() {
      const holdDuration = performance.now() - holdStartTimeRef.current;
      if (holdIndicator) {
        const indicatorAngle = 360 * (holdDuration / HOLD_DURATION_THRESHOLD);
        holdIndicator.angle(indicatorAngle);
      }
      
      if (holdDuration >= HOLD_DURATION_THRESHOLD) {
        cancelAnimationFrame(mouseAnimFrameRef.current);
        mouseAnimFrameRef.current = null;

        const draggingCanvas = mouseXRef.current !== clickCoords.canvasX;
        if (clickTool === 'polygon' && activeCoords.length > 0 && !draggingCanvas) {
          if (activeCoords.length === 1) {
            // setShowToast(true);
            // setToastToShow('polygonError');
            setActiveToasts(prev => [ ...prev, 'polygonError'] );
          } else {
            const longPress = true;
            addDrawingToHistory(clickCoords, longPress);
          }
        }
        
        if (holdIndicator) {
          holdIndicator.angle(0);
        }
        return;
      }

      mouseAnimFrameRef.current = requestAnimationFrame(checkHoldDuration);
    }
  }

  function handleMouseMove(konvaEvent) {
    const currCoords = getCurrentCoordinates(konvaEvent)
    setMouseCoords(currCoords);

    if (currCoords.mathY < 0) {
      document.body.style.cursor = "not-allowed";
    } else {
      document.body.style.cursor = "default";
    }

    const { snapshots, currIdx } = history;
    const someShapeClicked = clickedShapeRef.current !== null;
    const someShapeSelected = snapshots[currIdx].find(recipe => recipe.isSelected) !== undefined;
    if (mouseXRef.current === null || someShapeClicked || someShapeSelected) return;

    const dispX = currCoords.canvasX - mouseXRef.current;
    if (Math.abs(dispX) > 2) {
      mouseXRef.current = currCoords.canvasX;
      setCanvasIsDragging(true);
      // setOriginX(prev => prev + dispX);
      setOriginCoords(prev => ({ ...prev, x: prev.x + dispX }));
      transformAllDrawings(recipe => {
        const { name, params } = recipe;

        switch(name) {
          case 'rotation':
          case 'horocycle':
          case 'point': {
            return {
              ...recipe,
              params: {
                ...params,
                canvasX: params.canvasX + dispX
              }
            };
          };

          case 'translation':
          case 'segment':
          case 'circle':
          case 'geodesic': {
            const { clicked1, clicked2 } = params;
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
            const { allClicked } = params;
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
            throw new Error(`Unexpected shape name while dragging canvas: ${name}`);
          }
        }
      });
    }
  }

  function handleMouseUp(konvaEvent) {
    const holdIndicator = holdIndicatorRef.current;
    if (holdIndicator) {
      holdIndicator.angle(0);
    }

    if (mouseAnimFrameRef.current !== null) {
      cancelAnimationFrame(mouseAnimFrameRef.current);
      mouseAnimFrameRef.current = null;
    }

    const endCoords = getCurrentCoordinates(konvaEvent)
    setMouseCoords(isTouchDevice ? null : endCoords);

    if (!shapeIsDragging && !canvasIsDragging) {
      const holdDuration = performance.now() - holdStartTimeRef.current;
      const shortHold = holdDuration < HOLD_DURATION_THRESHOLD;
      const { snapshots, currIdx } = history;
      const selectedShape = snapshots[currIdx].find(recipe => recipe.isSelected)
      if (shortHold && selectedShape === undefined) {
        addDrawingToHistory(endCoords);
      }
      
      const shapeWasClicked = clickedShapeRef.current !== null;
      if (shapeWasClicked) {
        const clickedShapeId = clickedShapeRef.current.getParent().id();
        transformCurrentDrawings(recipe => {
          if (recipe.id !== clickedShapeId) return recipe;

          return {
            ...recipe,
            isSelected: true,
          }
        });
      } else {
        transformCurrentDrawings(recipe => ({ ...recipe, isSelected: false }))
      }
    }

    setCanvasIsDragging(false);
    mouseXRef.current = null;
  }

  function handleMouseLeave() {
    setMouseCoords(null);
    mouseXRef.current = null;
  }
  function handleShapeDragStart() {
  // function handleShapeDragStart(event) {
    // const konvaShape = event.target;
    // console.log(konvaShape.x(), konvaShape.y())
    // console.log('start');
    setShapeIsDragging(true);
    copyCurrentDrawings();
  }

  function handleShapeDragMove(konvaEvent, newParams, recipeId) {
    const currCoords = getCurrentCoordinates(konvaEvent);
    setMouseCoords(currCoords);

    // console.log('newParams', newParams);
    // console.log('recipeId:', recipeId);

    transformCurrentDrawings(recipe => {
      if (recipe.id !== recipeId) return recipe;

      return {
        ...recipe,
        params: newParams
      }
    });
  }
  function handleShapeDragEnd() {
  // function handleShapeDragEnd(event) {
  //   const konvaShape = event.target;
  //   console.log(konvaShape.x(), konvaShape.y())
  //   console.log('end')
    setShapeIsDragging(false);
  }
  //#endregion

  /** Turn recipes into components */
  //#region
  const { snapshots, currIdx } = history;
  const drawings = snapshots[currIdx].map(recipe => {
    // const { name, id, isActive, isSelected, params } = recipe;
    const { name, id, isActive, isSelected, styles, params } = recipe;
    const { color, strokeWidth } = styles;

    if (isActive) {
      return (
        <Point
          key={id}
          id={id}
          clickedX={params.canvasX}
          clickedY={params.canvasY}
          getMathCoordinates={getMathCoordinates}
          color={ACTIVE_POINT_COLOR}
          strokeWidth={strokeWidth}
          isDraggable={false}
          isActive={isActive}
        />
      );
    }

    if (!name) throw new Error(`Missing shape name from recipe: ${recipe}`);

    switch(name) {
      case 'point': {
        return (
          <Point
            key={id}
            id={id}
            clickedX={params.canvasX}
            clickedY={params.canvasY}
            getMathCoordinates={getMathCoordinates}
            color={color}
            strokeWidth={strokeWidth}
            onDragStart={handleShapeDragStart}
            onDragMove={handleShapeDragMove}
            onDragEnd={handleShapeDragEnd}
            isSelected={isSelected}
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
            isSelected={isSelected}
            color={color}
            strokeWidth={strokeWidth}
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
            getCanvasCoordinates={getCanvasCoordinates}
            onDragStart={handleShapeDragStart}
            onDragMove={handleShapeDragMove}
            onDragEnd={handleShapeDragEnd}
            isSelected={isSelected}
            color={color}
            strokeWidth={strokeWidth}
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
            isSelected={isSelected}
            color={color}
            strokeWidth={strokeWidth}
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
            getCanvasCoordinates={getCanvasCoordinates}
            onDragStart={handleShapeDragStart}
            onDragMove={handleShapeDragMove}
            onDragEnd={handleShapeDragEnd}
            isSelected={isSelected}
            color={color}
            strokeWidth={strokeWidth}
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
            getCanvasCoordinates={getCanvasCoordinates}
            onDragStart={handleShapeDragStart}
            onDragMove={handleShapeDragMove}
            onDragEnd={handleShapeDragEnd}
            isSelected={isSelected}
            color={color}
            strokeWidth={strokeWidth}
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
            isSelected={isSelected}
            animationSpeed={animationSpeed}
          />
        )
      }
      case 'translation': {
        return (
          <AxisOfTranslation
            key={id}
            id={id}
            clicked1={params.clicked1}
            clicked2={params.clicked2}
            getMathCoordinates={getMathCoordinates}
            getCanvasCoordinates={getCanvasCoordinates}
            onDragStart={handleShapeDragStart}
            onDragMove={handleShapeDragMove}
            onDragEnd={handleShapeDragEnd}
            isAnimating={isAnimating}
            isSelected={isSelected}
            animationSpeed={animationSpeed}
          />
        )
      }
      default: {
        throw new Error(`Unexpected shape name: ${name}`);
      }
    }
  });
  //#endregion

  return (
    <Stage
      ref={stageRef}

      width={canvasDimensions.width}
      height={canvasDimensions.height}

      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}

      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}

      onMouseLeave={handleMouseLeave}
    >
      {/* DRAWINGS */}
      <Layer>
        { drawings }
      </Layer>

      {/* NEGATIVE Y-VALUES MASK */}
      <Layer>
        <Rect
          y={originCoords.y}
          width={window.innerWidth}
          height={window.innerHeight - originCoords.y}
          fill={"rgb(33, 37, 41)"}
          // opacity={1}
        />
      </Layer>

      {/* AXES */}
      <Layer>
        <Axes 
          // originX={originX}
          originCoords={originCoords}
          getMathCoordinates={getMathCoordinates}
          settings={settings}
          zoomScale={zoomScale}
        />
      </Layer>

      {/* CURSOR LAYER */}
      <Layer>
        {
          settings.showMouseCoords && mouseCoords && 
            <Text
              x={mouseCoords.canvasX}
              y={mouseCoords.canvasY}
              offsetX={isTouchDevice ? -20 : -5}
              offsetY={isTouchDevice ? CURSOR_FONT_SIZE * 2 : CURSOR_FONT_SIZE * 1.1}
              text={`(${mouseCoords.mathX}, ${mouseCoords.mathY})`}
              fill={CURSOR_COORD_COLOR}
              fontSize={CURSOR_FONT_SIZE}
            />
        }
        {
          mouseCoords && clickTool === 'polygon' &&
            <Arc
              ref={holdIndicatorRef}
              x={mouseCoords.canvasX}
              y={mouseCoords.canvasY}
              offsetX={isTouchDevice ? 20 : 40}
              innerRadius={8}
              outerRadius={16}
              fill={'orange'}
            />
        }
      </Layer>
    </Stage>
  );
}