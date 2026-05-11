import { ItemContent } from '@components/ui/Item';
import { useHandlerStore } from '@store/useHandlerStore';

import SearchFilterBar from './SearchFilterBar';
import SearchInput from './SearchInput';

type APISearchProps = {
  defaultSearchValue?: string;
  onChangeSearchValue: (value: string) => void;
  methodFilter: string;
  onChangeMethodFilter: (value: string) => void;
  isActiveOnly: boolean;
  onToggleActiveOnly: () => void;
};

const APISearch = (props: APISearchProps) => {
  const {
    defaultSearchValue = '',
    onChangeSearchValue,
    methodFilter,
    onChangeMethodFilter,
    isActiveOnly,
    onToggleActiveOnly,
  } = props;

  const resetAllHandlerConfigs = useHandlerStore(state => state.resetAllHandlerConfigs);

  const handleResetFilter = () => {
    onChangeSearchValue('');
    onChangeMethodFilter('ALL');
    if (isActiveOnly) {
      onToggleActiveOnly();
    }
    resetAllHandlerConfigs();
  };

  return (
    <section className="sticky top-0 z-50 bg-panel py-1" aria-label="API search filters">
      <ItemContent className="flex-col gap-3">
        <SearchInput value={defaultSearchValue} onChange={onChangeSearchValue} />
        <SearchFilterBar
          methodFilter={methodFilter}
          isActiveOnly={isActiveOnly}
          onChangeMethodFilter={onChangeMethodFilter}
          onToggleActiveOnly={onToggleActiveOnly}
          onReset={handleResetFilter}
        />
      </ItemContent>
    </section>
  );
};

export default APISearch;
