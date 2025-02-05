import { Card, Col, Container, Row } from "react-bootstrap";
import ClickToolRadioButton from "./ClickToolRadioButton";

export default function DrawingTools({ 
  toolbarState,
  handleRadioChange 
}) {
  const info = [
    { name: 'point', icon: 'Pt', label: "Point"},
    { name: 'geodesic', icon: 'L', label: "Line" },
    { name: 'circle', icon: 'C', label: "Circle" },
    { name: 'horocycle', icon: 'H', label: "Horocycle" },
    { name: 'segment', icon: 'S', label: "Segment" },
    { name: 'polygon', icon: 'Pg', label: "Polygon"},
  ];

  return (
    <Card>
      <Card.Body>
        <Card.Title>Drawing</Card.Title>
        <Container className="text-center">
          <Row className="gy-3">
            {
              info.map(({ name, icon, label }) => (
                <Col key={name} className="col-4">
                  <ClickToolRadioButton
                    name={name}
                    icon={ toolbarState.fullButtonLabels ? label : icon }
                    onChange={() => handleRadioChange(name)}
                    isSelected={toolbarState.clickTool === name}
                  />
                  {/* { toolbarState.fullButtonLabels && <p className="mb-0">{ label }</p> } */}
                </Col>
              ))
            }
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
}