import './Recipe.css';
import { Link } from 'react-router-dom';

function Recipe() {
  return (
    <div>
      <h3>Temporary Page Navigation</h3>
      <Link to="/">Home Page</Link>
      <br />
      <Link to="/saved">Saved Page</Link>
      <br />
      <Link to="/settings">Settings Page</Link>

      <h1>Recipe Page</h1>
    </div>
  );
}

export default Recipe;
