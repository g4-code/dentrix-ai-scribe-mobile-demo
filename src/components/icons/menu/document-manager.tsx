import React from 'react';

type DocumentManagerButtonProps = {
  backgroundColor?: string;
  borderColor?: string;
  alt?: string;
};

export const DocumentManagerButton: React.FC<DocumentManagerButtonProps> = ({
  backgroundColor = '#A494C4',
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
            d="M3.00026 16L3.00646 4H5.13019V3H2.50672C2.23068 3 2.00686 3.2237 2.00672 3.49974L2 16.4997C1.99986 16.776 2.22376 17 2.5 17H14.0216C14.2977 17 14.5216 16.7761 14.5216 16.5V6.80128C14.5216 6.80042 14.5216 6.79956 14.5216 6.79869V15H13.5216V16H3.00026Z"
            fill="white"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.43555 1.5C4.43555 1.22386 4.65941 1 4.93555 1H12.6512C12.798 1 12.9374 1.06455 13.0324 1.17652L15.8805 4.53345C15.9572 4.6238 15.9993 4.73844 15.9993 4.85692V14.5C15.9993 14.7761 15.7754 15 15.4993 15H4.93555C4.6594 15 4.43555 14.7761 4.43555 14.5V1.5ZM11.8326 2.06415V5.16697C11.8326 5.44311 12.0565 5.66697 12.3326 5.66697H14.9136V13.9229H5.51509L5.52073 2.06415H11.8326Z"
            fill="white"
          />
          <line x1="6.76758" y1="7.5" x2="13.8691" y2="7.5" stroke="white" />
          <line x1="6.76758" y1="9.59985" x2="13.8691" y2="9.59985" stroke="white" />
          <line x1="6.76758" y1="11.7" x2="13.8691" y2="11.7" stroke="white" />
        </svg>
    </button>
  );
};
