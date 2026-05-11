import { Maximize2, Minimize2, MoveDiagonal } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import { Button } from '@components/ui/Button';
import { PanelSize } from '@mocking-gui-types/panel';
import { usePanelStore } from '@store/usePanelStore';

const SIZES: { value: PanelSize; label: string; icon: React.ElementType }[] = [
  { value: 'small', label: 'Small', icon: Minimize2 },
  { value: 'medium', label: 'Medium', icon: MoveDiagonal },
  { value: 'large', label: 'Large', icon: Maximize2 },
];

export const SizeSettings = () => {
  const { panelSize, setPanelSize } = usePanelStore(
    useShallow(state => ({
      panelSize: state.panelSize,
      setPanelSize: state.setPanelSize,
    })),
  );

  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-600">Size</h3>
      <div className="grid grid-cols-3 gap-2">
        {SIZES.map(({ value, label, icon: Icon }) => {
          const isSelected = panelSize === value;
          return (
            <Button
              key={value}
              variant="outline"
              className={`h-9 text-xs px-2 transition-all ${
                isSelected
                  ? 'border-slate-600 bg-white text-slate-900 font-medium shadow-sm ring-1 ring-slate-900/5'
                  : 'text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300'
              }`}
              onClick={() => setPanelSize(value)}
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
