import './Home.css';
import { Link } from 'react-router-dom';
import {
  Button,
  Container,
  Form,
  InputGroup
} from 'react-bootstrap';

function Home() {
  return (
    <Container>
      {/* <h3>Temporary Page Navigation</h3>
      <Link to="/recipe">Recipe Page</Link>
      <br />
      <Link to="/saved">Saved Page</Link>
      <br />
      <Link to="/settings">Settings Page</Link>

      <h1>Home Page</h1> */}

      {/* Functional implementation below */}
      <h1 id="titleText">Welcome!</h1>
      <h3>Paste a recipe link below</h3>
      <Form>
        <InputGroup>
          <Form.Control type="text" />
          <Button variant="outline-secondary" id="searchBtn" type="submit">
            {/* <span className="material-symbols-outlined">
              search
            </span> */}
            <Link to="/recipe" id="searchLink" className="material-symbols-outlined">
              search
            </Link>
          </Button>
        </InputGroup>
      </Form>
      <h3>Recently Viewed</h3>
    </Container>
  );
}

export default Home;
