import { ToggleButton } from "react-bootstrap";

export default function ClickToolRadioButton({ 
  name, 
  icon,
  onChange,
  isSelected
}) {
  return (
    <ToggleButton
      id={name}
      value={name}
      type="radio"
      name="clickTool"
      onChange={onChange}
      className={`w-auto`}
      variant={ isSelected ? "primary" : "secondary" }
    >
      { icon }
    </ToggleButton>
  );
}