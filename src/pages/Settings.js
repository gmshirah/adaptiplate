import './Settings.css';
import { Link } from 'react-router-dom';
import { ListGroup, Container, Image } from 'react-bootstrap';

function Settings() {
  return (
    <Container>
      <h1 id="titleText">Settings</h1>
      <Image id="accountImage" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" roundedCircle fluid thumbnail />
      <ListGroup id="settings" variant="flush">
        <ListGroup.Item id="setting">
          <span id="settingText">Dietary Restrictions</span>
          <span className="material-symbols-outlined" id="selectIcon">
            navigate_next
          </span>
        </ListGroup.Item>
        <ListGroup.Item id="setting">
          <span id="settingText">Nutritional Preferences</span>
          <span className="material-symbols-outlined" id="selectIcon">
            navigate_next
          </span>
        </ListGroup.Item>
        <ListGroup.Item id="setting">
          <span id="settingText">Financial Preferences</span>
          <span className="material-symbols-outlined" id="selectIcon">
            navigate_next
          </span>
        </ListGroup.Item>
        <ListGroup.Item id="setting">
          <span id="settingText">App Appearance</span>
          <span className="material-symbols-outlined" id="selectIcon">
            navigate_next
          </span>
        </ListGroup.Item>
        <ListGroup.Item id="setting">
          <span id="settingText">Clear Saved Recipes</span>
          <span className="material-symbols-outlined" id="selectIcon">
            navigate_next
          </span>
        </ListGroup.Item>
        <ListGroup.Item id="setting">
          <span id="settingText">Log Out</span>
          <span className="material-symbols-outlined" id="selectIcon">
            navigate_next
          </span>
        </ListGroup.Item>
        <ListGroup.Item id="deleteAccount">
          <span id="settingText">Delete Account</span>
          <span className="material-symbols-outlined" id="selectIcon">
            navigate_next
          </span>
        </ListGroup.Item>
      </ListGroup>
    </Container>
  );
}

export default Settings;
