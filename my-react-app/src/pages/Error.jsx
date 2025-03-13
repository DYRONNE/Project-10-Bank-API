// pages/Error.jsx (ou NotFound.jsx)
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div>
      <h1>404 - Page not found</h1>
      <p> Return to the <Link to="/">home page</Link>.</p>

    </div>
  );
}

export default NotFound;
