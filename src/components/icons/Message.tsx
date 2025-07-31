import React from 'react';

export const MessageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="24" height="24" fill="white" fillOpacity="0.01" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 14H14V13H7V14ZM7 12H17V11H7V12ZM7 10H17V9H7V10ZM19 16C19 16.6 18.5 17 18 17H10.8C8.2 18.3 9 17.9 6.7 19C7.1 17.7 7 18.2 7.4 17H6C5.5 17 5 16.6 5 16V8C5 7.5 5.5 7 6 7H18C18.5 7 19 7.5 19 8V16ZM18 6H6C4.9 6 4 6.9 4 8V16C4 17.1 4.9 18 6 18L5 21L11 18H18C19.1 18 20 17.1 20 16V8C20 6.9 19.1 6 18 6Z"
      fill="#487A97"
    />
  </svg>
);
