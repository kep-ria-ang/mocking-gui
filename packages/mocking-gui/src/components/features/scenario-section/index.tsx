import SavedScenariosList from './saved-scenarios-list';
import ScenarioGuide from './ScenarioGuide';

const ScenarioSection = () => {
  return (
    <div className="flex flex-col gap-6 pt-1">
      <SavedScenariosList />
      <ScenarioGuide />
    </div>
  );
};

export default ScenarioSection;
