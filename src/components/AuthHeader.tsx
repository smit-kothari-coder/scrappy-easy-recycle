
import { Link } from 'react-router-dom';

export function AuthHeader() {
  return (
    <div className="flex justify-center items-center mb-8">
      <Link to="/" className="text-3xl sm:text-4xl font-bold text-scrap-green">
        ScrapEasy
      </Link>
    </div>
  );
}
