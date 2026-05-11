import { useRef } from 'react';
import { FileUp } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';

type ImportSectionProps = {
  isVisible: boolean;
  importCode: string;
  onChangeImportCode: (next: string) => void;
  importErrorMessage: string | null;
  onConfirmImport: () => void;
  onFileImport: (file: File) => void;
};

const ImportSection = ({
  isVisible,
  importCode,
  onChangeImportCode,
  importErrorMessage,
  onConfirmImport,
  onFileImport,
}: ImportSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isVisible) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileImport(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 rounded-md bg-muted mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex gap-2">
        <Input
          placeholder="Paste shared scenario code here"
          value={importCode}
          onChange={e => onChangeImportCode(e.target.value)}
          className={`text-xs h-8 bg-white ${
            importErrorMessage ? 'border-destructive focus-visible:ring-destructive' : ''
          }`}
        />
        <Button size="sm" className="h-8 shadow-sm" onClick={onConfirmImport}>
          Confirm
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[10px] text-muted-foreground uppercase font-medium">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        variant="outline"
        size="sm"
        className="h-8 bg-white gap-1.5"
        onClick={() => fileInputRef.current?.click()}
      >
        <FileUp className="w-3.5 h-3.5" />
        Upload JSON File
      </Button>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/json"
        className="hidden"
      />

      {importErrorMessage && (
        <p className="text-[10px] text-destructive px-1">{importErrorMessage}</p>
      )}
    </div>
  );
};

export default ImportSection;
