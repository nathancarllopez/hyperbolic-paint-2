import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function TooltipWrapper({ text, children }) {
  const renderTooltip = (props) => {
    <Tooltip {...props}>
      {text}
    </Tooltip>
  }

  return (
    <OverlayTrigger
      placement='bottom'
      overlay={renderTooltip}
    >
      {children}
    </OverlayTrigger>
  )
}