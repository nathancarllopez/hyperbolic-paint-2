import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import infoIcon from "../assets/info.svg";
import gearIcon from "../assets/gear.svg";

export default function Fab({ placement, onClick, icon }) {
  const allIconInfo = {
    "Information": { src: infoIcon, alt: "Information drawer toggle" },
    "Settings": { src: gearIcon, alt: "Settings drawer toggle" }
  };
  const iconInfo = allIconInfo[icon] || {};

  return (
    <div style={{
      position: "fixed",
      margin: "1rem",
      zIndex: "10",
      ...placement
    }}>
      <Button
        variant="primary"
        className="rounded-circle"
        size="lg"
        onClick={onClick}
      >
        <Image
          src={ iconInfo.src }
          alt={ iconInfo.alt }
        />
      </Button>
    </div>
  );
}