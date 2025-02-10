// import { Card, Container, Form, FormCheck } from "react-bootstrap";
// import FormCheckInput from "react-bootstrap/FormCheckInput";
// import FormCheckLabel from "react-bootstrap/FormCheckLabel";

// export default function Settings({
//   toolbarState,
//   handleCheckChange
// }) {
//   const info = [
//     { name: 'showMouseCoords', label: 'Show Mouse Coordinates' },
//     { name: 'showControlPanel', label: 'Show Control Panel' },
//     { name: 'showAxisTicks', label: 'Show Axis Ticks' },
//     { name: 'fullButtonLabels', label: "Full Button Labels" }
//   ];

//   return (
//     <Card>
//       <Card.Body>
//         <Card.Title>Settings</Card.Title>
//         <Container>
//           <Form>
//             {
//               info.map(({ name, label }) => (
//                 <FormCheck
//                   key={name}
//                   id={name}
//                   type="switch"
//                 >
//                   <FormCheckLabel>
//                     { label }
//                   </FormCheckLabel>
//                   <FormCheckInput
//                     checked={ toolbarState[name] }
//                     onChange={() => handleCheckChange(name, !toolbarState[name])}
//                   />
//                 </FormCheck>
//               ))
//             }
//           </Form>
//         </Container>
//       </Card.Body>
//     </Card>
//   );
// }