import { Database, DatabaseZap, Loader2 } from 'lucide-react';
import { panelZIndex } from '@constants/zIndex';
import { PanelPosition } from '@mocking-gui-types/panel';

type MockingGUIToggleProps = {
  isReady: boolean;
  isOpen: boolean;
  position: PanelPosition;
  onToggle: () => void;
  hasActiveHandlers: boolean;
};

/**
 * MockingGUIToggle Component
 *
 * Floating action button for Mocking GUI.
 * Displays a loading state when initializing, and the toggle button when ready.
 * Shows an error indicator if setup failed.
 */
const MockingGUIToggle = ({
  isReady,
  position,
  onToggle,
  hasActiveHandlers,
}: MockingGUIToggleProps) => {
  const buttonPositionStyle = getButtonPositionStyle(position);

  const renderIcon = () => {
    if (!isReady) {
      return (
        <Loader2
          size={16}
          className="animate-spin"
          style={{ animation: 'spin 0.8s linear infinite' }}
        />
      );
    }
    return hasActiveHandlers ? <DatabaseZap size={16} /> : <Database size={16} />;
  };

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <button
        type="button"
        onClick={isReady ? onToggle : undefined}
        aria-label={isReady ? 'Toggle Mocking GUI Panel' : 'Initializing Mocking GUI'}
        disabled={!isReady}
        style={{
          ...toggleContainerStyle,
          ...buttonPositionStyle,
          cursor: isReady ? 'pointer' : 'default',
        }}
      >
        {renderIcon()}
      </button>
    </>
  );
};

export default MockingGUIToggle;

const getButtonPositionStyle = (position: PanelPosition) => {
  switch (position) {
    case 'bottom-right':
      return { bottom: 24, right: 24 };
    case 'top-left':
      return { top: 24, left: 24 };
    case 'top-right':
      return { top: 24, right: 24 };
    case 'bottom-left':
    default:
      return { bottom: 24, left: 24 };
  }
};

const toggleContainerStyle = {
  position: 'fixed',
  zIndex: panelZIndex.button,
  width: 44,
  height: 44,
  borderRadius: 9999,
  border: '1px solid rgba(255, 255, 255, 0.12)',
  padding: 0,
  lineHeight: 1,
  WebkitAppearance: 'none',
  appearance: 'none',
  outline: 'none',
  background: '#111827',
  color: '#fff',
  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
} as const;
