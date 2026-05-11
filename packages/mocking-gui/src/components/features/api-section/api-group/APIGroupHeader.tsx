import { MouseEvent, useMemo } from 'react';

import { ChevronDownIcon, Link as LinkIcon } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import CopyToClipboardButton from '@components/common/CopyToClipboardButton';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { CollapsibleTrigger } from '@components/ui/Collapsible';
import { ItemActions, ItemContent, ItemHeader, ItemTitle } from '@components/ui/Item';
import { Label } from '@components/ui/Label';
import { Switch } from '@components/ui/Switch';
import { useHandlerStore } from '@store/useHandlerStore';
import { getHandlerKey } from '@utils/common/keys';

import { APIGroupProps } from '.';

const APIGroupHeader = (props: APIGroupProps) => {
  const { baseURL, apiGroups } = props;

  const updateHandlerConfigs = useHandlerStore(state => state.updateHandlerConfigs);

  const activeStates = useHandlerStore(
    useShallow(state =>
      apiGroups.map(handler => {
        const handlerKey = getHandlerKey(handler);
        return Boolean(state.handlerConfigs?.[handlerKey]?.active);
      }),
    ),
  );

  const activeCount = useMemo(() => activeStates.filter(Boolean).length, [activeStates]);

  const activeAll = useMemo(() => {
    return activeCount === apiGroups.length && apiGroups.length > 0;
  }, [activeCount, apiGroups]);

  /** Toggle handler for all active/inactive */
  const handleChangeToggleActive = (checked: boolean) => {
    apiGroups.forEach(handler => {
      const handlerkey = getHandlerKey(handler);
      updateHandlerConfigs(handlerkey, { active: checked });
    });
  };

  return (
    <ItemHeader className="p-0">
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between w-full p-2 cursor-pointer hover:bg-slate-50 transition-colors">
          <ItemContent className="flex-1 min-w-0">
            <ItemTitle className="flex items-center gap-3 min-w-0 w-full">
              <Button size="icon" variant="ghost" className="h-6 w-6 p-0 rounded-full shrink-0">
                <ChevronDownIcon className="h-4 w-4 text-slate-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Button>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <LinkIcon className="h-4 w-4 text-slate-400 shrink-0" />
                <span
                  className="font-semibold text-xs text-slate-800 truncate min-w-0 whitespace-nowrap"
                  title={baseURL}
                >
                  {baseURL}
                </span>
                <CopyToClipboardButton text={baseURL} />
                <Badge className="shrink-0 ml-2 rounded-xl transition-none" variant="default">
                  {apiGroups.length} APIs
                </Badge>
              </div>
            </ItemTitle>
          </ItemContent>
          <ItemActions
            className="shrink-0 whitespace-nowrap flex items-center gap-4 pl-4"
            onClick={(e: MouseEvent) => e.stopPropagation()}
          >
            <Label className="text-xs text-slate-500 font-medium">
              {activeCount} / {apiGroups.length} Active
            </Label>
            <Switch
              checked={activeAll}
              onCheckedChange={handleChangeToggleActive}
              className="data-[state=checked]:bg-blue-500"
            />
          </ItemActions>
        </div>
      </CollapsibleTrigger>
    </ItemHeader>
  );
};

export default APIGroupHeader;
