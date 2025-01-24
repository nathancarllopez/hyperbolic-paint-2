export default function Link({
  hrefCode,
  openInNewTab = true,
  children
}) {
  const hrefMap = {
    hypGeo: "https://en.wikipedia.org/wiki/Hyperbolic_geometry",
    halfPlane: "https://en.wikipedia.org/wiki/Poincar%C3%A9_half-plane_model",
    eucGeo: "https://en.wikipedia.org/wiki/Euclidean_geometry",
    negCurv: "https://encyclopediaofmath.org/wiki/Negative_curvature,_surface_of",
    geod: "https://en.wikipedia.org/wiki/Geodesic",
    github: "https://github.com/nathancarllopez/hyperbolic-paint-2",
    escher: "https://en.wikipedia.org/wiki/Circle_Limit_III"
  }

  return (
    <a
      className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
      href={ hrefMap[hrefCode] }
      target={ openInNewTab ? "_blank" : undefined }
      rel={ openInNewTab ? "noopener noreferrer" : undefined }
    >
      { children }
    </a>
  );
}