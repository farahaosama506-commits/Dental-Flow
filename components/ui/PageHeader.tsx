import React from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon: string;
  action?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  action,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-teal-light rounded-xl flex items-center justify-center">
          <i className={`fas ${icon} text-teal text-xl`}></i>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-navy">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-secondary mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default PageHeader;