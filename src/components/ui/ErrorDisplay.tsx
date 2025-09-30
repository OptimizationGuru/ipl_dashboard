interface ErrorDisplayProps {
  error: string;
  title?: string;
  icon?: string;
  className?: string;
}

export default function ErrorDisplay({ 
  error, 
  title = "Error loading data", 
  icon = "⚠️",
  className = ""
}: ErrorDisplayProps) {
  return (
    <div className={`bg-gradient-to-br from-red-50 via-white to-red-50 rounded-xl shadow-lg border border-red-200 overflow-hidden p-8 text-center ${className}`}>
      <div className="text-5xl mb-4">{icon}</div>
      <div className="text-red-700 text-2xl font-bold mb-2">{title}</div>
      <div className="text-red-500 text-md">{error}</div>
      <p className="text-gray-400 text-sm mt-4">Please try again later or contact support.</p>
    </div>
  );
}
