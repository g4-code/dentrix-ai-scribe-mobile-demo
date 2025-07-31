import React from 'react';

type ToothButtonProps = {
  backgroundColor?: string;
  borderColor?: string;
  alt?: string;
};

export const ToothButton: React.FC<ToothButtonProps> = ({
  backgroundColor = '#87CEEB',
  borderColor = '#1B4F72',
  alt = 'Chart',
}) => {
  return (
    <button
      className="w-9 h-9 flex items-center justify-center transition-colors duration-300 border-2 cursor-pointer"
      style={{
        backgroundColor,
        borderColor: '#f0f3fa',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = borderColor;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#f0f3fa';
      }}
      aria-label={alt}
    >
       <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
        <mask
            id="mask0"
            style={{ maskType: 'luminance' }}
            maskUnits="userSpaceOnUse"
            x="2"
            y="0"
            width="14"
            height="18"
            >
            <path
                d="M7.2 0.505155C7.738 0.848054 8.362 1.03 9 1.03C9.638 1.03 10.262 0.848054 10.8 0.505155C11.31 0.186249 11.898 0.0143001 12.5 0.00530272C13.211 -0.012692 13.909 0.201245 14.487 0.617122C15.065 1.032 15.491 1.62483 15.7 2.30463C16.1 3.29933 16.1 4.40901 15.7 5.40371C15.18 7.05323 14.91 8.77272 14.9 10.5022C15.1 15.6007 14.3 18 12.6 18C11.5 18 11.3 16.4005 11 14.501C10.7 12.6016 10.4 10.0024 9.1 10.0024C8.10333 10.0024 7.69444 11.4714 7.4227 13.0579L7.35463 13.4736C7.3 13.8207 7.25 14.1678 7.2 14.501C6.9 16.5004 6.7 18 5.6 18C3.9 18 3.1 15.6007 3.1 10.5022C3.14 8.76872 2.869 7.04223 2.3 5.40371C1.9 4.40901 1.9 3.29933 2.3 2.30463C2.514 1.62782 2.941 1.037 3.518 0.623121C4.094 0.208243 4.79 -0.00769345 5.5 0.00530272C6.108 -0.0336858 6.71 0.143262 7.2 0.505155Z"
                fill="white"
            />
            </mask>
            <g mask="url(#mask0)">
             <path d="M2 0H16V18H2V0Z" fill="white" />
            </g>
    </svg>
    </button>
  );
};
