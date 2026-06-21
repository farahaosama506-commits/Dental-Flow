import React from "react";

interface CalendarHeaderProps {
  year: number;
  month: number;
  monthName: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  year,
  monthName,
  onPrev,
  onNext,
  onToday,
}) => {
  return (
    <div className="flex items-center justify-between mb-6 bg-white rounded-card p-4 shadow-card border border-gray-50">
      <div className="flex items-center gap-3">
        <button
          onClick={onPrev}
          className="w-10 h-10 rounded-xl bg-gray-card hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <i className="fas fa-chevron-right text-gray-600"></i>
        </button>
        <h2 className="text-xl font-bold text-navy min-w-[200px] text-center">
          {monthName} {year}
        </h2>
        <button
          onClick={onNext}
          className="w-10 h-10 rounded-xl bg-gray-card hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <i className="fas fa-chevron-left text-gray-600"></i>
        </button>
      </div>

      <button
        onClick={onToday}
        className="px-5 py-2.5 bg-teal hover:bg-teal-dark text-white font-semibold rounded-button text-sm transition-colors"
      >
        اليوم
      </button>
    </div>
  );
};

export default CalendarHeader;