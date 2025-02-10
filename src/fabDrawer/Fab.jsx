import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import infoIcon from "../assets/info.svg";
import gearIcon from "../assets/gear.svg";
import toolIcon from "../assets/tools.svg";

export default function Fab({
  placement,
  onClick,
  icon,
  onTouchStart = () => {}
}) {
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const allIconInfo = {
    "Information": { src: infoIcon, alt: "Information drawer toggle" },
    "Settings": { src: gearIcon, alt: "Settings drawer toggle" },
    "Toolbar": { src: toolIcon, alt: "Toolbar expand toggle" }
  };
  const iconInfo = allIconInfo[icon] || {};

  return (
    <div style={{
      zIndex: "10",
      ...placement
    }}>
      <Button
        variant="primary"
        className="rounded-circle"
        size={isTouchDevice ? "sm" : "lg"}
        onClick={onClick}
        onTouchStart={onTouchStart}
      >
        <Image src={ iconInfo.src } alt={ iconInfo.alt }/>
      </Button>
    </div>
  );
}