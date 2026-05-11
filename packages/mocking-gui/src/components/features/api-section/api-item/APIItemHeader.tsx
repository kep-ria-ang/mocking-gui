import { CheckCircle2, ChevronRightIcon, PlusCircle } from 'lucide-react';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { CollapsibleTrigger } from '@components/ui/Collapsible';
import { ItemHeader } from '@components/ui/Item';
import { Switch } from '@components/ui/Switch';
import { HandlerState, StoredHandlerVariants } from '@mocking-gui-types/handler';
import { extractBaseUrl } from '@utils/common/url';

import { APIDelayControl, APIVariantsControl } from './APIItemControls';

interface APIItemHeaderProps {
  apiGroup: HandlerState;
  handlerKey: string;
  handlerConfig: StoredHandlerVariants;
  isInDraft: boolean;
  onToggleDraft: (e: React.MouseEvent) => void;
  onToggleActive: (checked: boolean) => void;
}

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-green-50 text-green-700 border-green-200',
  POST: 'bg-blue-50 text-blue-700 border-blue-200',
  PUT: 'bg-amber-50 text-amber-700 border-amber-200',
  PATCH: 'bg-purple-50 text-purple-700 border-purple-200',
  DELETE: 'bg-rose-50 text-rose-700 border-rose-200',
  OPTIONS: 'bg-slate-50 text-slate-700 border-slate-200',
  HEAD: 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

const Divider = () => <span className="h-3 w-px bg-slate-200" aria-hidden="true" />;

interface MethodBadgeProps {
  method: string;
}

const MethodBadge = ({ method }: MethodBadgeProps) => (
  <Badge
    variant="outline"
    className={`text-[10px] h-4 px-1.5 shrink-0 font-semibold border ${METHOD_COLORS[method] ?? METHOD_COLORS.GET}`}
  >
    {method}
  </Badge>
);

interface DraftButtonProps {
  isInDraft: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const DraftButton = ({ isInDraft, onClick }: DraftButtonProps) => (
  <Button
    variant="ghost"
    size="icon"
    className={`h-7 w-7 transition-colors ${
      isInDraft
        ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
        : 'text-slate-300 hover:text-slate-400'
    }`}
    onClick={onClick}
    title={isInDraft ? 'Remove from scenario' : 'Add to scenario'}
  >
    {isInDraft ? <CheckCircle2 className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
  </Button>
);

export const APIItemHeader = ({
  apiGroup,
  handlerKey,
  handlerConfig,
  isInDraft,
  onToggleDraft,
  onToggleActive,
}: APIItemHeaderProps) => {
  const { pathname } = extractBaseUrl(apiGroup.url);
  const method = (apiGroup.method || 'GET').toUpperCase();

  return (
    <ItemHeader className="p-0">
      <div className="w-full px-4 py-2 transition-colors group-data-[state=open]/collapsible:border-b group-data-[state=open]/collapsible:border-slate-100 grid grid-cols-[1fr_auto] items-center gap-4">
        {/* Left Section: Trigger & Info */}
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 min-w-0 cursor-pointer py-1 overflow-hidden text-left rounded-sm transition-colors"
          >
            <ChevronRightIcon className="h-3.5 w-3.5 text-slate-400 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 shrink-0" />
            <MethodBadge method={method} />
            <span className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
              <span className="font-mono text-xs truncate min-w-0 select-text">{pathname}</span>
              <span className="text-[11px] text-slate-400 truncate hidden sm:block flex-1 min-w-0 text-left select-text">
                {apiGroup?.name}
              </span>
            </span>
          </button>
        </CollapsibleTrigger>

        {/* Right Section: Controls */}
        <div className="shrink-0 flex items-center gap-2">
          <div className="flex items-center gap-2 @max-[600]:hidden">
            <APIVariantsControl
              handlerKey={handlerKey}
              handlerConfig={handlerConfig}
              apiGroup={apiGroup}
            />
            <Divider />
            <APIDelayControl
              handlerKey={handlerKey}
              handlerConfig={handlerConfig}
              apiGroup={apiGroup}
            />
            <span className="w-2" />
            <DraftButton isInDraft={isInDraft} onClick={onToggleDraft} />
          </div>
          <Switch
            checked={handlerConfig.active}
            onCheckedChange={onToggleActive}
            className="scale-75 origin-right"
            onClick={e => e.stopPropagation()}
          />
        </div>
      </div>
    </ItemHeader>
  );
};
