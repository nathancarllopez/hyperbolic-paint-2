import { Arc, Layer, Rect, Stage, Text } from "react-konva";
import { useEffect, useRef, useState } from "react";

import { ACTIVE_POINT_COLOR, ANIM_SPEED_DAMPENER, ANIMATION_TOOLNAMES, CURSOR_COORD_COLOR, CURSOR_FONT_SIZE, INITIAL_CANVAS_DIMENSIONS, INITIAL_ORIGIN_COORDS } from "../util/constants";
import Axes from "./shapes/Axes";
import AxisOfTranslation from "./animation shapes/AxisOfTranslation";
import CenterOfRotation from "./animation shapes/CenterOfRotation";
import Point from "./shapes/Point";
import Horocycle from "./shapes/Horocycle";
import Geodesic from "./shapes/Geodesic";
import HypCircle from "./shapes/HypCircle";
import Segment from "./shapes/Segment";
import Polygon from "./shapes/Polygon";
import MobiusTransformation from "./math/mobiusTransformations";
import generateId from "../util/generateId";

export default function HypCanvas({
  clickTool,
  settings,
  history, setHistory,
  isAnimating,
  animationSpeed,
  zoomScale, setZoomScale,
  setActiveToasts,
  drawingColor,
  drawingWidth,
  openDropdown, setOpenDropdown,
}) {
  /** State */
  //#region
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const [mouseCoords, setMouseCoords] = useState(null);
  const [draggingShapeId, setDraggingShapeId] = useState("");
  const [canvasIsDragging, setCanvasIsDragging] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState(INITIAL_CANVAS_DIMENSIONS);
  const [originCoords, setOriginCoords] = useState(INITIAL_ORIGIN_COORDS)
  //#endregion

  /** Refs */
  //#region
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
      const aDrawingIsSelected = snapshots[currIdx].find(drawing => drawing.isSelected) !== undefined;
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

  useEffect(() => { // Controls zooming in and out (Under construction)
    const handleWheel = (event) => {
      event.preventDefault();
      console.log(event.deltaY);

      // Scrolling up gives negative values for deltaY, while scrolling down gives positive values
      setZoomScale(prev => {
        const intZoomScale = Math.log(prev);
        const deltaY = event.deltaY;
        const newZoomScale = Math.exp(intZoomScale + deltaY);
        return newZoomScale;
      });
    }
    
    const stage = stageRef.current;
    stage.addEventListener('wheel', handleWheel);

    return () => {
      stage.removeEventListener('wheel', handleWheel);
    }
  }, [zoomScale]);

  useEffect(() => { // Updates canvas size when window is resized
    const handleWindowResize = () => {
      setCanvasDimensions({ width: window.innerWidth, height: window.innerHeight });
    }

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    }
  }, []);

  /**
   * First try: Updates animations as the animation shape is dragged as intended, but has the "maximum update depth exceeded" error from React
   */
  useEffect(() => {
    if (!isAnimating) return;

    const { snapshots, currIdx } = history;
    const animationShape = snapshots[currIdx].find(drawing => ANIMATION_TOOLNAMES.includes(drawing.name));
    if (!animationShape) return;

    copyCurrentDrawings();
    const animationShapeId = animationShape.id;
    const animationFunc = getAnimationFunction(animationShape);
    let animationFrame = requestAnimationFrame(doAnimation);

    function doAnimation() {
      if (!isAnimating) return;

      const { snapshots, currIdx } = history;
      const animationShapeDeleted = snapshots[currIdx].every(drawing => drawing.id !== animationShapeId);
      if (animationShapeDeleted) return;

      transformCurrentDrawings(drawing => animationFunc(drawing, animationSpeed * ANIM_SPEED_DAMPENER));

      animationFrame = requestAnimationFrame(doAnimation);
    }

    return () => {
      cancelAnimationFrame(animationFrame);
    }
  }, [history, isAnimating, animationSpeed]);

  /**
   * Second try: Removed history from the dependency array, but now the animation doesn't update while the animation shape is dragged
   */
  // useEffect(() => {
  //   if (!isAnimating) return;

  //   const { snapshots, currIdx } = history;
  //   const animationShape = snapshots[currIdx].find(drawing => ANIMATION_TOOLNAMES.includes(drawing.name));
  //   if (!animationShape) return;

  //   copyCurrentDrawings();
  //   const animationShapeId = animationShape.id;
  //   const animationFunc = getAnimationFunction(animationShape);
  //   let animationFrame = requestAnimationFrame(doAnimation);

  //   function doAnimation() {
  //     if (!isAnimating) return;

  //     const { snapshots, currIdx } = history;
  //     const animationShapeDeleted = snapshots[currIdx].every(drawing => drawing.id !== animationShapeId);
  //     if (animationShapeDeleted) return;

  //     transformCurrentDrawings(drawing => animationFunc(drawing, animationSpeed * ANIM_SPEED_DAMPENER));

  //     animationFrame = requestAnimationFrame(doAnimation);
  //   }

  //   return () => {
  //     cancelAnimationFrame(animationFrame);
  //   }
  // }, [isAnimating, animationSpeed]);

  /**
   * Third try: Updates animation once the animation shape has finished dragging, but doesn't update while dragging
   */
  // useEffect(() => { // Updates shapes while animating (Under construction)
  //   if (!isAnimating) return;

  //   const { snapshots, currIdx } = history;
  //   let animationShape = snapshots[currIdx].find(drawing => ANIMATION_TOOLNAMES.includes(drawing.name));
  //   let animationShapeId = animationShape.id;
  //   if (!animationShape) return;

  //   copyCurrentDrawings();

  //   let animationFunc = getAnimationFunction(animationShape);
  //   let animationFrame = requestAnimationFrame(doAnimation);

  //   function doAnimation() {
  //     if (!isAnimating) {
  //       cancelAnimationFrame(animationFrame);
  //       return;
  //     }

  //     const animationShapeDeleted = snapshots[currIdx].every(drawing => drawing.id !== animationShapeId);
  //     if (animationShapeDeleted) {
  //       cancelAnimationFrame(animationFrame);
  //       return;
  //     }

  //     if (draggingShapeId && draggingShapeId === animationShape.id) {
  //       const { snapshots, currIdx } = history;
  //       animationShape = snapshots[currIdx].find(drawing => ANIMATION_TOOLNAMES.includes(drawing.name));
  //       animationShapeId = animationShape.id;
  //       animationFunc = getAnimationFunction(animationShape);
  //     }

  //     transformCurrentDrawings(drawing => animationFunc(drawing, animationSpeed * ANIM_SPEED_DAMPENER));

  //     animationFrame = requestAnimationFrame(doAnimation);
  //   }

  //   return () => {
  //     cancelAnimationFrame(animationFrame);
  //   }
  // }, [isAnimating, animationSpeed, draggingShapeId]);
  //#endregion

  /** Drawing utility functions */
  //#region
  function getCurrentCoordinates(konvaEvent) {
    const { x, y } = konvaEvent.target.getStage().getPointerPosition();

    return {
      canvasX: x,
      canvasY: y,
      mathX: x - zoomScale * originCoords.x,
      mathY: zoomScale * originCoords.y - y
    };
  }

  function getCanvasCoordinates(mathX, mathY = 0) {
    return {
      canvasX: Math.floor(mathX + zoomScale * originCoords.x),
      canvasY: Math.floor(zoomScale * originCoords.y - mathY),
      mathX,
      mathY
    };
  }

  function getMathCoordinates(canvasX, canvasY = originCoords.y) {
    return {
      canvasX,
      canvasY,
      mathX: canvasX - zoomScale * originCoords.x,
      mathY: zoomScale * originCoords.y - canvasY
    };
  }

  function addDrawingToHistory(lastClickedCoords, longPress = false) {
    const { snapshots, currIdx } = history;
    const currActiveCoords = snapshots[currIdx].filter(drawing => drawing.isActive);

    const drawing = ((activeCoords) => {
      const template = {
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
            ...template,
            name: clickTool
          };
        }

        case 'translation':
        case 'segment':
        case 'circle':
        case 'geodesic': {
          if (activeCoords.length === 0) {
            return {
              ...template,
              isActive: true,
            };
          } 
          
          const clicked1 = {
            ...activeCoords[0],
            isActive: false,
          }
          const clicked2 = template;

          return {
            ...template,
            name: clickTool,
            id: generateId(),
            styles: { ...template.styles },
            params: { clicked1, clicked2 }
          }
        }

        case 'polygon': {
          if (!longPress) {
            return {
              ...template,
              isActive: true,
            };
          }

          const firstVertices = activeCoords.map(drawing => {
            return {
              ...drawing,
              isActive: false,
            }
          });
          const lastVertex = template;

          return {
            ...template,
            name: clickTool,
            id: generateId(),
            styles: { ...template.styles },
            params: { allClicked: [ ...firstVertices, lastVertex ] }
          }
        }

        default: {
          throw new Error(`Unexpected click tool: ${clickTool}`);
        }
      }
    })(currActiveCoords);

    setHistory(prev => {
      const { snapshots, currIdx } = prev;
      const snapshotsTillCurrent = snapshots.slice(0, currIdx + 1);
      const currentSnapshot = [ ...snapshots[currIdx] ];

      const newDrawings = (() => {
        if (ANIMATION_TOOLNAMES.includes(drawing.name)) {
          const noAnimationShapes = currentSnapshot.filter(drawing => !ANIMATION_TOOLNAMES.includes(drawing.name) && !drawing.isActive);
          return [ ...noAnimationShapes, drawing ];
        } else if (!drawing.isActive) {
          const noActivePoints = currentSnapshot.filter(drawing => !drawing.isActive);
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
    setHistory(prev => {
      const { snapshots, currIdx } = prev;
      const snapshotsTillCurrent = snapshots.slice(0, currIdx + 1);
      const transformedSnapshots = snapshotsTillCurrent.map(
        snapshot => snapshot.map(drawing => mapFunc(drawing))
      );

      return { ...prev, snapshots: transformedSnapshots };
    })
  }

  function transformCurrentDrawings(mapFunc) {
    setHistory(prev => {
      const { snapshots, currIdx } = prev;
      const previousSnapshots = snapshots.slice(0, currIdx);
      const currentSnapshot = snapshots[currIdx];
      const transformedCurrent = currentSnapshot.map(drawing => mapFunc(drawing));

      return { ...prev, snapshots: [ ...previousSnapshots, transformedCurrent ] };
    });
  }

  function deleteSelectedDrawing() {
    setHistory(prev => {
      const { snapshots, currIdx } = prev;
      const snapshotsTillCurrent = snapshots.slice(0, currIdx + 1);
      const currentSnapshot = snapshots[currIdx];
      
      const filteredSnapshot = currentSnapshot.filter(drawing => !drawing.isSelected);
      const noDrawingSelected = filteredSnapshot.length === 0;
      if (noDrawingSelected) return prev;

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

    return (drawing, animationSpeed) => {
      const { name, params } = drawing;
      if (name === animationShape.name) return drawing;
      
      const animationFunc = mobius(animationSpeed);
      switch(name) {
        case "point":
        case "horocycle": {
          const { re, im } = animationFunc.applyToCoords(params);
          return {
            ...drawing,
            params: getCanvasCoordinates(re, im)
          };
        };

        case "segment":
        case "circle":
        case "geodesic": {
          const { clicked1, clicked2 } = params;
          const [animatedClicked1, animatedClicked2] = [clicked1, clicked2].map(d => {
            const { params } = d;
            const animatedParams = animationFunc.applyToCoords(params); // Now a ComplexNumber, see ./math/complexNumber.js
            return {
              ...d,
              params: getCanvasCoordinates(animatedParams.re, animatedParams.im)
            };
          });

          return {
            ...drawing,
            params: { clicked1: animatedClicked1, clicked2: animatedClicked2 }
          };
        }

        case 'polygon': {
          const { allClicked } = params;
          const animatedAllClicked = allClicked.map(d => {
            const { params } = d;
            const animatedParams = animationFunc.applyToCoords(params); // Now a ComplexNumber, see ./math/complexNumber.js
            return {
              ...d,
              params: getCanvasCoordinates(animatedParams.re, animatedParams.im)
            }
          });

          return {
            ...drawing,
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

    const clickCoords = getCurrentCoordinates(konvaEvent);
    const shouldExitEarly = checkForEarlyExits(clickCoords);
    if (shouldExitEarly) return;

    setMouseCoords(clickCoords);
    mouseXRef.current = clickCoords.canvasX;

    const { snapshots , currIdx } = history;
    const currentDrawings = snapshots[currIdx];
    const konvaShape = konvaEvent.target;
    const shapeWasClicked = checkForShapeClick(currentDrawings, konvaShape);
    if (shapeWasClicked) return;

    const activePointCount = currentDrawings.reduce((count, drawing) => {
      return drawing.isActive ? count + 1 : count;
    }, 0);

    clickedShapeRef.current = null;
    holdStartTimeRef.current = performance.now();
    mouseAnimFrameRef.current = requestAnimationFrame(() => checkHoldDuration(activePointCount, clickCoords));
  }

  function checkForEarlyExits(clickCoords) {
    if (openDropdown !== null) {
      setOpenDropdown(null);
      return true;
    }

    const outOfBounds = clickCoords.mathY < 0;
    if (outOfBounds) {
      return true;
    }

    return false;
  }

  function checkForShapeClick(currentDrawings, konvaShape) {
    const clickedStage = konvaShape === konvaShape.getStage();
    if (clickedStage) return false;

    const konvaShapeId = konvaShape.getParent()?.id();
    if (!konvaShapeId) return false; // Clicked the axes, e.g

    const previouslySelected = currentDrawings.find(drawing => drawing.isSelected);
    const previouslySelectedClicked = konvaShapeId === previouslySelected?.id;
    
    if (previouslySelectedClicked) {
      clickedShapeRef.current = null;
    } else {
      clickedShapeRef.current = konvaShape;
    }
      
    transformCurrentDrawings(drawing => ({ ...drawing, isSelected: false }));
    return true;
  }

  function checkHoldDuration(activePointCount, clickCoords) {
    const holdDuration = performance.now() - holdStartTimeRef.current;
    const holdIndicator = holdIndicatorRef.current;
    if (holdIndicator) {
      const indicatorAngle = 360 * (holdDuration / settings.holdDuration);
      holdIndicator.angle(indicatorAngle);
    }
    
    if (holdDuration >= settings.holdDuration) {
      cancelAnimationFrame(mouseAnimFrameRef.current);
      mouseAnimFrameRef.current = null;

      const draggingCanvas = mouseXRef.current !== clickCoords.canvasX;
      if (clickTool === 'polygon' && !draggingCanvas) {
        if (activePointCount < 2) {
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

    mouseAnimFrameRef.current = requestAnimationFrame(() => checkHoldDuration(activePointCount, clickCoords));
  }

  function handleMouseMove(konvaEvent) {
    const currCoords = getCurrentCoordinates(konvaEvent)
    document.body.style.cursor = currCoords.mathY < 0 ? "not-allowed" : "default";
    setMouseCoords(currCoords);

    const { snapshots, currIdx } = history;
    const someShapeClicked = clickedShapeRef.current !== null;
    const someShapeSelected = snapshots[currIdx].find(drawing => drawing.isSelected) !== undefined;
    if (mouseXRef.current === null || someShapeClicked || someShapeSelected) return;

    const dispX = currCoords.canvasX - mouseXRef.current;
    if (Math.abs(dispX) > 2) {  // To do: What is the right number here?
      mouseXRef.current = currCoords.canvasX;
      setCanvasIsDragging(true);
      setOriginCoords(prev => ({ ...prev, x: prev.x + dispX }));
      transformAllDrawings(drawing => {
        const { name, params } = drawing;

        switch(name) {
          case 'rotation':
          case 'horocycle':
          case 'point': {
            return {
              ...drawing,
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
            const [dispClicked1, dispClicked2] = [clicked1, clicked2].map(clicked => {
              return {
                ...clicked,
                params: {
                  ...clicked.params,
                  canvasX: clicked.params.canvasX + dispX
                }
              }
            });

            return {
              ...drawing,
              params: { clicked1: dispClicked1, clicked2: dispClicked2 }
            };
          };

          case 'polygon': {
            const { allClicked } = params;
            const dispAllClicked = allClicked.map(clicked => {
              return {
                ...clicked,
                params: {
                  ...clicked.params,
                  canvasX: clicked.params.canvasX + dispX
                }
              };
            });

            return {
              ...drawing,
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

    if (!draggingShapeId && !canvasIsDragging) {
      const holdDuration = performance.now() - holdStartTimeRef.current;
      const shortHold = holdDuration < settings.holdDuration;
      if (shortHold) {
        const { snapshots, currIdx } = history;
        const noSelectedShape = snapshots[currIdx].every(drawing => !drawing.isSelected);
        if (noSelectedShape) {
          addDrawingToHistory(endCoords);
        }
      }
      
      const shapeWasClicked = clickedShapeRef.current !== null;
      if (shapeWasClicked) {
        const clickedShapeId = clickedShapeRef.current.getParent().id();
        transformCurrentDrawings(drawing => {
          if (drawing.id !== clickedShapeId) return drawing;

          return {
            ...drawing,
            isSelected: true,
          }
        });
      } else {
        transformCurrentDrawings(drawing => ({ ...drawing, isSelected: false }))
      }
    }

    setCanvasIsDragging(false);
    mouseXRef.current = null;
  }

  function handleMouseLeave() {
    setMouseCoords(null);
    mouseXRef.current = null;
  }

  function handleShapeDragStart(event) {
    setDraggingShapeId(event.target.getParent().id());
    copyCurrentDrawings();
  }

  function handleShapeDragMove(konvaEvent, newParams, drawingId) {
    const currCoords = getCurrentCoordinates(konvaEvent);
    setMouseCoords(currCoords);

    transformCurrentDrawings(drawing => {
      if (drawing.id !== drawingId) return drawing;
      return {
        ...drawing,
        params: newParams
      }
    });
  }

  function handleShapeDragEnd() {
    setDraggingShapeId(null);
  }
  //#endregion

  /** Turn drawings into components */
  //#region
  const { snapshots, currIdx } = history;
  const drawings = snapshots[currIdx].map(drawing => {
    const { name, id, isActive, isSelected, styles, params } = drawing;
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
          radius={settings.pointRadius}
          isDraggable={false}
          isActive={isActive}
        />
      );
    }

    if (!name) throw new Error(`Missing name from drawing: ${drawing}`);

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
            radius={settings.pointRadius}
            onDragStart={handleShapeDragStart}
            onDragMove={handleShapeDragMove}
            onDragEnd={handleShapeDragEnd}
            isSelected={isSelected}
            originY={originCoords.y}
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
            anchorRadius={settings.pointRadius}
            originY={originCoords.y}
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
            anchorRadius={settings.pointRadius}
            originY={originCoords.y}
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
            anchorRadius={settings.pointRadius}
            originY={originCoords.y}
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
            anchorRadius={settings.pointRadius}
            originY={originCoords.y}
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
            anchorRadius={settings.pointRadius}
            originY={originCoords.y}
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
            anchorRadius={settings.pointRadius}
            originY={originCoords.y}
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
            anchorRadius={settings.pointRadius}
            originY={originCoords.y}
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
      <Layer>{ drawings }</Layer>

      {/* NEGATIVE Y-VALUES MASK */}
      <Layer>
        <Rect
          y={originCoords.y}
          width={window.innerWidth}
          height={window.innerHeight - originCoords.y}
          fill={"rgb(33, 37, 41)"}
        />
      </Layer>

      {/* AXES */}
      <Layer>
        <Axes 
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
          clickTool === 'polygon' && mouseCoords && 
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