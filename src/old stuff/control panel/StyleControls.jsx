import { Card, Form } from "react-bootstrap";
import CollapsibleCard from "../util/CollapsibleCard";

export default function StyleControls({
  isOpen,
  toggleIsOpen
}) {
  return (
    <CollapsibleCard
      title={"Style"}
      isOpen={isOpen}
      toggleIsOpen={toggleIsOpen}
    >
      <Card.Text>
        Selected: 
      </Card.Text>

      <Form>
        <Form.Control
          type="color"
        />
      </Form>

      
    </CollapsibleCard>
  );
}