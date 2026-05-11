import { useState } from 'react';

import { Code2 } from 'lucide-react';
import CodeBlockWithLines from '@components/common/CodeBlockWithLines';
import CopyToClipboardButton from '@components/common/CopyToClipboardButton';
import EmptyState from '@components/common/EmptyState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/Tabs';

type APIResponseDetailProps = {
  responseJson: string;
  headersJson: string;
  headers: HeadersInit;
};

const APIResponseDetail = ({ responseJson, headersJson, headers }: APIResponseDetailProps) => {
  const [activeTab, setActiveTab] = useState('response');
  const hasHeaders = Array.isArray(headers)
    ? headers.length > 0
    : Object.keys(headers as Record<string, string>).length > 0;

  return (
    <div className="rounded-lg bg-[#1E293B] overflow-hidden mt-2 shadow-sm border border-slate-700">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <nav
          className="flex items-center justify-between border-b border-slate-700/50 bg-[#0F172A] px-2"
          aria-label="Response tabs"
        >
          <TabsList className="h-9 bg-transparent p-0 gap-1">
            <TabsTrigger
              value="response"
              className="h-9 rounded-none border-b-2 border-transparent px-4 text-xs font-medium text-slate-400 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400"
            >
              Response Body
            </TabsTrigger>
            <TabsTrigger
              value="headers"
              className="h-9 rounded-none border-b-2 border-transparent px-4 text-xs font-medium text-slate-400 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:text-blue-400"
            >
              Headers
            </TabsTrigger>
          </TabsList>
          <span className="text-[10px] text-slate-500 font-mono px-2">JSON</span>
        </nav>

        <div className="relative">
          <TabsContent value="response" className="m-0 p-0">
            {responseJson ? (
              <CodeBlockWithLines text={responseJson} preClass="text-emerald-400" />
            ) : (
              <EmptyState
                message="No response body defined"
                icon={<Code2 className="h-8 w-8 opacity-20" />}
              />
            )}
          </TabsContent>
          <TabsContent value="headers" className="m-0 p-0">
            {hasHeaders ? (
              <CodeBlockWithLines text={headersJson} preClass="text-orange-300" />
            ) : (
              <EmptyState
                message="No headers defined"
                icon={<Code2 className="h-8 w-8 opacity-20" />}
              />
            )}
          </TabsContent>
          {(responseJson || hasHeaders) && (
            <CopyToClipboardButton
              text={activeTab === 'response' ? responseJson : headersJson}
              className="absolute top-2 right-4 text-slate-500 hover:text-slate-300 hover:bg-slate-700/50"
            />
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default APIResponseDetail;
