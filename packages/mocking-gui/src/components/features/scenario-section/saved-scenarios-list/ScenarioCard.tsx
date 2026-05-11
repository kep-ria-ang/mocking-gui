import { useState } from 'react';
import { ChevronDown, ChevronUp, Play, StopCircle, Share2, Trash2 } from 'lucide-react';

import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Card, CardContent } from '@components/ui/Card';
import { getHandlerKey } from '@utils/common/keys';
import IncludedHandlersList from './IncludedHandlersList';

import type { Scenario, HandlerState, StoredHandlerVariants } from '@mocking-gui-types/handler';

type ScenarioCardProps = {
  scenario: Scenario;
  isActive: boolean;
  onApply: () => void;
  onUpdate?: (configs: Record<string, StoredHandlerVariants>) => void;
  onShare: () => void;
  onDelete: () => void;
  expanded: boolean;
  onToggleExpand: () => void;
  handlers: HandlerState[];
};

const ScenarioCard = (props: ScenarioCardProps) => {
  const { scenario, isActive, onApply, onShare, onDelete, expanded, onToggleExpand, handlers } =
    props;
  const [applyErrorText, setApplyErrorText] = useState<string | null>(null);
  const computeMissingHandlerKeys = (targetScenario: Scenario, targetHandlers: HandlerState[]) => {
    const handlerKeys = new Set(targetHandlers.map(handler => getHandlerKey(handler)));
    return Object.keys(targetScenario.configs).filter(key => !handlerKeys.has(key));
  };
  const handleApplyClick = () => {
    const missingKeys = computeMissingHandlerKeys(scenario, handlers);
    if (missingKeys.length === 0) {
      setApplyErrorText(null);
      onApply();
    } else {
      setApplyErrorText(`${missingKeys.length} API not found in current handlers`);
    }
  };

  return (
    <Card
      className={`group transition-all overflow-hidden ${
        isActive ? 'border-primary shadow-sm' : ''
      }`}
    >
      <CardContent className="p-0 flex flex-col">
        <header className="p-3 flex justify-between items-start gap-2">
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 min-w-0">
              <h4 className="font-semibold text-foreground leading-tight text-sm truncate min-w-0">
                {scenario.name}
              </h4>
              {isActive && (
                <Badge
                  variant="default"
                  className="text-[9px] h-4 flex items-center gap-1 px-1.5 shrink-0"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Active
                </Badge>
              )}
            </div>
            <time className="text-[10px] text-muted-foreground">
              {new Date(scenario.createdAt).toLocaleString()}
            </time>
          </div>
          <aside className="flex items-center gap-2 shrink-0">
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 font-mono whitespace-nowrap"
            >
              {Object.keys(scenario.configs).length} Mock(s)
            </Badge>
          </aside>
        </header>

        <section className="px-3 pb-2 flex items-center gap-2">
          <Button
            size="sm"
            className="flex-1 h-8 gap-1.5 text-xs font-medium transition-all"
            variant={isActive ? 'outline' : 'default'}
            onClick={handleApplyClick}
          >
            {isActive ? <StopCircle className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isActive ? 'Deactivate' : 'Apply'}
          </Button>

          <div className="flex items-center gap-1">
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onShare} title="Share">
              <Share2 className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={onDelete}
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </section>
        {applyErrorText && <p className="text-[10px] text-destructive px-3">{applyErrorText}</p>}

        <button
          type="button"
          className="px-3 py-1.5 border-t border-slate-50 bg-slate-50 flex justify-between items-center hover:bg-slate-100 active:bg-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-300 transition-colors cursor-pointer"
          onClick={onToggleExpand}
          aria-expanded={expanded}
          aria-controls={`included-handlers-${scenario.id}`}
        >
          <span className="text-[10px] font-medium text-slate-500">Included Handlers Details</span>
          {expanded ? (
            <ChevronUp className="w-3 h-3 text-slate-400" />
          ) : (
            <ChevronDown className="w-3 h-3 text-slate-400" />
          )}
        </button>

        {expanded && (
          <div id={`included-handlers-${scenario.id}`}>
            <IncludedHandlersList scenario={scenario} handlers={handlers} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScenarioCard;
