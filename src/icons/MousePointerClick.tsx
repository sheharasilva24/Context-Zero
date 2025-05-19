import * as React from "react";
import type { SVGProps } from "react";
const SvgMousePointerClick = (props: SVGProps<SVGSVGElement>) => (
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
      d="m10.714 10.714 2.829 2.829M4.792 1.493l.518 1.931M3.424 5.31l-1.932-.518M9.3 2.7 7.885 4.115m-3.771 3.77L2.7 9.3M6 6l3.333 8 1.183-3.484L14 9.333z"
    />
  </svg>
);
export default SvgMousePointerClick;
