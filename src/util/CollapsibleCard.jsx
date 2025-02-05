import './CollapsibleCard.css';
import upArrow from "../assets/chevron-double-up.svg"
import downArrow from "../assets/chevron-double-down.svg"

import { useRef, useState } from "react";
import Card from "react-bootstrap/Card"
import Col from "react-bootstrap/Col"
import Collapse from "react-bootstrap/Collapse"
import Container from "react-bootstrap/Container"
import Image from "react-bootstrap/Image"
import Row from "react-bootstrap/Row"

export default function CollapsibleCard({
  title,
  isOpen,
  toggleIsOpen,
  children
}) {
  return (
    <Container className='border rounded'>
      <Row
        className='align-items-center gx-0'
        onClick={() => toggleIsOpen(title)}
        onTouchStart={() => toggleIsOpen(title)}
        style={{cursor: "pointer"}}
        aria-controls="collapse-container"
        aria-expanded={ isOpen }
      >
        <Col>
          <h5 className="mb-0">{ title }</h5>
        </Col>
        <Col className="col-auto">
          <button id='collapseToggle' className="btn">
            <Image src={ isOpen ? downArrow : upArrow } fluid/>
          </button>
        </Col>
      </Row>

      <Row>
        <Col>
          <Collapse in={isOpen}>
            {/* This extra div helps Bootstrap React make the collapse animation smooth */}
            <div id="collapse-container">
              <hr className="my-2"/>
              <Card className='border-0'>
                <Card.Body className='p-1'>
                  { children }
                </Card.Body>
              </Card>
            </div>
          </Collapse>
        </Col>
      </Row>
    </Container>
  );
}

// export default function CollapsibleCard({ title, startsOpen = false, children }) {
//   const [isIn, setIsIn] = useState(startsOpen);

//   return (
//     <Container className='border rounded'>
//       <Row className='align-items-center gx-0' onClick={() => setIsIn(!isIn)} style={{cursor: "pointer"}}>
//         <Col>
//           <h5 className="mb-0">{ title }</h5>
//         </Col>
//         <Col className="col-auto">
//           <button
//             id='collapseToggle'
//             className="btn"
//             // onClick={ () => setIsIn(!isIn) }
//             aria-controls="collapse-container"
//             aria-expanded={ isIn }
//           >
//             <Image src={ isIn ? downArrow : upArrow } fluid/>
//           </button>
//         </Col>
//       </Row>
//       {/* <Row className='align-items-center gx-0'>
//         <Col>
//           <h5 className="mb-0">{ title }</h5>
//         </Col>
//         <Col className="col-auto">
//           <button
//             id='collapseToggle'
//             className="btn"
//             onClick={ () => setIsIn(!isIn) }
//             aria-controls="collapse-container"
//             aria-expanded={ isIn }
//           >
//             <Image src={ isIn ? downArrow : upArrow } fluid/>
//           </button>
//         </Col>
//       </Row> */}

//       <Row>
//         <Col>
//           <Collapse in={isIn}>
//             {/* This extra div helps Bootstrap React make the collapse animation smooth */}
//             <div id="collapse-container">
//               <hr className="my-2"/>
//               <Card className='border-0'>
//                 <Card.Body className='p-1'>
//                   { children }
//                 </Card.Body>
//               </Card>
//             </div>
//           </Collapse>
//         </Col>
//       </Row>
//     </Container>
//   );
// }