import React, {Component} from 'react';
import {Container, Header, Button} from 'semantic-ui-react';

import AccountSelector from '../../elements/StellarContainers/AccountSelector';
import BottomBar from '../../elements/UiTools/BottomBar/BottomBar';

const styles = {
  title: {
    fontSize: '20px',
    color: 'black',
    fontWeight: 400,
    paddingTop: '0.5rem',
    paddingBottom: '2.5rem',
    textAlign: 'left',
  },
};

class WelcomeScreen extends Component {
  render() {
    return (
      <div className="welcome-container">
        <div className="welcome-container-overlay"/>
        <Container textAlign="center">
          <h1 className="welcome-logo">
            <a href="#">
              {/*<img src={img} alt=""/>*/}
            </a>
          </h1>
          <Header as="h4" style={styles.title}>
            Log in to Smartlands wallet
          </Header>
          <AccountSelector/>
          <BottomBar />
        </Container>
      </div>
    );
  }
}

export default WelcomeScreen;
