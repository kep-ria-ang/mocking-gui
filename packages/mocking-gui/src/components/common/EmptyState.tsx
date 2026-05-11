import { Code2 } from 'lucide-react';

type EmptyStateProps = {
  icon?: React.ReactNode;
  message: string;
};

const EmptyState = (props: EmptyStateProps) => {
  const { icon = <Code2 className="h-8 w-8 opacity-20" />, message } = props;
  return (
    <div className="flex flex-col items-center justify-center py-8 text-slate-500 gap-2">
      {icon}
      <span className="text-xs">{message}</span>
    </div>
  );
};

export default EmptyState;
