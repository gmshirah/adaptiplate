import './Settings.css';
import { Link } from 'react-router-dom';
import { Card, Container, Image } from 'react-bootstrap';

function Settings() {
  return (
    <Container>
      <h1 id="titleText">Settings</h1>
      <div>
        <Image className='account-image' src='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' roundedCircle fluid thumbnail></Image>
        <Card>

        </Card>
      </div>
    </Container>
  );
}

export default Settings;
