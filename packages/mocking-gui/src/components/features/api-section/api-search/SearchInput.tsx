import { Search } from 'lucide-react';

import { Input } from '@components/ui/Input';

type APISearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

const SearchInput = (props: APISearchInputProps) => {
  const { value, onChange } = props;
  return (
    <div className="relative h-10 flex-1">
      <Search className="absolute left-3 inset-y-0 my-auto h-4 w-4 text-slate-400 pointer-events-none" />
      <Input
        placeholder="Search APIs by method, name or url"
        className="pl-9 pr-10 h-10 rounded-xl bg-white border-slate-200"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
};
export default SearchInput;
