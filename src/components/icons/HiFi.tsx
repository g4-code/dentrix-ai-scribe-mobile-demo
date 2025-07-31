import React from 'react';

export const HelpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="18" height="18" fill="white" fillOpacity="0.01" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13 6C12.5 6 12 5.583 12 5C12 4.417 12.417 4 13 4C13.5 4 14 4.417 14 5C14 5.583 13.5 6 13 6ZM12 12H14V7H12V12ZM10 12H8V9H6V12H4V4H6V7H8V4H10V12ZM9 1C4.582 1 1 4.132 1 7.996C1 10.908 3.036 13.403 5.931 14.456C5.711 15.282 5 16 5 16L6 17C6 17 8.71 16.32 9.667 14.962C13.772 14.665 17 11.663 17 7.996C17 4.132 13.418 1 9 1Z"
      fill="white"
    />
  </svg>
);
