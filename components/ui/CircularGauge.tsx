import React from "react";

interface CircularGaugeProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

const CircularGauge: React.FC<CircularGaugeProps> = ({
  percentage,
  size = 130,
  strokeWidth = 10,
  label = "Excellent",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#00A8B5"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-navy">{percentage}%</span>
        <span className="text-xs font-semibold text-teal mt-0.5">
          {label}
        </span>
      </div>
    </div>
  );
};

export default CircularGauge;