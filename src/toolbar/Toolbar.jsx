import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container";
import FormCheck from 'react-bootstrap/FormCheck';
import FormCheckInput from 'react-bootstrap/FormCheckInput';
import FormCheckLabel from 'react-bootstrap/FormCheckLabel';
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import ToggleButton from "react-bootstrap/ToggleButton";

// import TooltipWrapper from "./TooltipWrapper";

export default function Toolbar({ toolbarState, onClick }) {
  const shapesButtons = [
    { name: 'point', label: 'P'},
    { name: 'line', label: 'L' },
    // { name: 'circle', label: 'C' },
    // { name: 'horocycle', label: 'H' }
  ];

  return (
    <Stack gap={3}>
      <Card>
        <Card.Body>
          <Card.Title>Shapes</Card.Title>
          <Container>
            <Row>
              {shapesButtons.map(({ name, label }) => (
                <Col key={name}>
                  <ToggleButton
                    id={name}
                    value={name}
                    type="radio"
                    name="clickTool"
                    onChange={() => onClick('clickTool', name)}
                  >
                    {label}
                  </ToggleButton>
                </Col>
              ))}
            </Row>
          </Container>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Settings</Card.Title>
          <Container>
            <FormCheck
              type="switch"
              id="showCursorCoordSwitch"
            >
              <FormCheckLabel>Show Cursor Coordinates</FormCheckLabel>
              <FormCheckInput
                checked={toolbarState.showCursorCoord}
                onChange={() => onClick('showCursorCoord', !toolbarState.showCursorCoord, false)}
              />
            </FormCheck>
          </Container>
        </Card.Body>
      </Card>
    </Stack>
  );
}

