import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormCheck from "react-bootstrap/FormCheck";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Tooltip from "react-bootstrap/Tooltip";
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

  function handleSwitchChange(switchName) {
    setSettings(prev => ({ ...prev, [switchName]: !prev[switchName] }));
  }

  const numInputInfo = [
    {
      name: 'pointRadius',
      label: "Point Radius", 
      tooltip: "The size of points: their actual radius is this value plus the width chosen in the Styles menu.",
      min: 1,
      max: 100,
    },
    {
      name: 'holdDuration',
      label: "Hold Duration",
      tooltip: "How long (ms) to press and hold to place the last vertex of a polygon.",
      min: 1,
      max: 5000,
    },
    {
      name: 'toastDuration',
      label: "Toast Message Duration",
      tooltip: "How long (ms) toast messages are displayed before automatically closing.",
      min: 1,
      max: 10000,
    }
  ];

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
              numInputInfo.map(({ name, label, tooltip, min, max }) => (
                <Form.Group
                  key={name}
                  controlId={name}
                  as={Row}
                  className="mb-1"
                >
                  <OverlayTrigger
                    placement="left"
                    overlay={<Tooltip>{ tooltip }</Tooltip>}
                  >
                    <Form.Label
                      column
                      className="me-auto"
                    >
                      { label }
                    </Form.Label>
                  </OverlayTrigger>
                  <Col
                    className="col-5"
                  >
                    <Form.Control
                      type="number"
                      onChange={(event) => handleNumChange(event, name)}
                      value={settings[name]}
                      min={min}
                      max={max}
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