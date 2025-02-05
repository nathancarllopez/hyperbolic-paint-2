import { Card, Form, FormCheck, Stack } from "react-bootstrap";
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
    </Stack>
  );
}