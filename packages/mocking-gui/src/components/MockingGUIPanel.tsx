'use client';

import { useState } from 'react';

import { X } from 'lucide-react';
import ApiSection from '@components/features/api-section';
import ScenarioSection from '@components/features/scenario-section';
import ScenarioDraftBar from '@components/features/scenario-section/ScenarioDraftBar';
import SettingSection from '@components/features/setting-section';
import SwaggerSection from '@components/features/swagger-section';
import { Button } from '@components/ui/Button';
import { Card, CardContent } from '@components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/Tabs';
import { PanelTab } from '@constants/tab';
import { panelZIndex } from '@constants/zIndex';
import { PanelPosition, PanelSize } from '@mocking-gui-types/panel';
import { usePanelStore } from '@store/usePanelStore';

type MockingGUIPanelProps = {
  onClosePanel: () => void;
};

const MockingGUIPanel = ({ onClosePanel }: MockingGUIPanelProps) => {
  const [activeTab, setActiveTab] = useState<string>(PanelTab.API);
  const panelSize = usePanelStore(state => state.panelSize);
  const panelPosition = usePanelStore(state => state.panelPosition);

  const panelDimensions = getPanelSize(panelSize);
  const positionClass = getPanelPosition(panelPosition);

  const controlledPanelStyle = {
    zIndex: panelZIndex.panel,
    ...panelDimensions,
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Card
      className={`bg-panel fixed ${positionClass} flex flex-col overflow-hidden border border-slate-200 rounded-xl shadow-2xl transition-all duration-300 ease-in-out @container`}
      style={controlledPanelStyle}
    >
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex flex-col flex-1 overflow-hidden"
      >
        <div className="flex justify-between p-6 pb-2 shrink-0">
          <TabsList>
            {Object.values(PanelTab).map(tab => (
              <TabsTrigger key={tab} value={tab}>
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex items-center gap-1">
            <Button className="p-3" variant={'ghost'} onClick={onClosePanel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardContent className="flex-1 overflow-auto">
          <TabsContent value={PanelTab.API}>
            <ApiSection />
          </TabsContent>
          <TabsContent value={PanelTab.SWAGGER}>
            <SwaggerSection />
          </TabsContent>
          <TabsContent value={PanelTab.SCENARIO}>
            <ScenarioSection />
          </TabsContent>
          <TabsContent value={PanelTab.SETTING}>
            <SettingSection />
          </TabsContent>
        </CardContent>
      </Tabs>
      <ScenarioDraftBar onTabChange={handleTabChange} />
    </Card>
  );
};

const getPanelSize = (panelSize: PanelSize) => {
  const commonMinWidth = 420;
  const verticalSafeMargin = 120;
  const maxAvailableHeight = `calc(100vh - ${verticalSafeMargin}px)`;
  switch (panelSize) {
    case 'small':
      return {
        width: '55vw',
        minWidth: commonMinWidth,
        maxWidth: '800px',
        height: `min(620px, 60vh, ${maxAvailableHeight})`,
        minHeight: '380px',
      };
    case 'large':
      return {
        width: '90vw',
        minWidth: commonMinWidth,
        maxWidth: '2000px',
        height: `min(880px, 88vh, ${maxAvailableHeight})`,
        minHeight: '580px',
      };
    case 'medium':
    default:
      return {
        width: '65vw',
        minWidth: commonMinWidth,
        maxWidth: '1400px',
        height: `min(760px, 75vh, ${maxAvailableHeight})`,
        minHeight: '480px',
      };
  }
};

const getPanelPosition = (panelPosition: PanelPosition) => {
  switch (panelPosition) {
    case 'bottom-right':
      return 'bottom-20 right-6';
    case 'top-left':
      return 'top-20 left-6';
    case 'top-right':
      return 'top-20 right-6';
    case 'bottom-left':
    default:
      return 'bottom-20 left-6';
  }
};

export default MockingGUIPanel;
