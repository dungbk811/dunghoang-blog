'use client';

interface ProgressChartProps {
  total: number;
  completed: number;
  inProgress: number;
  planned: number;
}

export default function ProgressChart({ total, completed, inProgress, planned }: ProgressChartProps) {
  const completedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const inProgressPercentage = total > 0 ? Math.round((inProgress / total) * 100) : 0;
  const plannedPercentage = total > 0 ? Math.round((planned / total) * 100) : 0;

  // For the circular progress
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const completedOffset = circumference - (completedPercentage / 100) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Circular Progress */}
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-6">
          Overall Progress
        </h3>
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg className="transform -rotate-90" width="180" height="180">
              {/* Background circle */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="currentColor"
                strokeWidth="14"
                fill="none"
                className="text-gray-200 dark:text-gray-800"
              />
              {/* Progress circle */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="currentColor"
                strokeWidth="14"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={completedOffset}
                strokeLinecap="round"
                className="text-indigo-600 dark:text-indigo-500 transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                {completedPercentage}%
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {completed} of {total}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-5 border border-gray-200 dark:border-gray-800">
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {total}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Total
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-5 border border-green-200 dark:border-green-800/50">
          <div className="text-3xl font-bold text-green-700 dark:text-green-400">
            {completed}
          </div>
          <div className="text-sm text-green-700 dark:text-green-400 mt-2">
            Completed · {completedPercentage}%
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-5 border border-amber-200 dark:border-amber-800/50">
          <div className="text-3xl font-bold text-amber-700 dark:text-amber-400">
            {inProgress}
          </div>
          <div className="text-sm text-amber-700 dark:text-amber-400 mt-2">
            In Progress · {inProgressPercentage}%
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-5 border border-blue-200 dark:border-blue-800/50">
          <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">
            {planned}
          </div>
          <div className="text-sm text-blue-700 dark:text-blue-400 mt-2">
            Planned · {plannedPercentage}%
          </div>
        </div>
      </div>
    </div>
  );
}
