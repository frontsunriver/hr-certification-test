const InputLabel = ({ className, children, ...props }) => {
  return (
    <label className={`block text-sm text-gray-300 mb-1 text-left ${className}`} {...props}>
      {children}
    </label>
  );
};

const statusColors = {
  draft: 'bg-gray-500 text-white',
  submitted: 'bg-blue-500 text-white',
  approved: 'bg-green-500 text-white',
  rejected: 'bg-red-500 text-white',
};

const StatusBadge = ({ status }) => {
  const normalizedStatus = status?.toLowerCase?.();

  return (
    <span
      className={`px-2 py-1 cursor-pointer text-xs rounded-full font-semibold capitalize ${statusColors[normalizedStatus] || 'bg-gray-300 text-black'}`}
    >
      {normalizedStatus}
    </span>
  );
};
export { InputLabel, StatusBadge };
