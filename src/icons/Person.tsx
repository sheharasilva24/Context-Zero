import * as React from "react";
import type { SVGProps } from "react";
const SvgPerson = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 15 15"
    {...props}
  >
    <path
      fill="#18181B"
      fillRule="evenodd"
      d="M7.5.875a3.625 3.625 0 0 0-1.006 7.109c-1.194.145-2.219.567-2.99 1.328-.982.967-1.48 2.408-1.48 4.288a.475.475 0 1 0 .95 0c0-1.72.454-2.88 1.197-3.612S6.027 8.875 7.5 8.875s2.585.38 3.329 1.113c.743.733 1.196 1.892 1.196 3.612a.475.475 0 0 0 .95 0c0-1.88-.497-3.32-1.48-4.288-.77-.76-1.795-1.183-2.989-1.328A3.627 3.627 0 0 0 7.5.875M4.825 4.5a2.675 2.675 0 1 1 5.35 0 2.675 2.675 0 0 1-5.35 0"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgPerson;
