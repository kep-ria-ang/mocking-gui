import { useCallback } from 'react';

import { ExternalLink, RefreshCcw } from 'lucide-react';
import CopyToClipboardButton from '@components/common/CopyToClipboardButton';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@components/ui/Card';
import { useHandlerStore } from '@store/useHandlerStore';
import { loadSwaggerHandlers } from '@utils/swagger/load';

import type { SwaggerSourceStatus } from '@store/types';

const SwaggerConfigSection = () => {
  const sources = useHandlerStore(state => state.swaggerSources) ?? [];
  const updateSwaggerSource = useHandlerStore(state => state.updateSwaggerSource);

  const STATUS: Record<'PENDING' | 'SUCCESS' | 'ERROR', SwaggerSourceStatus> = {
    PENDING: 'pending',
    SUCCESS: 'success',
    ERROR: 'error',
  };

  const refreshSource = useCallback(
    async (url: string) => {
      updateSwaggerSource(url, {
        status: STATUS.PENDING,
        errorMessage: undefined,
        count: undefined,
      });
      try {
        const swaggerHandlers = await loadSwaggerHandlers(url);
        updateSwaggerSource(url, {
          status: STATUS.SUCCESS,
          count: swaggerHandlers.length,
          errorMessage: undefined,
        });
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        updateSwaggerSource(url, { status: STATUS.ERROR, errorMessage: message });
      }
    },
    [updateSwaggerSource],
  );

  const getStatusLabel = (status?: SwaggerSourceStatus) => {
    if (status === STATUS.SUCCESS) return 'Success';
    if (status === STATUS.ERROR) return 'Error';
    return 'Loading';
  };

  const getStatusVariant = (
    status?: SwaggerSourceStatus,
  ): 'default' | 'secondary' | 'destructive' => {
    if (status === STATUS.SUCCESS) return 'default';
    if (status === STATUS.ERROR) return 'destructive';
    return 'secondary';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle className="text-sm">Added Swagger Sources</CardTitle>
          <CardDescription>{sources.length} sources</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {sources.length === 0 ? (
          <div className="text-sm text-muted-foreground">No Swagger URL registered.</div>
        ) : (
          sources.map(source => {
            const swaggerName = source?.name || source?.configUrl;
            const statusLabel = getStatusLabel(source.status);
            const statusVariant = getStatusVariant(source.status);
            return (
              <Card key={swaggerName} className="border bg-background">
                <CardHeader className="flex flex-row items-center justify-between gap-1 pb-2">
                  <div className="flex items-center gap-2">
                    {source.docsUrl ? (
                      <a
                        href={source.docsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium inline-flex items-center gap-1 hover:underline"
                        aria-label="Open Swagger docs"
                      >
                        {swaggerName}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <p className="text-sm font-medium">{swaggerName}</p>
                    )}
                    <Badge variant={statusVariant}>{statusLabel}</Badge>
                    {source.status === STATUS.SUCCESS && typeof source.count === 'number' ? (
                      <Badge variant="outline">{source.count} API</Badge>
                    ) : null}
                  </div>
                  <CardAction>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => refreshSource(source.configUrl)}
                      disabled={source.status === STATUS.PENDING}
                      aria-label="Refresh"
                      className="px-2"
                    >
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
                    <div
                      className="flex-1 overflow-hidden font-mono truncate"
                      title={source.configUrl}
                    >
                      {source.configUrl}
                    </div>
                    <CopyToClipboardButton
                      text={source.configUrl}
                      className="h-4 w-4 shrink-0 hover:text-foreground"
                    />
                  </div>
                  {source.status === STATUS.ERROR && source.errorMessage ? (
                    <div className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {source.errorMessage}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default SwaggerConfigSection;
