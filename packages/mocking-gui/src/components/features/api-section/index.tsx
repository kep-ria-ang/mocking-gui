import { usePanelStore } from '@store/usePanelStore';

import APIList from './api-list';
import APISearch from './api-search';

const ApiSection = () => {
  const search = usePanelStore(state => state.apiSearchKeyword);
  const setSearch = usePanelStore(state => state.setApiSearchQuery);
  const isActiveOnly = usePanelStore(state => state.isActiveOnly);
  const toggleActiveOnly = usePanelStore(state => state.toggleActiveOnly);
  const methodFilter = usePanelStore(state => state.apiMethodFilter);
  const setMethodFilter = usePanelStore(state => state.setApiMethodFilter);

  const onChangeSearchValue = (value: string) => {
    const normalizedSearch = value?.toLowerCase() ?? '';
    return setSearch(normalizedSearch);
  };

  return (
    <div className="flex flex-col gap-3">
      <APISearch
        defaultSearchValue={search}
        onChangeSearchValue={onChangeSearchValue}
        methodFilter={methodFilter}
        onChangeMethodFilter={setMethodFilter}
        isActiveOnly={isActiveOnly}
        onToggleActiveOnly={toggleActiveOnly}
      />
      <APIList search={search} isActiveOnly={isActiveOnly} methodFilter={methodFilter} />
    </div>
  );
};

export default ApiSection;
