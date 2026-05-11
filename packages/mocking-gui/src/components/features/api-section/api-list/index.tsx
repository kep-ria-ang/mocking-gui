import { memo, useDeferredValue, useEffect, useMemo, useState } from 'react';

import { Label } from '@components/ui/Label';
import { useHandlerStore } from '@store/useHandlerStore';
import { getHandlerKey } from '@utils/common/keys';
import { extractBaseUrl } from '@utils/common/url';

import APIGroup from '../api-group';

import type { HandlerState } from '@mocking-gui-types/handler';

type APIListProps = {
  search?: string;
  isActiveOnly?: boolean;
  methodFilter?: string;
};

const INITIAL_DISPLAY_LIMIT = 25;

/**
 * To instantiate based on baseUrl
 */
export type RefinedHandlersType = Record<string, HandlerState[]>;

const APIList = memo(({ search = '', isActiveOnly, methodFilter }: APIListProps) => {
  const handlers = useHandlerStore(state => state.handlers);
  const handlerConfigs = useHandlerStore(state => state.handlerConfigs);

  const deferredSearch = useDeferredValue(search);
  const [displayLimit, setDisplayLimit] = useState(INITIAL_DISPLAY_LIMIT);

  /** Filter and group handlers by search term */
  const refinedHandlers = useMemo(() => {
    const grouped: RefinedHandlersType = {};

    handlers.forEach(handler => {
      const { name, method, url } = handler;

      // Filter by method
      if (
        methodFilter &&
        methodFilter !== 'ALL' &&
        method.toLowerCase() !== methodFilter.toLowerCase()
      ) {
        return;
      }

      // Filter by active status
      if (isActiveOnly) {
        const handlerKey = getHandlerKey(handler);
        const config = handlerConfigs?.[handlerKey];
        if (!config?.active) return;
      }

      // Filter by search term
      if (deferredSearch) {
        const lowered = deferredSearch.toLowerCase();
        const matches =
          name.trim().toLowerCase().includes(lowered) ||
          method.trim().toLowerCase().includes(lowered) ||
          url.trim().toLowerCase().includes(lowered);
        if (!matches) return;
      }

      // Grouping
      const { origin } = extractBaseUrl(url);
      if (!grouped[origin]) {
        grouped[origin] = [];
      }
      grouped[origin].push({ ...handler });
    });

    return grouped;
  }, [handlers, deferredSearch, isActiveOnly, handlerConfigs, methodFilter]);

  const deferredRefinedHandlers = useDeferredValue(refinedHandlers);

  // Progressive rendering: increase limit after mount to load full list
  useEffect(() => {
    const totalCount = Object.values(deferredRefinedHandlers).reduce(
      (acc, list) => acc + list.length,
      0,
    );

    if (displayLimit < totalCount) {
      const timeout = setTimeout(() => {
        setDisplayLimit(prev => prev + 50);
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [displayLimit, deferredRefinedHandlers]);

  // Reset limit on search or filter change
  useEffect(() => {
    setDisplayLimit(INITIAL_DISPLAY_LIMIT);
  }, [deferredSearch, isActiveOnly, methodFilter]);

  const ExceptionMessage = () => {
    const message =
      handlers.length > 0
        ? 'No search results.\nPlease check your search term or filter conditions.'
        : 'No APIs registered.\nUse the Swagger tab to easily register APIs.';

    return (
      <div className="text-center mt-10 mb-10 opacity-80">
        <Label className="whitespace-pre-line">{message}</Label>
      </div>
    );
  };

  if (!Object.keys(deferredRefinedHandlers).length) return <ExceptionMessage />;

  /** Split grouped handlers based on display limit */
  const renderList = () => {
    let renderedCount = 0;
    const itemsToRender: React.ReactNode[] = [];

    for (const key of Object.keys(deferredRefinedHandlers)) {
      if (renderedCount >= displayLimit) break;

      const group = deferredRefinedHandlers[key];
      const remainingLimit = displayLimit - renderedCount;
      const slicedGroup = group.slice(0, remainingLimit);

      itemsToRender.push(
        <APIGroup key={key} baseURL={key} slicedGroups={slicedGroup} apiGroups={group} />,
      );
      renderedCount += slicedGroup.length;
    }

    return itemsToRender;
  };

  return <div className="flex flex-col gap-2 px-0.5">{renderList()}</div>;
});

export default APIList;
