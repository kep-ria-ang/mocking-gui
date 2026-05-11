import { memo, useState } from 'react';

import { Collapsible, CollapsibleContent } from '@components/ui/Collapsible';
import { getHandlerKey } from '@utils/common/keys';

import APIItem from '../api-item';
import APIGroupHeader from './APIGroupHeader';

import type { HandlerState } from '@mocking-gui-types/handler';

export type APIGroupProps = {
  baseURL: string;
  slicedGroups: HandlerState[];
  apiGroups: HandlerState[];
};

const APIGroup = memo((props: APIGroupProps) => {
  const { slicedGroups } = props;
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group bg-white rounded-lg border border-slate-200 overflow-hidden"
    >
      <APIGroupHeader {...props} />
      <CollapsibleContent className="w-full">
        <section className="flex flex-col divide-y divide-slate-100 border-t border-slate-100">
          {slicedGroups.map(apiGroup => (
            <APIItem key={getHandlerKey(apiGroup)} apiGroup={apiGroup} />
          ))}
        </section>
      </CollapsibleContent>
    </Collapsible>
  );
});

export default APIGroup;
