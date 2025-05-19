import * as React from "react";
import type { SVGProps } from "react";
const SvgImageCard = (props: SVGProps<SVGSVGElement>) => (
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
      fill="#171A1F"
      d="M18.27 5.73H5.73a.57.57 0 0 0-.57.57v9.12c0 .315.255.57.57.57h12.54a.57.57 0 0 0 .57-.57V6.3a.57.57 0 0 0-.57-.57m-7.98 7.98v-5.7l4.56 2.85zM15.42 17.14H8.58v1.14h6.84z"
    />
  </svg>
);
export default SvgImageCard;
