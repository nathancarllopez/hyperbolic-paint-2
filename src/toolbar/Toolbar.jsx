import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container";
import FormCheck from 'react-bootstrap/FormCheck';
import FormCheckInput from 'react-bootstrap/FormCheckInput';
import FormCheckLabel from 'react-bootstrap/FormCheckLabel';
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import ToggleButton from "react-bootstrap/ToggleButton";

export default function Toolbar({
  toolbarState,
  onClick
}) {
  const drawingButtons = [
    { name: 'point', label: 'Pt'},
    { name: 'geodesic', label: 'L' },
    { name: 'circle', label: 'C' },
    { name: 'horocycle', label: 'H' },
    { name: 'segment', label: 'S' },
    { name: 'polygon', label: 'Pg'},
  ];

  // const animationButtons = [
  //   { name: 'rotation', label: 'R' }
  // ];

  const settings = [
    { name: 'showMouseCoords', label: 'Show Mouse Coordinates' },
    { name: 'showHistoryControls', label: 'Show History Controls' },
    { name: 'showAxisTicks', label: 'Show Axis Ticks' }
  ];

  return (
    <Stack gap={3}>

      {/* Drawing buttons */}
      <Card>
        <Card.Body>
          <Card.Title>Shapes</Card.Title>
          <Container>
            <Row>
              {
                drawingButtons.map(({ name, label }) => (
                  <Col key={name} bsPrefix="col-4">
                    <ToggleButton
                      id={name}
                      value={name}
                      type="radio"
                      name="clickTool"
                      onChange={() => onClick('clickTool', name)}
                    >
                      { label }
                    </ToggleButton>
                  </Col>
                ))
              }
            </Row>
          </Container>
        </Card.Body>
      </Card>
      
      {/* Animation buttons */}
      {/* <Card>
        <Card.Body>
          <Card.Title>Animations</Card.Title>
          <Container>
            <Row>
              {
                animationButtons.map(({ name, label }) => (
                  <Col key={name}>
                    <ToggleButton
                      id={name}
                      value={name}
                      type="radio"
                      name="clickTool"
                      onChange={() => onClick('clickTool', name)}
                    >
                      { label }
                    </ToggleButton>
                  </Col>
                ))
              }
            </Row>
          </Container>
        </Card.Body>
      </Card> */}

      {/* Settings */}
      <Card>
        <Card.Body>
          <Card.Title>Settings</Card.Title>
          <Container>
            {
              settings.map(({ name, label }) => (
                <FormCheck 
                  key={name}
                  type="switch"
                  id={name}
                >
                  <FormCheckLabel>{ label }</FormCheckLabel>
                  <FormCheckInput
                    checked={toolbarState[name]}
                    onChange={() => onClick(name, !toolbarState[name], false)}
                  />
                </FormCheck>
              ))
            }
          </Container>
        </Card.Body>
      </Card>
    </Stack>
  );
}

