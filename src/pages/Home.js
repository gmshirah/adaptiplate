import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h3>Temporary Page Navigation</h3>
      <Link to="/recipe">Recipe Page</Link>
      <br />
      <Link to="/saved">Saved Page</Link>
      <br />
      <Link to="/settings">Settings Page</Link>

      <h1>Home Page</h1>
    </div>
  );
}

export default Home;
