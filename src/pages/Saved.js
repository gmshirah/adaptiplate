import './Saved.css';
import { Link } from 'react-router-dom';

function Saved() {
  return (
    <div>
      <h3>Temporary Page Navigation</h3>
      <Link to="/">Home Page</Link>
      <br />
      <Link to="/recipe">Recipe Page</Link>
      <br />
      <Link to="/settings">Settings Page</Link>

      <h1>Saved Page</h1>
    </div>
  );
}

export default Saved;
