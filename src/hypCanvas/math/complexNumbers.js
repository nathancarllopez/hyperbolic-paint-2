// import { getCanvasCoordinatesOld } from "./coordinates";

import { EPSILON } from "../../util/constants";

export default class ComplexNumber{
  constructor(re = 0, im = 0) {
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

  plus(that) {
    return new ComplexNumber(this.re + that.re, this.im + that.im);
  }

  times(that) {
    const prodRe = this.re * that.re - this.im * that.im;
    const prodIm = this.re * that.im + this.im * that.re;

    return new ComplexNumber(prodRe, prodIm);
  }

  dividedBy(that) {
    return this.times(that.inverse());
  }

  scale(lambda) {
    return new ComplexNumber(lambda * this.re, lambda * this.im);
  }

  isEqualTo(that) {
    const reAreClose = Math.abs(this.re - that.re) < EPSILON;
    const imAreClose = Math.abs(this.im - that.im) < EPSILON;
    return reAreClose && imAreClose;
  }

  static expITheta(theta) {
    return new ComplexNumber(Math.cos(theta), Math.sin(theta));
  }
}