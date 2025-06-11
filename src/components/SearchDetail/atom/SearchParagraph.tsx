interface SearchParagraphProps {
  children: string;
}

const SearchParagraph = ({ children }: SearchParagraphProps) => {
  return <p className="text-12px font-medium tracking-[-0.36px]">{children}</p>;
};

export default SearchParagraph;
