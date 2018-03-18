import React from 'react';
import { Container, Header, Button } from 'semantic-ui-react';

const NotFound = () =>
  <div className="pages-container">
    <Container text textAlign="center">
      <Header as="h1">
        Desktop
      </Header>
      <p>
        Hey, we also built this website as a native desktop application !
      </p>
      <Button
        primary
        href=""
        target="_blank"
      >
        Go to download page
      </Button>
    </Container>
  </div>;

export default NotFound;
