import { useEffect, useRef } from "react";
import Card from "react-bootstrap/Card";
import Draggable from "react-draggable";

export default function FloatingDraggableCard({
  title = "",
  handleDragStop = () => {},
  placement,
  centered,
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
    margin: "1rem",
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
        <Card.Body ref={cardBodyRef}>

          {
            title !== "" &&
              <Card.Title><span className="me-auto">{ title }</span></Card.Title>
          }

          { children }

        </Card.Body>
      </Card>
    </Draggable>
  );
}

// export default function FloatingDraggableCard({
//   title = "",
//   isVertical, setIsVertical,
//   children
// }) {
//   const nodeRef = useRef(null);
//   const cardBodyRef = useRef(null);

//   useEffect(() => {
//     const cardBody = cardBodyRef.current;
//     const card = nodeRef.current;

//     // if (isVertical) {
//     //   const cardBodyHeight = parseFloat(getComputedStyle(cardBody).getPropertyValue('height'));
//     //   card.style.right = '0';
//     //   card.style.top = `${(window.innerHeight - cardBodyHeight) / 2}px`;
//     // } else {
//       const cardBodyWidth = parseFloat(getComputedStyle(cardBody).getPropertyValue('width'));
//       card.style.top = '0';
//       card.style.left = `${(window.innerWidth - cardBodyWidth) / 2}px`;
//     // }
//   }, []);

//   function handleDragStop() {
//     setIsVertical(prev => {
//       const card = nodeRef.current;
//       const { left, right, top, bottom } = card.getBoundingClientRect();

//       if (prev) {
//         if (top < 0 || bottom > window.innerHeight) {
//           return !prev;
//         }
//         return prev;
//       }

//       if (left < 0 || right > window.innerWidth) {
//         return !prev;
//       }
//       return prev;
//     });
//   }

//   const cardStyle = {
//     position: "fixed",
//     margin: "1rem",
//     zIndex: "10",
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