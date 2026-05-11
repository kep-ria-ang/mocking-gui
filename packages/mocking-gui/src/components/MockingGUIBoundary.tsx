import { PropsWithChildren, useState } from 'react';

import { useShallow } from 'zustand/react/shallow';
import ShadowRootPortal from '@components/common/ShadowRootPortal';
import { useMockingGUIStyles } from '@hooks/useMockingGUIStyles';
import useSetupMockingGUIWorker from '@hooks/useSetupMockingGUIWorker';

import { MockingConfig } from '@mocking-gui-types/config';
import { useHandlerStore } from '@store/useHandlerStore';
import { usePanelStore } from '@store/usePanelStore';

import LoadingPage from './LoadingPage';
import MockingGUIPanel from './MockingGUIPanel';
import MockingGUIToggle from './MockingGUIToggle';

const MockingGUIBoundary = (props: { config?: MockingConfig } & PropsWithChildren) => {
  const { config, children } = props;
  const { isReady } = useSetupMockingGUIWorker(config);

  if (!isReady) {
    return <LoadingPage />;
  }

  return (
    <>
      <InternalUI isReady={isReady} />
      {children}
    </>
  );
};

const InternalUI = ({ isReady }: { isReady: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { styleText, isStyleLoading } = useMockingGUIStyles(isReady);

  const panelPosition = usePanelStore(useShallow(state => state.panelPosition));
  const hasActiveHandlers = useHandlerStore(
    useShallow(state => Object.values(state.handlerConfigs).some(config => config.active)),
  );

  const handleTogglePanel = () => setIsOpen(prev => !prev);
  const handleClosePanel = () => setIsOpen(false);

  return (
    <>
      {isOpen && styleText && !isStyleLoading && (
        <ShadowRootPortal styleText={styleText}>
          <MockingGUIPanel onClosePanel={handleClosePanel} />
        </ShadowRootPortal>
      )}
      <MockingGUIToggle
        isReady={isReady && !isStyleLoading}
        isOpen={isOpen}
        position={panelPosition}
        onToggle={handleTogglePanel}
        hasActiveHandlers={hasActiveHandlers}
      />
    </>
  );
};

export default MockingGUIBoundary;
