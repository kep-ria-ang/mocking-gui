import { useEffect, useState } from 'react';

import { useHandlerStore } from '@store/useHandlerStore';
import { loadSwaggerHandlers } from '@utils/swagger/load';

import type { SwaggerSourceConfigOption } from '@mocking-gui-types/config';
import type { HandlerState } from '@mocking-gui-types/handler';

const useSwaggerHandlerSetup = (swaggerSources?: SwaggerSourceConfigOption[]) => {
  const initSwaggerSources = useHandlerStore(state => state.initSwaggerSources);
  const updateSwaggerSource = useHandlerStore(state => state.updateSwaggerSource);

  const [ready, setReady] = useState(false);
  const [handlers, setHandlers] = useState<HandlerState[]>([]);

  useEffect(() => {
    const setupSwaggerHandler = async () => {
      if (!swaggerSources?.length) {
        setHandlers([]);
        setReady(true);
        return;
      }

      initSwaggerSources(swaggerSources);

      const swaggerHandlersLists: HandlerState[][] = [];
      for (const source of swaggerSources) {
        const { configUrl, serverUrl } = source;
        try {
          const list = await loadSwaggerHandlers(configUrl, serverUrl);
          swaggerHandlersLists.push(list);
          updateSwaggerSource(configUrl, {
            status: 'success',
            count: list.length,
          });
        } catch (e) {
          const message = e instanceof Error ? e.message : String(e);
          updateSwaggerSource(configUrl, { status: 'error', errorMessage: message });
        }
      }

      setHandlers(swaggerHandlersLists.flat());
      setReady(true);
    };
    setupSwaggerHandler();
  }, [swaggerSources, initSwaggerSources, updateSwaggerSource]);

  return { swaggerHandlers: handlers, isSwaggerReady: ready };
};

export default useSwaggerHandlerSetup;
