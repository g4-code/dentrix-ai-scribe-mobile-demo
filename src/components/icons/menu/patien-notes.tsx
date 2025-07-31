import React from 'react';
import UserIcon from '../User';

type PatienNotesButtonProps = {
  backgroundColor?: string;
  borderColor?: string;
  alt?: string;
};

export const PatienNotesButton: React.FC<PatienNotesButtonProps> = ({
  backgroundColor = '#7F8081',
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
       <UserIcon />
    </button>
  );
};
