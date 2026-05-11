import { Button } from '@components/ui/Button';

import ActiveFilter from './ActiveFilter';
import MethodSelector from './MethodSelector';

type SearchFilterBarProps = {
  methodFilter: string;
  isActiveOnly: boolean;
  onChangeMethodFilter: (value: string) => void;
  onToggleActiveOnly: () => void;
  onReset: () => void;
};

const SearchFilterBar = (props: SearchFilterBarProps) => {
  const { methodFilter, onChangeMethodFilter, isActiveOnly, onToggleActiveOnly, onReset } = props;

  return (
    <nav className="flex items-center justify-between" aria-label="API filter toolbar">
      <section className="flex items-center gap-2" aria-label="filters">
        <MethodSelector value={methodFilter} onChange={onChangeMethodFilter} />
        <ActiveFilter isActiveOnly={isActiveOnly} onToggle={onToggleActiveOnly} />
      </section>
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="h-7 px-2 text-xs text-slate-700 shadow-none hover:bg-slate-50"
      >
        Reset
      </Button>
    </nav>
  );
};

export default SearchFilterBar;
