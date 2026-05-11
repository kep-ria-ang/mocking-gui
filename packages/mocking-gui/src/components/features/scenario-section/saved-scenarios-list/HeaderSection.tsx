import { Download, Upload } from 'lucide-react';
import { Button } from '@components/ui/Button';

type HeaderSectionProps = {
  count: number;
  onToggleImport: () => void;
  onExport: () => void;
};

const HeaderSection = ({ count, onToggleImport, onExport }: HeaderSectionProps) => {
  return (
    <header className="flex justify-between items-center mb-1">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Saved Scenarios</h3>
        <p className="text-[11px] text-muted-foreground">{count} scenarios saved</p>
      </div>
      <nav className="flex gap-2" aria-label="Scenario actions">
        <Button
          variant="outline"
          size="sm"
          className="shadow-none h-8"
          onClick={onExport}
          disabled={count === 0}
        >
          <Upload className="w-3.5 h-3.5" />
          Export
        </Button>
        <Button variant="outline" size="sm" className="shadow-none h-8" onClick={onToggleImport}>
          <Download className="w-3.5 h-3.5" />
          Import
        </Button>
      </nav>
    </header>
  );
};

export default HeaderSection;
