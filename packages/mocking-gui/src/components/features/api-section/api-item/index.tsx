import React, { memo } from 'react';

import { Collapsible, CollapsibleContent } from '@components/ui/Collapsible';
import { Item } from '@components/ui/Item';
import { HandlerState } from '@mocking-gui-types/handler';
import { useHandlerStore } from '@store/useHandlerStore';
import { getHandlerKey } from '@utils/common/keys';

import APIItemDetail from './APIItemDetail';
import { APIItemHeader } from './APIItemHeader';

export type APIItemProps = {
  apiGroup: HandlerState;
};

const APIItem = memo((props: APIItemProps) => {
  const { apiGroup } = props;
  const handlerKey = getHandlerKey(apiGroup);

  const updateHandlerConfigs = useHandlerStore(state => state.updateHandlerConfigs);
  const addToDraft = useHandlerStore(state => state.addToDraft);
  const removeFromDraft = useHandlerStore(state => state.removeFromDraft);

  /** Currently configured handlerConfig */
  const handlerConfig = useHandlerStore(state => state.handlerConfigs[handlerKey]);

  const isInDraft = useHandlerStore(state => !!state.draftScenario?.[handlerKey]);

  /** Active toggle function */
  const handleChangeToggleActive = (checked: boolean) => {
    updateHandlerConfigs(handlerKey, { active: checked });
  };

  const handleToggleDraft = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInDraft) {
      removeFromDraft(handlerKey);
    } else {
      addToDraft(handlerKey);
    }
  };

  if (!handlerConfig) return null;

  return (
    <Collapsible className="group/collapsible">
      <Item className="w-full transition-all duration-200 p-0 gap-0">
        <APIItemHeader
          apiGroup={apiGroup}
          handlerKey={handlerKey}
          handlerConfig={handlerConfig}
          isInDraft={isInDraft}
          onToggleDraft={handleToggleDraft}
          onToggleActive={handleChangeToggleActive}
        />
        <CollapsibleContent className="w-full">
          <APIItemDetail
            apiGroup={apiGroup}
            handlerKey={handlerKey}
            handlerConfig={handlerConfig}
          />
        </CollapsibleContent>
      </Item>
    </Collapsible>
  );
});

export default APIItem;
