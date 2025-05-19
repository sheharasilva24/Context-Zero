import * as React from "react";
import type { SVGProps } from "react";
const SvgCardImageVideo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path fill="#fff" d="M0 0h24v24H0z" />
    <path stroke="#BCC1CA" d="M0 0h24v24H0z" />
    <path
      stroke="#171A1F"
      strokeMiterlimit={10}
      strokeWidth={1.368}
      d="m5.73 16.56 2.85-3.42 2.28 2.28 3.99-4.56 3.42 3.99"
    />
    <path
      stroke="#171A1F"
      strokeLinecap="square"
      strokeMiterlimit={10}
      strokeWidth={1.368}
      d="M18.27 6.87H5.73v10.26h12.54z"
    />
    <path
      stroke="#171A1F"
      strokeLinecap="square"
      strokeMiterlimit={10}
      strokeWidth={1.368}
      d="M10.29 10.85a1.14 1.14 0 1 0 0-2.28 1.14 1.14 0 0 0 0 2.28Z"
    />
  </svg>
);
export default SvgCardImageVideo;
