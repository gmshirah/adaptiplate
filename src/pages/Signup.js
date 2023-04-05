import './Signup.css';
import { Link } from 'react-router-dom';
import {
    Button,
    Container,
    Form
} from 'react-bootstrap';

const agreement = "I understand this application was created in the context \
        of an academic project and that my account information may be viewed \
        by students and faculty of The University of Texas at Austin. I also \
        understand that I have the ability to delete my account information \
        from this platform at any time."

function Signup() {
  return (
    <Container>
        <h1 id="titleText">Sign Up</h1>
        <Form>
            <Form.Group id="formElement">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" />
            </Form.Group>
            <Form.Group id="formElement">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="username" />
            </Form.Group>
            <Form.Group id="formElement">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="password" />
            </Form.Group>
            <Form.Group id="formElement">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="password" />
            </Form.Group>
            <Form.Group id="formElement">
                <Form.Check
                    id="agreeCheckbox"
                    label={agreement}
                />
            </Form.Group>
            <Button id="submitBtn" variant="secondary" type="submit">Sign Up</Button>
          </Form>
          <p>Already have an account? <Link to="/login">Login!</Link></p>
    </Container>
  );
}

export default Signup;
