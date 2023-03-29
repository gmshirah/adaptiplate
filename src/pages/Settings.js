import './Settings.css';
import { Link } from 'react-router-dom';

function Settings() {
  return (
    <div>
      <h3>Temporary Page Navigation</h3>
      <Link to="/">Home Page</Link>
      <br />
      <Link to="/recipe">Recipe Page</Link>
      <br />
      <Link to="/saved">Saved Page</Link>

      <h1>Settings Page</h1>
    </div>
  );
}

export default Settings;
