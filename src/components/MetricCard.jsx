
export default function MetricCard({ title, value, color }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border-t-4" >
      <div className="px-4 py-5 sm:p-6">
        <p className="text-sm font-medium text-gray-500 truncate">
          {title}
        </p>
        <dd className="mt-1 text-3xl font-semibold text-gray-900">
          {value}
        </dd>
      </div>
    </div>
  );
}