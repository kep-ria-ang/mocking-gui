const ScenarioGuide = () => {
  return (
    <section className="p-3 rounded-md border bg-muted">
      <h3 className="text-sm font-semibold text-foreground">Step-by-Step Guide</h3>
      <ol className="mt-2 list-decimal list-inside text-xs text-muted-foreground space-y-1">
        <li>Select handlers in the API tab and add them to Draft Bar.</li>
        <li>In Draft Bar, enter a scenario name and click Save.</li>
        <li>
          In Saved Scenarios, use Apply to activate handlers, Share and Import to add external code.
        </li>
      </ol>
    </section>
  );
};

export default ScenarioGuide;
