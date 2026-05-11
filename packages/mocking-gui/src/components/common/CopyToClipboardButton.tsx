import { useState } from 'react';

import { CheckIcon, CopyIcon } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { cn } from '@lib/utils';

interface CopyToClipboardButtonProps {
  text: string;
  className?: string;
  variant?: 'ghost' | 'outline' | 'default' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const CopyToClipboardButton = ({
  text,
  className,
  variant = 'ghost',
  size = 'icon',
}: CopyToClipboardButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn('h-6 w-6 text-slate-500 hover:text-slate-900', className)}
      onClick={handleCopy}
    >
      {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
    </Button>
  );
};

export default CopyToClipboardButton;
