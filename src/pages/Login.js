import './Login.css';
import { Link } from 'react-router-dom';
import {
    Button,
    Container,
    Form
} from 'react-bootstrap';

function Login() {
  return (
    <Container>
        <h1 id="titleText">Login</h1>
        <Form>
            <Form.Group id="formElement">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" />
            </Form.Group>
            <Form.Group id="formElement">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="password" />
            </Form.Group>
            <Button id="submitBtn" variant="secondary" type="submit">Login</Button>
          </Form>
          <p>Don't have an account? <Link to="/signup">Sign up!</Link></p>
    </Container>
  );
}

export default Login;
