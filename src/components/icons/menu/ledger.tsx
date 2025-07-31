import React from 'react';

type LedgerButtonProps = {
  backgroundColor?: string;
  borderColor?: string;
  alt?: string;
};

export const LedgerButton: React.FC<LedgerButtonProps> = ({
  backgroundColor = '#E7BA98',
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
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 1C2.44772 1 2 1.44772 2 2V16C2 16.5523 2.44772 17 3 17H15C15.5523 17 16 16.5523 16 16V2C16 1.44772 15.5523 1 15 1H3ZM5 3C4.44772 3 4 3.44772 4 4V5C4 5.55228 4.44772 6 5 6H13C13.5523 6 14 5.55228 14 5V4C14 3.44772 13.5523 3 13 3H5ZM4 8C4 7.44772 4.44772 7 5 7H5.5C6.05228 7 6.5 7.44772 6.5 8C6.5 8.55228 6.05228 9 5.5 9H5C4.44772 9 4 8.55228 4 8ZM8.75 7C8.19772 7 7.75 7.44772 7.75 8C7.75 8.55228 8.19772 9 8.75 9H9.25C9.80228 9 10.25 8.55228 10.25 8C10.25 7.44772 9.80228 7 9.25 7H8.75ZM11.5 8C11.5 7.44772 11.9477 7 12.5 7H13C13.5523 7 14 7.44772 14 8C14 8.55228 13.5523 9 13 9H12.5C11.9477 9 11.5 8.55228 11.5 8ZM5 10C4.44772 10 4 10.4477 4 11C4 11.5523 4.44772 12 5 12H5.5C6.05228 12 6.5 11.5523 6.5 11C6.5 10.4477 6.05228 10 5.5 10H5ZM7.75 11C7.75 10.4477 8.19772 10 8.75 10H9.25C9.80228 10 10.25 10.4477 10.25 11C10.25 11.5523 9.80228 12 9.25 12H8.75C8.19772 12 7.75 11.5523 7.75 11ZM12.5 10C11.9477 10 11.5 10.4477 11.5 11V14C11.5 14.5523 11.9477 15 12.5 15H13C13.5523 15 14 14.5523 14 14V11C14 10.4477 13.5523 10 13 10H12.5ZM4 14C4 13.4477 4.44772 13 5 13H5.5C6.05228 13 6.5 13.4477 6.5 14C6.5 14.5523 6.05228 15 5.5 15H5C4.44772 15 4 14.5523 4 14ZM8.75 13C8.19772 13 7.75 13.4477 7.75 14C7.75 14.5523 8.19772 15 8.75 15H9.25C9.80228 15 10.25 14.5523 10.25 14C10.25 13.4477 9.80228 13 9.25 13H8.75Z"
            fill="white"
          />
        </svg>
    </button>
  );
};
