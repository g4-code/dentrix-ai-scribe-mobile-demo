import React from 'react';

export const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="14" height="14" fill="white" fillOpacity="0.01" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 1L10 2L12 4L13 3V2L12 1H11ZM3 9L5 11L11 5L9 3L3 9ZM1 13L4 12L2 10L1 13Z"
      fill="#939699"
    />
  </svg>
);
