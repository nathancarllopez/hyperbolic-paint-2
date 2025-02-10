// import { useEffect, useRef } from "react";
// import Button from "react-bootstrap/Button";
// import Card from "react-bootstrap/Card";
// import Stack from "react-bootstrap/Stack";
// import Draggable from "react-draggable";

// export default function FloatingControlPanel({
//   buttonInfo = [],
//   placement,
// }) {
//   const nodeRef = useRef(null);
//   const cardBodyRef = useRef(null);

//   useEffect(() => {
//     if (!placement.includes('middle')) return;

//     const cardBody = cardBodyRef.current;
//     const cardBodyStyles = getComputedStyle(cardBody);
//     const cardWidth = parseFloat(cardBodyStyles.getPropertyValue('width'));

//     const card = nodeRef.current;
//     card.style.left = `${(window.innerWidth - cardWidth) / 2}px`;
//   }, []);

//   const cardStyle = (() => {
//     const styles = { position: "fixed", margin: "1rem", zIndex: "10" };
//     switch(placement) {
//       case 'bottom-left': {
//         return { ...styles, bottom: 0, left: 0 };
//       };
//       case 'bottom-right': {
//         return { ...styles, bottom: 0, right: 0 };
//       };
//       case 'top-middle': {
//         return { ...styles, top: 0 };
//       };
//       case 'bottom-middle': {
//         return { ...styles, bottom: 0 };
//       };
//       default: {
//         throw new Error(`Unexpected placement: ${placement}`);
//       }
//     }
//   })();

//   return (
//     <Draggable nodeRef={nodeRef}>
//       <Card ref={nodeRef} style={cardStyle}>
//         <Card.Body ref={cardBodyRef}>
//           <Stack gap={3}>
//             {
//               buttonInfo.length > 0 && buttonInfo.map(({ key, disabled, onPress, label }) => (
//                 <Button
//                   key={key}
//                   disabled={disabled}
//                   onClick={onPress}
//                   onTouchStart={onPress}
//                 >
//                   { label }
//                 </Button>
//               ))
//             }
//           </Stack>
//         </Card.Body>
//       </Card>
//     </Draggable>
//   );
// }