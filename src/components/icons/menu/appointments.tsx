import React from 'react';

type AppoinmentsButtonProps = {
  backgroundColor?: string;
  borderColor?: string;
  alt?: string;
};

export const AppoinmentsButton: React.FC<AppoinmentsButtonProps> = ({
  backgroundColor = '#82BD89',
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
        height="17"
        viewBox="0 0 18 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask
          id="mask0_3209_165"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="18"
          height="17"
        >
          <path
            d="M13 9.1C13.3554 9.073 13.7077 9.182 13.986 9.405C14.2643 9.628 14.4479 9.947 14.5 10.3C14.5 10.4 14.4 10.8 14.4 11.1C14.6 11.1 14.6 11.6 14.6 11.7C14.6 11.8 14.4 12.2 14.2 12.1C14.1787 12.408 14.1113 12.712 14 13L14.0002 13.999C14.0031 13.9891 14.05 13.9187 14.8 14.2C15.6 14.5 16.6 14.7 16.8 15.1C17.1 15.4 17 17 17.1 17H9.1C9.0331 16.365 9.0668 15.724 9.2 15.1C9.734 14.683 10.346 14.377 11 14.2C11.3402 14.03 11.7218 13.961 12.1 14V13C11.9464 12.906 11.8197 12.773 11.7321 12.615C11.6445 12.458 11.599 12.28 11.6 12.1C11.4 12.2 11.3 11.9 11.2 11.7C11.1 11.5 11.2 11.1 11.4 11.1C11.3172 10.842 11.2833 10.571 11.3 10.3C11.4162 9.944 11.6445 9.634 11.9509 9.418C12.2572 9.202 12.6252 9.09 13 9.1ZM4.1 0C4.34256 0.037 4.56486 0.157 4.72898 0.339C4.8931 0.521 4.98889 0.755 5 1V2H10V0.9C10.0368 0.657 10.1566 0.435 10.3389 0.271C10.5213 0.107 10.7549 0.011 11 0H12.1C12.3426 0.037 12.5649 0.157 12.729 0.339C12.8931 0.521 12.9889 0.755 13 1V2H15V8H14V5H1V15H8V16H0V2H2V0.9C2.03678 0.657 2.15656 0.435 2.33892 0.271C2.52127 0.107 2.75492 0.011 3 0H4.1ZM10 12V14H8V12H10ZM7 12V14H5V12H7ZM4 12V14H2V12H4ZM7 9V11H5V9H7ZM10 9V11H8V9H10ZM4 9V11H2V9H4ZM10 6V8H8V6H10ZM13 6V8H11V6H13ZM7 6V8H5V6H7ZM12 1H11V3H12V1ZM4 1H3V3H4V1Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask0_3209_165)">
          <path d="M0 0H17.1V17H0V0Z" fill="white" />
        </g>
      </svg>
    </button>
  );
};
