interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: string;
  className?: string;
}

export default function EmptyState({ 
  title = "No data available", 
  description = "Check back later for updates",
  icon = "📭",
  className = ""
}: EmptyStateProps) {
  return (
    <div className={`bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-xl shadow-lg border border-blue-200 overflow-hidden p-8 text-center ${className}`}>
      <div className="text-5xl mb-4">{icon}</div>
      <div className="text-blue-700 text-2xl font-bold mb-2">{title}</div>
      <div className="text-blue-500 text-md">{description}</div>
      <p className="text-gray-400 text-sm mt-4">New content will appear here when it becomes available.</p>
    </div>
  );
}
