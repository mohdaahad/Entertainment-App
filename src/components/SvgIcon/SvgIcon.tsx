import * as React from "react"
import type { SVGProps } from "react"

export const SvgIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fillRule="evenodd"
    clipRule="evenodd"
    {...props}
  >
    {props.children}
  </svg>
);
