import './NavBar.css';
import { Link } from 'react-router-dom';
import {
  Container,
  Navbar
} from 'react-bootstrap';

function NavBar() {
  return (
    <div>
      <Navbar fixed="bottom">
        <Container id="navbarContainer">
          <Link to="/" id="navbarLink">
            <span className="material-symbols-outlined" id="navbarIcon">
              search
            </span>
          </Link>
          <Link to="/saved" id="navbarLink">
            <span className="material-symbols-outlined" id="navbarIcon">
              bookmark
            </span>
          </Link>
          <Link to="/settings" id="navbarLink">
            <span className="material-symbols-outlined" id="navbarIcon">
              account_circle
            </span>
          </Link>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavBar;
