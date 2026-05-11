import { Switch } from '@components/ui/Switch';

type ActiveFilterProps = {
  isActiveOnly: boolean;
  onToggle: () => void;
};

const ActiveFilter = (props: ActiveFilterProps) => {
  const { isActiveOnly, onToggle } = props;

  return (
    <div
      className="flex items-center gap-2 px-3 h-8 border rounded-lg bg-white cursor-pointer border-slate-200 hover:bg-slate-50"
      onClick={onToggle}
    >
      <span className="text-xs font-medium text-slate-700 whitespace-nowrap select-none">
        Active Only
      </span>
      <Switch
        checked={isActiveOnly}
        className="scale-75 origin-right data-[state=checked]:bg-[#3B82F6]"
      />
    </div>
  );
};

export default ActiveFilter;
