import { useEffect, useRef } from "react";
import Card from "react-bootstrap/Card";
import Draggable from "react-draggable";

export default function FloatingDraggableCard({
  handleDragStop = () => {},
  cardBodyStyles = undefined,
  placement,
  centered = false,
  children
}) {
  const nodeRef = useRef(null);
  const cardBodyRef = useRef(null);

  useEffect(() => {
    if (!centered) return;

    const cardBody = cardBodyRef.current;
    const cardBodyWidth = parseFloat(getComputedStyle(cardBody).getPropertyValue('width'));

    const card = nodeRef.current;
    card.style.left = `${(window.innerWidth - cardBodyWidth) / 2}px`;
  }, []);

  const cardStyle = {
    position: "fixed",
    zIndex: "10",
    ...placement
  };

  return (
    <Draggable
      nodeRef={nodeRef} 
      cancel="input"
      onStop={handleDragStop}
    >
      <Card ref={nodeRef} style={cardStyle}>
        <Card.Body ref={cardBodyRef} style={cardBodyStyles}>
          { children }
        </Card.Body>
      </Card>
    </Draggable>
  );
}

// export default function FloatingDraggableCard({
//   title = "",
//   handleDragStop = () => {},
//   placement,
//   centered,
//   children
// }) {
//   const nodeRef = useRef(null);
//   const cardBodyRef = useRef(null);

//   useEffect(() => {
//     if (!centered) return;

//     const cardBody = cardBodyRef.current;
//     const cardBodyWidth = parseFloat(getComputedStyle(cardBody).getPropertyValue('width'));

//     const card = nodeRef.current;
//     card.style.left = `${(window.innerWidth - cardBodyWidth) / 2}px`;
//   }, []);

//   const cardStyle = {
//     position: "fixed",
//     margin: "1rem",
//     zIndex: "10",
//     ...placement
//   };

//   return (
//     <Draggable
//       nodeRef={nodeRef} 
//       cancel="input" 
//       onStop={handleDragStop}
//     >
//       <Card ref={nodeRef} style={cardStyle}>
//         <Card.Body ref={cardBodyRef}>
//           {
//             title !== "" &&
//               <Card.Title><span className="me-auto">{ title }</span></Card.Title>
//           }

//           { children }
//         </Card.Body>
//       </Card>
//     </Draggable>
//   );
// }