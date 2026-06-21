type Props = { data: { name: string; count: number; revenue: number }[] };

export default function TopTreatments({ data }: Props) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-white rounded-card p-5 shadow-card border border-gray-50">
      <h3 className="font-semibold text-navy mb-4">العلاجات الأكثر شيوعاً</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-teal text-white text-xs flex items-center justify-center">
                  {index + 1}
                </span>
                {item.name}
              </span>
              <span className="font-semibold text-navy">
                {item.count} (${item.revenue})
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-teal rounded-full h-1.5"
                style={{ width: `${(item.count / maxCount) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}