import ButtonGroup from "react-bootstrap/ButtonGroup";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";

export default function StylesDropdown({
  drawingColor, setDrawingColor,
  drawingWidth, setDrawingWidth,
  openDropdown, setOpenDropdown,
  toolbarIsVertical
}) {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  function handleDropdownToggle() {
    setOpenDropdown(prev => {
      if (prev === 'Styles') {
        return null;
      }
      return 'Styles';
    })
  }

  return (
    <Dropdown
      as={ButtonGroup}
      autoClose={"outside"}
      show={openDropdown === 'Styles'}
      onToggle={handleDropdownToggle}
      onTouchStart={handleDropdownToggle}
      drop={toolbarIsVertical ? "start" : "down"}
    >
      <Dropdown.Toggle size={isTouchDevice ? "sm" : "lg"}>
        Styles
      </Dropdown.Toggle>

      <Dropdown.Menu className="p-3" onTouchStart={event => event.stopPropagation()}>
        <Container className="p-0" style={{ width: "200px" }}>
          <Row bsPrefix="row mb-2 align-items-center">
            <Col>Color</Col>
            <Col>
              <Form.Control
                type="color"
                value={drawingColor}
                onChange={(event) => setDrawingColor(event.target.value)}
                className="mx-auto"
              />
            </Col>
          </Row>

          <Row bsPrefix="row align-items-center">
            <Col>Width</Col>
            <Col>
              <Form.Control
                type="number"  
                value={drawingWidth}
                onChange={(event) => setDrawingWidth(parseInt(event.target.value))}
                min={1}
                max={100}
              />
            </Col>
          </Row>
        </Container>
      </Dropdown.Menu>
    </Dropdown>
  );
}