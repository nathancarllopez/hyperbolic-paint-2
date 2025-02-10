import { useState } from "react";
import CollapsibleCard from "../util/CollapsibleCard";
import Link from "./Link";
import SuggestionModal from "../suggestions/SuggestionModal";
import negCurvSurface from "../assets/neg-curve-surface.gif";
import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import Figure from "react-bootstrap/Figure"
import Stack from "react-bootstrap/Stack"

export default function Information() {
  const [openCard, setOpenCard] = useState("Welcome to Hyperbolic Paint")

  function toggleIsOpen(title) {
    setOpenCard(() => {
      if (openCard === title) return null;
      return title;
    });
  }

  return (
    <Stack gap={3}>
      <CollapsibleCard
        title={"Welcome to Hyperbolic Paint"}
        isOpen={openCard === "Welcome to Hyperbolic Paint"}
        toggleIsOpen={toggleIsOpen}
      >
        <Card.Text>
          Explore <Link hrefCode={'hypGeo'}>hyperbolic geometry</Link> by drawing in the <Link hrefCode='halfPlane'>Poincaré half-plane model!</Link> If you like to learn by doing, open the toolbar with the button at the top right of your screen. If you want more detailed instructions, check out the "Instructions" section below. Or, if you want to learn more about the underlying mathematics, read the "Learn" section.
        </Card.Text>

        <Card.Text>
          I would love to hear your feedback! If you check out the <Link hrefCode={'github'}>README on GitHub</Link> you'll find a list of planned improvements. If you have a new suggestion, click below.
        </Card.Text>

        <SuggestionModal/>
      </CollapsibleCard>

      <CollapsibleCard
        title={"Instructions"}
        isOpen={openCard === "Instructions"}
        toggleIsOpen={toggleIsOpen}
      >
        <Card.Text>
          In general, all shapes are draggable, and changes made to shapes can be removed/recovered using the undo/redo buttons, respectively. Shapes can also be selected and deleted using the delete button. These buttons themselves can also be moved on the screen if you'd like to reposition out of the way while drawing. Moreover, the canvas itself can be dragged horizontally by clicking anywhere that a shape isn't already drawn.
        </Card.Text>

        <Card.Text>
          Note: In the instructions below, "click" is short for "click or touch if you're on a mobile device". Moreover, clicking below the x-axis is not allowed (see the "Learn" section to understand why).
        </Card.Text>

        <Card.Text>
          <strong>Point:</strong> Click once to create a point.
        </Card.Text>

        <Card.Text>
          <strong>Line and Line Segment:</strong> Click twice to create a line.
        </Card.Text>

        <Card.Text>
          <strong>Circle:</strong> Click twice to create a circle. Your first click determines the circle's center, and the second determines the radius.
        </Card.Text>

        <Card.Text>
          <strong>Horocycle:</strong> Click once to create a horocycle. Your click will place the center of the horocycle, and the horocycle itself will be tangent to the x-axis directly below the center.
        </Card.Text>

        <Card.Text>
          <strong>Polygon</strong>: Click as many times as you like to create a polygon. The resulting vertices will be connected with line segments in the order you clicked. To place your last point and finish the polygon, click and hold.
        </Card.Text>
      </CollapsibleCard>

      <CollapsibleCard
        title={"Learn"}
        isOpen={openCard === "Learn"}
        toggleIsOpen={toggleIsOpen}
      >
      <Card.Text>
          Like standard geometry (so-called <Link hrefCode='eucGeo'>"Euclidean geometry"</Link>), the objects of study in hyperbolic geometry are shapes like points, lines, and polygons. The fundamental difference is that Euclidean geometry is done on a flat plane, while hyperbolic geometry studies shapes on a <Link hrefCode='negCurv'>negatively curved surface.</Link> As can be seen in the figure below, the shortest path between any two points is no longer a straight line!
        </Card.Text>

        <Container className="text-center">
          <Figure className="mb-0">
            <Figure.Image src={negCurvSurface} fluid/>
            <Figure.Caption>
              Source: <Link hrefCode='negCurv'>Encyclopedia of Mathematics</Link>
            </Figure.Caption>
          </Figure>
        </Container>

        <Card.Text>
          Hyperbolic geometry is incredibly rich, both mathematically and <Link hrefCode="escher">aesthetically.</Link> 
        </Card.Text>
      </CollapsibleCard>
    </Stack>
  );
}
