// import { getCanvasCoordinatesOld } from "./coordinates";

export default class ComplexNumber{
  constructor(re, im) {
    this.re = re;
    this.im = im;
    this.length = Math.sqrt(re ** 2 + im ** 2);
  }

  conjugate() {
    return new ComplexNumber(this.re, -this.im);
  }

  inverse() {
    const conjugate = this.conjugate();
    const lengthSquared = this.length ** 2;

    return new ComplexNumber(conjugate.re / lengthSquared, conjugate.im / lengthSquared);
  }

  plus(other) {
    return new ComplexNumber(this.re + other.re, this.im + other.im);
  }

  times(other) {
    const prodRe = this.re * other.re - this.im * other.im;
    const prodIm = this.re * other.im + this.im * other.re;

    return new ComplexNumber(prodRe, prodIm);
  }

  dividedBy(other) {
    return this.times(other.inverse());
  }

  scale(lambda) {
    return new ComplexNumber(lambda * this.re, lambda * this.im);
  }

  static expITheta(theta) {
    return new ComplexNumber(Math.cos(theta), Math.sin(theta));
  }

  // static pointToComplex(pointCoords) {
  //   return new ComplexNumber(pointCoords.mathX, pointCoords.mathY);
  // }

  // static complexToPoint(complexNum) {
  //   return getCanvasCoordinatesOld(complexNum.re, complexNum.im);
  // }
}