type Props = { data: { status: string; count: number }[] };

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-400",
  "in-progress": "bg-teal",
  completed: "bg-green-soft",
  cancelled: "bg-accent-red",
};

const statusLabels: Record<string, string> = {
  scheduled: "مجدول",
  "in-progress": "قيد التنفيذ",
  completed: "مكتمل",
  cancelled: "ملغي",
};

export default function DemographicsChart({ data }: Props) {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;

  return (
    <div className="bg-white rounded-card p-5 shadow-card border border-gray-50">
      <h3 className="font-semibold text-navy mb-4">توزيع الحالات</h3>
      <div className="flex h-6 rounded-full overflow-hidden mb-3">
        {data.map((d) => (
          <div
            key={d.status}
            className={`${statusColors[d.status] || "bg-gray-300"} transition-all`}
            style={{ width: `${(d.count / total) * 100}%` }}
          ></div>
        ))}
      </div>
      <div className="flex gap-4 flex-wrap">
        {data.map((d) => (
          <div key={d.status} className="flex items-center gap-2 text-sm">
            <span className={`w-3 h-3 rounded-full ${statusColors[d.status] || "bg-gray-300"}`}></span>
            <span className="text-gray-secondary">{statusLabels[d.status] || d.status}</span>
            <span className="font-semibold text-navy">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}