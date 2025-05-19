import * as React from "react";
import type { SVGProps } from "react";
const SvgArrowUpDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      stroke="#09090B"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m14 10.667-2.667 2.666m0 0-2.666-2.666m2.666 2.666V2.667M2 5.333l2.667-2.666m0 0 2.666 2.666M4.667 2.667v10.666"
    />
  </svg>
);
export default SvgArrowUpDown;
