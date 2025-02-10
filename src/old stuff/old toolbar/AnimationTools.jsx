// import { Card, Col, Container, Row } from "react-bootstrap";
// import ClickToolRadioButton from "./ClickToolRadioButton";

// export default function AnimationTools({ 
//   toolbarState,
//   handleRadioChange 
// }) {
//   const info = [
//     { name: 'rotation', icon: 'R', label: "Rotation" },
//     { name: 'translation', icon: "T", label: "Translation" }
//   ];

//   return (
//     <Card>
//       <Card.Body>
//         <Card.Title>Drawing</Card.Title>
//         <Container className="text-center" fluid>
//           <Row className="gy-3">
//             {
//               info.map(({ name, icon, label }) => (
//                 <Col key={name} className="col-4">
//                   <ClickToolRadioButton
//                     name={name}
//                     icon={ toolbarState.fullButtonLabels ? label : icon }
//                     onChange={() => handleRadioChange(name)}
//                     isSelected={toolbarState.clickTool === name}
//                   />
//                 </Col>
//               ))
//             }
//           </Row>
//         </Container>
//       </Card.Body>
//     </Card>
//   );
// }