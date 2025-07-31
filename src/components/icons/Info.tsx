import React from 'react';

export const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
      d="M9 2C5.15 2 2 5.15 2 9C2 12.85 5.15 16 9 16C12.85 16 16 12.85 16 9C16 5.15 12.85 2 9 2Z"
      fill="white"
    />
    <mask
      id="infoIconMask"
      style={{ maskType: 'luminance' }}
      maskUnits="userSpaceOnUse"
      x="2"
      y="2"
      width="14"
      height="14"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 2C5.15 2 2 5.15 2 9C2 12.85 5.15 16 9 16C12.85 16 16 12.85 16 9C16 5.15 12.85 2 9 2Z"
        fill="white"
      />
    </mask>
    <g mask="url(#infoIconMask)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 7C6 5.343 7.343 4 9 4C10.657 4 12 5.343 12 7C12 8.304 11.162 9.403 10 9.816V11H8V9.5C8 8.948 8.448 8.5 9 8.5C9.829 8.5 10.5 7.829 10.5 7C10.5 6.171 9.829 5.5 9 5.5C8.171 5.5 7.5 6.171 7.5 7H6ZM9 14C8.44772 14 8 13.5523 8 13C8 12.4477 8.44772 12 9 12C9.55228 12 10 12.4477 10 13C10 13.5523 9.55228 14 9 14Z"
        fill="#1B3667"
      />
    </g>
  </svg>
);
