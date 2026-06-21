export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-100 rounded-card"></div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="h-64 bg-gray-100 rounded-card"></div>
        <div className="h-64 bg-gray-100 rounded-card"></div>
        <div className="h-64 bg-gray-100 rounded-card"></div>
        <div className="h-64 bg-gray-100 rounded-card"></div>
      </div>
    </div>
  );
}