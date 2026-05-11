import { ArrowDownLeft, ArrowDownRight, ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@components/ui/Button';
import { PanelPosition } from '@mocking-gui-types/panel';
import { usePanelStore } from '@store/usePanelStore';

const POSITIONS: { value: PanelPosition; label: string; icon: React.ElementType }[] = [
  { value: 'top-left', label: 'Top Left', icon: ArrowUpLeft },
  { value: 'top-right', label: 'Top Right', icon: ArrowUpRight },
  { value: 'bottom-left', label: 'Bottom Left', icon: ArrowDownLeft },
  { value: 'bottom-right', label: 'Bottom Right', icon: ArrowDownRight },
];

export const PositionSettings = () => {
  const { panelPosition, setPanelPosition } = usePanelStore(
    useShallow(state => ({
      panelPosition: state.panelPosition,
      setPanelPosition: state.setPanelPosition,
    })),
  );

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-600">Position</h3>
      <div className="grid grid-cols-2 gap-2">
        {POSITIONS.map(({ value, label, icon: Icon }) => {
          const isSelected = panelPosition === value;
          return (
            <Button
              key={value}
              variant="outline"
              className={`justify-start h-9 text-xs transition-all ${
                isSelected
                  ? 'border-slate-600 bg-white text-slate-900 font-medium shadow-sm ring-1 ring-slate-900/5'
                  : 'text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300'
              }`}
              onClick={() => setPanelPosition(value)}
            >
              <Icon
                className={`mr-2 h-3.5 w-3.5 ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}
              />
              {label}
            </Button>
          );
        })}
      </div>
    </section>
  );
};
