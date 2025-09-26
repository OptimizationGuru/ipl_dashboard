import { memo } from 'react';

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  description: string;
  highlight?: string;
}

const StatCard = memo(function StatCard({ icon, value, label, description, highlight }: StatCardProps) {
  return (
    <div className="group bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-xl shadow-lg p-6 border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-slate-700 mb-1">{value}</div>
          <div className="text-sm font-semibold text-gray-700">{label}</div>
        </div>
      </div>
      <div className="text-xs text-gray-600 bg-slate-50 px-3 py-2 rounded-lg">
        <span className="font-medium">{highlight}</span> {description}
      </div>
    </div>
  );
});

export function StatsGrid() {
  const stats = [
    {
      icon: "🏆",
      value: "10",
      label: "Teams",
      description: "competing for the title",
      highlight: "Elite franchises"
    },
    {
      icon: "🏏",
      value: "74",
      label: "Matches",
      description: "in the tournament",
      highlight: "Total fixtures"
    },
    {
      icon: "📅",
      value: "2024",
      label: "Season",
      description: "of IPL action",
      highlight: "Current year"
    }
  ];

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
