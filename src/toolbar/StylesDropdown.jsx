import ButtonGroup from "react-bootstrap/ButtonGroup";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/ButtonGroup";

export default function StylesDropdown({
  drawingColor, setDrawingColor,
  drawingWidth, setDrawingWidth,
  openDropdown, setOpenDropdown
}) {
  function handleDropdownToggle() {
    console.log('toggle')
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
      // autoClose={false}
      show={openDropdown === 'Styles'}
      onToggle={handleDropdownToggle}
      onTouchStart={handleDropdownToggle}
      // className="me-2"
      // vertical
    >
      <Dropdown.Toggle>Styles</Dropdown.Toggle>

      <Dropdown.Menu
        className="p-3"
        // style={{ width: "500px" }}
        onTouchStart={event => event.stopPropagation()}
      >
        <Form>
          <Form.Group
            as={Row}
            controlId="drawing-color"
            // className="align-items-center"
          >
            <Form.Label column>Color</Form.Label>
            <Col>
              <Form.Control
                type="color"
                defaultValue={drawingColor}
                onChange={(event) => setDrawingColor(event.target.value)}
                className="mx-auto"
              />
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            controlId="drawing-stroke-width"
            className="align-items-center"
          >
            <Form.Label column>Width: (px)</Form.Label>
            <Col>
              <Form.Control
                type="number"  
                value={drawingWidth}
                onChange={(event) => setDrawingWidth(parseInt(event.target.value))}
                min={1}
                max={100}
              />
            </Col>
          </Form.Group>

        </Form>
      </Dropdown.Menu>
    </Dropdown>
  );
}