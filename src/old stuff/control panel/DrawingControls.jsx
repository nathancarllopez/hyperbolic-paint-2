// import Button from "react-bootstrap/Button"
// import Card from "react-bootstrap/Card"
// import Stack from "react-bootstrap/Stack"
// import CollapsibleCard from "../util/CollapsibleCard";

// export default function DrawingControls({
//   history,
//   setHistory,
//   toolbarState,
//   isOpen,
//   toggleIsOpen
// }) {
//   const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
//   const clickTap = isTouchDevice ? "Tap" : "Click";
//   const allToolInfo = {
//     point: { label: "Point", instructions: `${clickTap} once` },
//     geodesic: { label: "Line", instructions: `${clickTap} twice` },
//     circle: { label: "Circle", instructions: "Choose a center then a radius" },
//     horocycle: { label: "Horocycle", instructions: `${clickTap} once` },
//     segment: { label: "Line segment", instructions: `${clickTap} twice` },
//     polygon: { label: "Polygon", instructions: `${clickTap} and hold to choose the last vertex` }
//   };
//   const toolInfo = allToolInfo[toolbarState.clickTool] || {};

//   const { snapshots, currIdx } = history;
//   const buttonInfo = [
//     {
//       key: 'undo',
//       label: "Undo",
//       disabled: currIdx === 0,
//       onPress: () => setHistory(prev => {
//         const { currIdx } = prev;
//         return {
//           ...prev,
//           currIdx: Math.max(0, currIdx - 1)
//         }
//       })
//     },
//     {
//       key: 'redo',
//       label: "Redo",
//       disabled: currIdx === snapshots.length - 1,
//       onPress: () => setHistory(prev => {
//         const { snapshots, currIdx } = prev;
//         return {
//           ...prev,
//           currIdx: Math.min(snapshots.length - 1, currIdx + 1)
//         }
//       })
//     },
//     {
//       key: 'clear',
//       label: "Clear",
//       disabled: snapshots[currIdx].length === 0,
//       onPress: () => setHistory(prev => {
//         const { snapshots, currIdx } = prev;
//         const snapshotsTillCurrent = snapshots.slice(0, currIdx + 1);
//         return {
//           snapshots: [ ...snapshotsTillCurrent, [] ],
//           currIdx: currIdx + 1
//         }
//       })
//     }
//   ];

//   return (
//     <CollapsibleCard
//       title={"Drawing"}
//       isOpen={isOpen}
//       toggleIsOpen={toggleIsOpen}
//     >
//       <Card.Text>
//         Tool: { toolInfo.label || "n/a" }
//         <br/>
//         Instructions: { toolInfo.instructions || "n/a" }
//       </Card.Text>
      
//       <Stack direction="horizontal" gap={3} className="mb-2">
//         {
//           buttonInfo.map(({ key, label, disabled, onPress }, idx) => (
//             <Button
//               key={key}
//               className={ idx === 0 ? "ms-auto" : idx === buttonInfo.length - 1 ? "me-auto" : undefined }
//               disabled={disabled}
//               onClick={onPress}
//               onTouchStart={onPress}
//             >
//               { label }
//             </Button>
//           )) 
//         }
//       </Stack>
      
//     </CollapsibleCard>
//   );
// }