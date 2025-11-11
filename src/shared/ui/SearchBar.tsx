import { FormEvent } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

const SearchBar = ({
  value,
  onChange,
  onSubmit,
  placeholder = '검색어를 입력해주세요',
  disabled = false
}: SearchBarProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full items-center gap-3"
      role="search"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full rounded-2xl bg-gray-50 py-4 pr-5 pl-14 text-base transition outline-none placeholder:text-gray-400 focus:bg-gray-100 disabled:opacity-50"
          placeholder={placeholder}
        />
      </div>
      <button
        type="submit"
        disabled={disabled}
        className="rounded-2xl bg-[#4F7EFF] px-8 py-4 text-base font-medium text-white transition-colors hover:bg-[#3d68e0] disabled:opacity-50"
      >
        검색
      </button>
    </form>
  );
};

export default SearchBar;
