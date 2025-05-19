import * as React from "react";
import type { SVGProps } from "react";
const SvgListOrdered = (props: SVGProps<SVGSVGElement>) => (
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
      d="M6.667 4H14M6.667 8H14m-7.333 4H14M2.667 4h.666v2.667m-.666 0H4M4 12H2.667c0-.667 1.333-1.333 1.333-2s-.667-1-1.333-.667"
    />
  </svg>
);
export default SvgListOrdered;
