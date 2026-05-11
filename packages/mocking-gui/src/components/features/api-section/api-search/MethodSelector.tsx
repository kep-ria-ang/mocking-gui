import { http } from 'msw';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/Select';

type APIMethodSelectorProps = {
  value: string;
  onChange: (value: string) => void;
};

const HTTP_METHODS = [
  ...Object.keys(http)
    .filter(method => method.toLowerCase() !== 'all')
    .map(method => method.split('')[0].toUpperCase() + method.slice(1)),
];

const MethodSelector = (props: APIMethodSelectorProps) => {
  const { value, onChange } = props;
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[120px] h-8 text-xs bg-white text-slate-700 font-medium">
        <SelectValue placeholder="Method" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">All Methods</SelectItem>
        {HTTP_METHODS.map(method => (
          <SelectItem key={method} value={method}>
            {method}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default MethodSelector;
