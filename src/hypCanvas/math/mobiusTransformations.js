import ComplexNumber from "./complexNumbers.js";

export default class MobiusTransformation {
  /**
   * All parameters are instances of the ComplexNumber class
   * see complexNumbers.js
   */
  constructor(a, b, c, d) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.coefficients = [a, b, c, d];
  }

  toString() {
    return this.coefficients.map(coeff => {
      return `${coeff.re} + ${coeff.im}i`;
    });
  }

  apply(z) {
    const numerator = (this.a.times(z)).plus(this.b);
    const denominator = (this.c.times(z)).plus(this.d);
    
    return numerator.dividedBy(denominator);
  }

  applyToCoords(pointCoords) {
    const z = new ComplexNumber(pointCoords.mathX, pointCoords.mathY);
    const applied = this.apply(z);

    return applied;
  }

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
    const a = new ComplexNumber(1);
    const b = new ComplexNumber(0, -1);
    const c = new ComplexNumber(1);
    const d = new ComplexNumber(0, 1);

    return new MobiusTransformation(a, b, c, d);
  }

  static unitCircleRotation(theta) {
    const a = ComplexNumber.expITheta(theta);
    const b = new ComplexNumber();
    const c = new ComplexNumber();
    const d = new ComplexNumber(1);

    return new MobiusTransformation(a, b, c, d);
  }

  static rotateAboutI(theta) {
    const cayley = MobiusTransformation.cayley();
    const cayleyInv = cayley.inverse();
    const unitCircleRotation = MobiusTransformation.unitCircleRotation(theta);

    return cayleyInv.compose(unitCircleRotation.compose(cayley));
  }

  static bringPointToI(coords) {
    const { mathX } = coords;
    const parabolic = new MobiusTransformation(
      new ComplexNumber(1),
      new ComplexNumber(-mathX, 0),
      new ComplexNumber(),
      new ComplexNumber(1)
    );

    const { im } = parabolic.applyToCoords(coords);
    const scaleDown = new MobiusTransformation(
      new ComplexNumber(1 / im),
      new ComplexNumber(),
      new ComplexNumber(),
      new ComplexNumber(1)
    );

    return scaleDown.compose(parabolic);
  }

  static rotateAboutPoint(coords, theta) {
    const bringToI = MobiusTransformation.bringPointToI(coords);
    const bringToIInverse = bringToI.inverse();
    const rotateAboutI = MobiusTransformation.rotateAboutI(theta);

    return bringToIInverse.compose(rotateAboutI.compose(bringToI));
  }

  static moveZeroTo(coords, scaleFactor) {
    const p = new ComplexNumber(coords.mathX * scaleFactor, coords.mathY * scaleFactor);
    const a = new ComplexNumber(1);
    const b = p;
    const c = p.conjugate();
    const d = new ComplexNumber(1);

    return new MobiusTransformation(a, b, c, d);
  }

  static translateBetweenPoints(coords1, coords2, scaleFactor) {
    const bring1ToI = MobiusTransformation.bringPointToI(coords1);
    const bring1ToIInv = bring1ToI.inverse();
    const cayley = MobiusTransformation.cayley();
    const cayleyInv = cayley.inverse();

    const { re, im } = cayley.compose(bring1ToI).applyToCoords(coords2);
    const moveZeroToP = MobiusTransformation.moveZeroTo({ mathX: re, mathY: im }, scaleFactor);

    return bring1ToIInv.compose(cayleyInv.compose(moveZeroToP.compose(cayley.compose(bring1ToI))));
  }
}

// function testMobius(n) {
//   const firstAngle = Math.PI / n;
//   const angles = [];
//   for (let i = 1; i <= n; i++) {
//     angles.push(firstAngle * i);
//   }
//   console.log('angles', angles);

//   const point = new ComplexNumber(10 * Math.random(), 10 * Math.random())
//   console.log(point);
//   angles.forEach(angle => {
//     const rotation = MobiusTransformation.unitCircleRotation(angle);
//     console.log(`rotation by ${angle}: ${rotation.toString()}`);
//     const rotated = rotation.apply(point);
//     console.log('rotated:', rotated);
//   });
// }