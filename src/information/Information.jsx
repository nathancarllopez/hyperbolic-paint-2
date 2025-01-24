import CollapsibleCard from "./CollapsibleCard";
import Link from "./Link";
import negCurvSurface from "../assets/neg-curve-surface.gif";

import Card from "react-bootstrap/Card"
import Container from "react-bootstrap/Container"
import Figure from "react-bootstrap/Figure"
import Stack from "react-bootstrap/Stack"

export default function Information() {
  return (
    <Stack gap={3}>
      <CollapsibleCard title={"Welcome to Hyperbolic Paint"} startsOpen={true}>
        <Card.Text>
          Explore <Link hrefCode={'hypGeo'}>hyperbolic geometry</Link> in the <Link hrefCode='halfPlane'>Poincaré half-plane model!</Link> Open the toolbar with the button at the top right of the screen and start drawing, or read on to learn more about the underlying mathematics.
        </Card.Text>

        <Card.Text>
          Like standard geometry (so-called <Link hrefCode='eucGeo'>"Euclidean geometry"</Link>), the objects of study in hyperbolic geometry are shapes like points, lines, and polygons. The fundamental difference is that Euclidean geometry is done on a flat plane, while hyperbolic geometry studies shapes on a <Link hrefCode='negCurv'>negatively curved surface.</Link> 
        </Card.Text>

        <Container className="text-center">
          <Figure className="mb-0">
            <Figure.Image src={negCurvSurface} fluid/>
            <Figure.Caption>
              Source: <Link hrefCode='negCurv'>Encyclopedia of Mathematics</Link>
            </Figure.Caption>
          </Figure>
        </Container>
      </CollapsibleCard>

      <CollapsibleCard title={"Instructions"}>
        <Card.Text>
          Point:
        </Card.Text>
        <Card.Text>
          Line:
        </Card.Text>
        <Card.Text>
          Circle:
        </Card.Text>
        <Card.Text>
          Horocycle:
        </Card.Text>
        <Card.Text>
          Line Segment:
        </Card.Text>
        <Card.Text>
          Polygon:
        </Card.Text>
      </CollapsibleCard>

      <CollapsibleCard title={"Contact and Source"}>
        <Card.Text>
          I am always interested in suggestions for improvement and new features! You can see a list of planned features in the README of the <Link hrefCode={'github'}>github repository,</Link> but if you don't see your idea please let me know! You can email me at nathancarllopez@gmail.com.
        </Card.Text>
      </CollapsibleCard>

      
    </Stack>
  );
}
