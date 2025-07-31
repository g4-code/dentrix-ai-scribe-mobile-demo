import React from 'react';

type TxPlannerButtonProps = {
  backgroundColor?: string;
  borderColor?: string;
  alt?: string;
};

export const TxPlannerButton: React.FC<TxPlannerButtonProps> = ({
  backgroundColor = '#DB6866',
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
        d="M1 3C1 1.89543 1.89543 1 3 1H15C16.1046 1 17 1.89543 17 3V15C17 16.1046 16.1046 17 15 17H3C1.89543 17 1 16.1046 1 15V3ZM10.9205 7L11.9881 9.12847L13.0855 7H14.9165L13.0915 10.4224L15 14H13.163L12 11.7486L10.837 14H9L10.9085 10.4224L9.0835 7H10.9205ZM7.36027 14V5.45261H10V4H7.36027H5.59848H3V5.45261H5.59848V14H7.36027Z"
        fill="white"
      />
    </svg>
    </button>
  );
};
