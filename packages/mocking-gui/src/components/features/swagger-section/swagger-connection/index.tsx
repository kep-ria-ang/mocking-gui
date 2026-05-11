import { useState } from 'react';

import { Link, Plus } from 'lucide-react';
import CopyToClipboardButton from '@components/common/CopyToClipboardButton';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/Card';
import { Input } from '@components/ui/Input';
import { Separator } from '@components/ui/Separator';
import { convertSwaggerToHandlers } from '@utils/swagger/convert';
import { convertHandlersForExport } from '@utils/swagger/export';
import { loadSwaggerHandlers } from '@utils/swagger/load';

import type { OpenAPI } from '@utils/swagger/convert';

const SwaggerConnectionSection = () => {
  const [url, setUrl] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [convertedJson, setConvertedJson] = useState<string>('');
  const [convertedCount, setConvertedCount] = useState<number | null>(null);

  const handleConvertSwaggerByUrl = async () => {
    setError(null);
    try {
      const handlers = await loadSwaggerHandlers(url);
      const exportHandlers = convertHandlersForExport(handlers);
      setConvertedJson(JSON.stringify(exportHandlers, null, 2));
      setConvertedCount(handlers.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setConvertedJson('');
      setConvertedCount(null);
    }
  };

  const handleConvertSwaggerByJson = () => {
    setError(null);
    try {
      const parsed = JSON.parse(jsonText) as OpenAPI;
      const origin = parsed.servers?.[0]?.url || 'http://localhost';
      const handlers = convertSwaggerToHandlers(origin, parsed);
      // When adding JSON, display converted Swagger -> Handler object info instead of list
      const exportHandlers = convertHandlersForExport(handlers);
      setConvertedJson(JSON.stringify(exportHandlers, null, 2));
      setConvertedCount(handlers.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setConvertedCount(null);
    }
  };

  return (
    <Card>
      <CardHeader className="gap-1">
        <CardTitle className="text-sm font-medium">Convert Swagger Config to Handlers</CardTitle>
        <CardDescription className="text-xs">
          Converts a Swagger/OpenAPI Config into a handler object that you can copy and paste into
          your code.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium">Swagger URL</label>
          <div className="flex items-center gap-2">
            <div className="relative flex flex-1 items-center">
              <span className="pointer-events-none absolute left-2 text-muted-foreground">
                <Link className="h-4 w-4" />
              </span>
              <Input
                className="pl-8 text-xs"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://api.example.com/swagger.json"
              />
            </div>
            <Button size="sm" onClick={handleConvertSwaggerByUrl}>
              <Plus className="mr-1 h-3 w-3" />
              Import
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-[11px] text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium">Swagger Config</label>
          <textarea
            value={jsonText}
            onChange={e => setJsonText(e.target.value)}
            placeholder='{"openapi":"3.0.0","paths":{...}}'
            className="min-h-[120px] rounded-md border border-slate-200 p-3 text-xs font-mono focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />

          <Button size="sm" onClick={handleConvertSwaggerByJson}>
            <Plus className="mr-1 h-3 w-3" /> JSON Import
          </Button>
        </div>

        {error && <span className="text-xs text-destructive">Error: {error}</span>}
        {convertedJson && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium">Converted Handlers</label>
              {typeof convertedCount === 'number' && (
                <Badge className="shrink-0" variant="outline">
                  {convertedCount} Handler
                </Badge>
              )}
            </div>
            <div className="relative">
              <textarea
                value={convertedJson}
                readOnly
                className="min-h-[200px] w-full rounded-md border border-input p-3 text-xs font-mono shadow-sm focus-visible:outline-none focus:red read-only:muted-foreground bg-muted"
              />
              <CopyToClipboardButton text={convertedJson} className="absolute top-2 right-4" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SwaggerConnectionSection;
