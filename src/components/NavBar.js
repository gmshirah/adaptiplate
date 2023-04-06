import './NavBar.css';
import { Link, useLocation } from 'react-router-dom';
import {
  Container,
  Navbar
} from 'react-bootstrap';

function NavBar() {
  const pathName = useLocation().pathname;

  return (
    <div>
      { (pathName === "/login" || pathName === "/signup") ? (
        <Navbar fixed="bottom">
          <Container id="navbarContainerOneIcon">
            <Link to="/" id="navbarLink">
              <span className="material-symbols-outlined" id="navbarIcon">
                close
              </span>
            </Link>
          </Container>
        </Navbar>
      ) : (
        <Navbar fixed="bottom">
          <Container id="navbarContainer">
            <Link to="/" id={ (pathName === "/") ? "navbarLinkSelected" : "navbarLink" }>
              <span className="material-symbols-outlined" id="navbarIcon">
                search
              </span>
            </Link>
            <Link to="/saved" id={ (pathName === "/saved") ? "navbarLinkSelected" : "navbarLink" }>
              <span className="material-symbols-outlined" id="navbarIcon">
                bookmark
              </span>
            </Link>
            <Link to="/settings" id={ (pathName === "/settings") ? "navbarLinkSelected" : "navbarLink" }>
              <span className="material-symbols-outlined" id="navbarIcon">
                account_circle
              </span>
            </Link>
          </Container>
        </Navbar>
      )}
    </div>
  );
}

export default NavBar;
