interface EmptyStateProps {
  title: string;
  description?: string;
}

const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-gray-500">
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="text-xs text-gray-400">{description}</p>}
    </div>
  );
};

export default EmptyState;
