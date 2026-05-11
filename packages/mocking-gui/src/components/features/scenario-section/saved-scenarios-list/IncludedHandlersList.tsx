import { X, HelpCircle } from 'lucide-react';
import { Badge } from '@components/ui/Badge';
import { cn } from '@lib/utils';
import { HandlerType } from '@mocking-gui-types/handler';
import { getHandlerInfoFromKey, getHandlerKey } from '@utils/common/keys';
import { getVariantStatusCode } from '@utils/scenario';

import type { StoredHandlerVariants, Scenario, HandlerState } from '@mocking-gui-types/handler';

type IncludedHandlersListProps = {
  scenario?: Scenario;
  configs?: Record<string, StoredHandlerVariants>;
  handlers: HandlerState[];
  onRemove?: (handlerKey: string) => void;
  className?: string;
};

const IncludedHandlersList = ({
  scenario,
  configs,
  handlers,
  onRemove,
  className,
}: IncludedHandlersListProps) => {
  const items = configs || scenario?.configs || {};
  const entries = Object.entries(items);
  const handlerKeysInProject = new Set(handlers.map(h => getHandlerKey(h)));

  if (entries.length === 0) return null;

  return (
    <section className={cn('px-3 py-2 bg-card animate-in fade-in duration-200', className)}>
      <ul className="flex flex-col gap-1">
        {entries.map(([handlerKey, config]: [string, StoredHandlerVariants]) => {
          const { method, url } = getHandlerInfoFromKey(handlerKey);
          const status = getVariantStatusCode(handlerKey, config, handlers);
          const isMissing = !handlerKeysInProject.has(handlerKey);

          return (
            <li key={handlerKey} className="flex justify-between items-center text-[10px]">
              <div className="flex items-center gap-2 max-w-[70%] min-w-0">
                <span className="font-bold text-primary text-[9px] w-8 uppercase shrink-0">
                  {method}
                </span>
                <code
                  className={cn(
                    'truncate font-mono text-muted-foreground',
                    isMissing && 'text-destructive/70',
                  )}
                  title={isMissing ? 'API not found' : url}
                >
                  {url}
                </code>
                {isMissing && <HelpCircle className="w-3 h-3 text-destructive/40 shrink-0" />}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant="secondary"
                  className="px-1 py-0 text-[8px] h-3.5 bg-slate-50 border-slate-100 text-slate-500 uppercase"
                >
                  {config.type}
                </Badge>
                {config.type !== HandlerType.AUTO && (
                  <span
                    className={cn(
                      'max-w-[180px] px-1 py-[1px] rounded font-mono whitespace-nowrap truncate border',
                      status
                        ? 'bg-blue-50 border-blue-100/50'
                        : 'bg-destructive/10 border-destructive/20',
                    )}
                    title={String(status) || config.variant}
                  >
                    {status ?? config.variant}
                  </span>
                )}

                {onRemove && (
                  <button
                    className="p-0.5 text-slate-300 hover:text-destructive transition-colors rounded-full hover:bg-destructive/5 cursor-pointer ml-1"
                    onClick={() => onRemove(handlerKey)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default IncludedHandlersList;
