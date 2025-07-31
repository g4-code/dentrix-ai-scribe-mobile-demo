import React from 'react';

export const LocationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M9 4C7.896 4 7 4.896 7 6C7 7.104 7.896 8 9 8C10.104 8 11 7.104 11 6C11 4.896 10.104 4 9 4ZM13 6C13 8.209 9 16 9 16C9 16 5 8.209 5 6C5 3.791 6.791 2 9 2C11.209 2 13 3.791 13 6Z"
      fill="white"
    />
  </svg>
);
