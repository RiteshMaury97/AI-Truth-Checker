import React from 'react';
import CountingNumber from './CountingNumber';

interface CircularProgressProps {
  percentage: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ percentage }) => {
  const radius = 50;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg
      height={radius * 2}
      width={radius * 2}
      className="transform -rotate-90"
    >
      <circle
        stroke="#374151" // dark:bg-gray-700
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke="#4f46e5" // indigo-600
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-out' }}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <foreignObject x="0" y="0" width="100" height="100">
        <div className="w-full h-full flex items-center justify-center">
            <CountingNumber value={percentage} duration={1000} decimals={0} className="text-xl font-bold text-gray-900 dark:text-white transform rotate-90" />
            <span className="text-xl font-bold text-gray-900 dark:text-white transform rotate-90">%</span>
        </div>
      </foreignObject>
    </svg>
  );
};

export default CircularProgress;
