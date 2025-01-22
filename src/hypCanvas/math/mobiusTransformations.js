import ComplexNumber from "./complexNumbers";
// import { getCanvasCoordinatesOld } from "./coordinates";

// function goUp(recipe) {
//   const { mathX, mathY } = recipe.params;
//   return {
//     ...recipe,
//     params: getCanvasCoordinatesOld(mathX + 100, mathY)
//   }
// }

export function getMobiusAnimation(animationShape) {
  return animationShape;
  
  // switch(animationShape.name) {
  //   case 'rotation': {
  //     return recipe => {
  //       const theta = Math.PI / 2000000000;
  //       const rotatingMobius = MobiusTransformation.rotateAbout300(theta);
        
  //       return {
  //         ...recipe,
  //         params: rotatingMobius.applyToPoint(recipe.params),
  //       }
  //     }
  //   }

  //   default: {
  //     throw new Error(`Unexpected animation shape: ${animationShape.name}`);
  //   }
  // }
}

class MobiusTransformation {
  /**
   * All parameters are instances of the ComplexNumber class
   * see complexNumbers.js
   */
  constructor(a, b, c, d) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
  }

  apply(z) {
    const numerator = (this.a.times(z)).plus(this.b);
    const denominator = (this.c.times(z)).plus(this.d);
    
    return numerator.dividedBy(denominator);
  }

  applyToPoint(pointCoords) {
    const z = new ComplexNumber(pointCoords.mathX, pointCoords.mathY);
    const applied = this.apply(z);

    return applied;
  }

  // applyToPoint(pointCoords) {
  //   const z = ComplexNumber.pointToComplex(pointCoords);
  //   const applied = this.apply(z);
    
  //   return ComplexNumber.complexToPoint(applied);
  // }

  compose(that) {
    const newA = (this.a.times(that.a)).plus(this.b.times(that.c));
    const newB = (this.a.times(that.b)).plus(this.b.times(that.d));
    const newC = (this.c.times(that.a)).plus(this.d.times(that.c));
    const newD = (this.c.times(that.b)).plus(this.d.times(that.d));

    return new MobiusTransformation(newA, newB, newC, newD);
  }

  inverse() {
    const newA = this.d;
    const newB = this.b.scale(-1);
    const newC = this.c.scale(-1);
    const newD = this.a;

    return new MobiusTransformation(newA, newB, newC, newD);
  }
  
  static cayley() {
    const a = new ComplexNumber(1, 0);
    const b = new ComplexNumber(0, -1);
    const c = new ComplexNumber(1, 0);
    const d = new ComplexNumber(0, 1);

    return new MobiusTransformation(a, b, c, d);
  }

  static unitCircleRotation(theta) {
    const a = ComplexNumber.expITheta(theta);
    const b = new ComplexNumber(0, 0);
    const c = new ComplexNumber(0, 0);
    const d = new ComplexNumber(0, 1);

    return new MobiusTransformation(a, b, c, d);
  }

  static rotateAboutI(theta) {
    const cayley = MobiusTransformation.cayley();
    const cayleyInv = cayley.inverse();
    const unitCircleRotation = MobiusTransformation.unitCircleRotation(theta);

    return cayleyInv.compose(unitCircleRotation.compose(cayley));
  }

  static rotateAbout300(theta) {
    const scaleDown = new MobiusTransformation(
      new ComplexNumber(1/300, 0),
      new ComplexNumber(0, 0),
      new ComplexNumber(0, 0),
      new ComplexNumber(1, 0)
    );
    const scaleUp = new MobiusTransformation(
      new ComplexNumber(300, 0),
      new ComplexNumber(0, 0),
      new ComplexNumber(0, 0),
      new ComplexNumber(1, 0)
    );
    const rotateAboutI = MobiusTransformation.rotateAboutI(theta);

    return scaleUp.compose(rotateAboutI.compose(scaleDown));
  }
}