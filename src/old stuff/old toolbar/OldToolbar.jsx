import { Form } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container";
import FormCheck from 'react-bootstrap/FormCheck';
import FormCheckInput from 'react-bootstrap/FormCheckInput';
import FormCheckLabel from 'react-bootstrap/FormCheckLabel';
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import ToggleButton from "react-bootstrap/ToggleButton";
import { ANIMATION_TOOLNAMES, DRAWING_TOOLNAMES } from "../util/constants";
import DrawingTools from "./DrawingTools";
import AnimationTools from "./AnimationTools";
import Settings from "./Settings";

export default function Toolbar({
  setOpenDrawer,
  toolbarState,
  setToolbarState,
  setOpenControlPanels
}) {
  function onToolbarChange(stateKey, stateValue, closeDrawer) {
    setToolbarState(prev => ({ ...prev, [stateKey]: stateValue }));

    setOpenControlPanels(prev => {
      if (ANIMATION_TOOLNAMES.includes(stateValue)) {
        return ['animation'];
      }
      if (DRAWING_TOOLNAMES.includes(stateValue)) {
        return ['drawing'];
      }
      return prev;
    });

    setOpenDrawer(prev => {
      if (closeDrawer) return null;
      return prev;
    })
  }

  function handleRadioChange(toolName) {
    onToolbarChange('clickTool', toolName, true);
  }

  function handleCheckChange(checkName, checkParity) {
    onToolbarChange(checkName, checkParity, false);
  }

  return (
    <Stack gap={3}>

      <DrawingTools 
        toolbarState={toolbarState}
        handleRadioChange={handleRadioChange}
      />

      <AnimationTools
        toolbarState={toolbarState}
        handleRadioChange={handleRadioChange}
      />

      <Settings
        toolbarState={toolbarState}
        handleCheckChange={handleCheckChange}
      />

    </Stack>
  );
}

// export default function Toolbar({
//   toolbarState,
//   onClick
// }) {
//   const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

//   const drawingInfo = [
//     { name: 'point', icon: 'Pt', label: "Point"},
//     { name: 'geodesic', icon: 'L', label: "Line" },
//     { name: 'circle', icon: 'C', label: "Circle" },
//     { name: 'horocycle', icon: 'H', label: "Horocycle" },
//     { name: 'segment', icon: 'S', label: "Line Segment" },
//     { name: 'polygon', icon: 'Pg', label: "Polygon"},
//   ];
//   const animationInfo = [
//     { name: 'rotation', icon: 'R', label: "Rotation" },
//     { name: 'translation', icon: "T", label: "Translation" }
//   ];
//   const settingsInfo = [
//     { name: 'showMouseCoords', label: 'Show Mouse Coordinates' },
//     { name: 'showControlPanel', label: 'Show Control Panel' },
//     { name: 'showAxisTicks', label: 'Show Axis Ticks' },
//     { name: 'fullButtonLabels', label: "Full Button Labels" }
//   ];

//   const ToolbarRadioButton = ({ name, icon }) => (
//     <ToggleButton
//       id={name}
//       value={name}
//       type="radio"
//       name="clickTool"
//       onChange={() => onClick('clickTool', name)}
//       className="w-75"
//     >
//       { icon }
//     </ToggleButton>
//   );

//   return (
//     <Stack gap={3}>

//       {/* Drawing buttons */}
//       <Card>
//         <Card.Body>
//           <Card.Title>Shapes</Card.Title>
//           <Container className="text-center">
//             <Row className="gy-3">
//               {
//                 drawingInfo.map(({ name, icon, label }) => (
//                   <Col key={name} className="col-4">
//                     <ToolbarRadioButton name={name} icon={icon}/>
//                     { 
//                       toolbarState.fullButtonLabels && 
//                         <p className="mb-0">{ label }</p>
//                     }
//                   </Col>
//                 ))
//               }
//             </Row>
//           </Container>
//         </Card.Body>
//       </Card>

//       {/* Animation buttons */}
//       <Card>
//         <Card.Body>
//           <Card.Title>Animations</Card.Title>
//           <Container>
//             <Row>
//               {
//                 animationInfo.map(({ name, icon, label }) => (
//                   <Col key={name} className="col-4">
//                     <ToolbarRadioButton name={name} icon={icon}/>
//                     { 
//                       toolbarState.fullButtonLabels && 
//                         <p className="mb-0">{ label }</p>
//                     }
//                   </Col>
//                 ))
//               }
//             </Row>
//           </Container>
//         </Card.Body>
//       </Card>

//       {/* Settings */}
//       <Card>
//         <Card.Body>
//           <Card.Title>Settings</Card.Title>
//           <Container>
//             <Form>
//               {
//                 settingsInfo.map(({ name, label }) => (
//                   <FormCheck 
//                     key={name}
//                     type="switch"
//                     id={name}
//                   >
//                     <FormCheckLabel>{ label }</FormCheckLabel>
//                     <FormCheckInput
//                       checked={toolbarState[name]}
//                       onChange={() => onClick(name, !toolbarState[name], false)}
//                     />
//                   </FormCheck>
//                 ))
//               }
//             </Form>
//           </Container>
//         </Card.Body>
//       </Card>
//     </Stack>
//   );
// }