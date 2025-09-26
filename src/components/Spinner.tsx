import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <svg
        className="h-10 w-10 text-accent"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        style={{
          animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(0.9);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Spinner;
