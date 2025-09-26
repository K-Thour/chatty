import React from "react";

interface SpinnerProps {
  size?: number;           // width & height in px
  color?: string;          // Tailwind color class e.g., "blue-500"
  text?: string;           // Optional loading text
}

const Spinner: React.FC<SpinnerProps> = ({ size = 6, color = "blue-500", text }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className={`border-4 border-${color} border-t-transparent border-dashed rounded-full animate-spin`}
        style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
      />
      {text && <span className="text-sm text-gray-500">{text}</span>}
    </div>
  );
};

export default Spinner;
