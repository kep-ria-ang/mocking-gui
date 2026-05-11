import { PositionSettings } from './position-settings';
import { SizeSettings } from './size-settings';

const SettingSection = () => {
  return (
    <div className="flex flex-col gap-8 p-6">
      <header>
        <h2 className="text-lg font-bold mb-1">Panel</h2>
        <p className="text-sm text-slate-500">Position and Size Settings</p>
      </header>

      <div className="flex flex-col gap-6">
        <PositionSettings />
        <SizeSettings />
      </div>
    </div>
  );
};

export default SettingSection;
