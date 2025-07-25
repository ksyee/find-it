import icon_next from '@/assets/icons/icon_next_14.svg';
import { Link } from 'react-router-dom';

interface ShortcutProps {
  link: string;
  text: string;
  alt: string;
}

const Shortcut = ({ link, text, alt }: ShortcutProps) => {
  return (
    <Link to={link} className="flex">
      <span className="text-sm font-medium text-gray-700">{text}</span>
      <img src={icon_next} alt={alt} />
    </Link>
  );
};

export default Shortcut;
