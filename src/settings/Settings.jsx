import { Card, Col, Form, FormCheck, Row, Stack } from "react-bootstrap";
import FormCheckInput from "react-bootstrap/esm/FormCheckInput";
import FormCheckLabel from "react-bootstrap/esm/FormCheckLabel";

export default function Settings({
  settings,
  setSettings,
}) {
  const switchInfo = [
    { name: 'showMouseCoords', label: 'Show Mouse Coordinates' },
    { name: 'showAxisTicks', label: 'Show Axis Ticks' },
    { name: 'showToolbarInstructions', label: "Show Toolbar Instructions" }
  ];

  const numInputInfo = [
    { name: 'pointRadius', label: "Point Radius" },
    // { name: 'pointHitRadius', label: "Point Hit Radius" }
  ];

  function handleSwitchChange(switchName) {
    setSettings(prev => ({ ...prev, [switchName]: !prev[switchName] }));
  }

  function handleNumChange(event, numInputName) {
    setSettings(prev => {
      const newNum = parseInt(event.target.value);
      if (isNaN(newNum)) {
        return prev;
      }
      return { ...prev, [numInputName]: newNum };
    });
  }
  
  return (
    <Stack gap={3}>
      <Card>
        <Card.Body>
          <Form>
            {
              switchInfo.map(({ name, label }) => (
                <FormCheck
                  key={name}
                  id={`${name}Switch`}
                  type="switch"
                >
                  <FormCheckLabel>{ label }</FormCheckLabel>
                  <FormCheckInput
                    checked={settings[name]}
                    onChange={() => handleSwitchChange(name)}
                  />
                </FormCheck>
              ))
            }
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Form>
            {
              numInputInfo.map(({ name, label }) => (
                <Form.Group
                  key={name}
                  controlId={name}
                  as={Row}
                >
                  <Form.Label column>{ label }</Form.Label>
                  <Col>
                    <Form.Control
                      type="number"
                      onChange={event => handleNumChange(event, name)}
                      value={settings[name]}
                      min={1}
                      max={100}
                    />
                  </Col>
                </Form.Group>
              ))
            }
          </Form>
        </Card.Body>
      </Card>
    </Stack>
  );
}