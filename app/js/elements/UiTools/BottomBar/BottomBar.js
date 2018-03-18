import React, { PropTypes } from 'react';
import { Grid, Form, Container, Icon, Menu, Button, Header } from 'semantic-ui-react';
import '../../../../styles/bottom_bar.scss';

const light = {
  color: '#bababa',
};

const navs = [
  {
    href: 'https://smartlands.io#home',
    text: 'Home',
  },
  {
    href: 'https://smartlands.io#product',
    text: 'Product',
  },
  {
    href: 'https://smartlands.io/company.html',
    text: 'Company',
  },
  {
    href: 'https://smartlands.io/pdf/Tutorial.pdf',
    text: 'Tutorial',
  },
];


const Layout = ( ) =>
  <Menu className="bottom-bar-menu" fixed="bottom" text>
    {/*<Container className="image-container">
      <Grid columns={2} divided doubling className="image-row-column">
        <Grid.Row className="row-footer">
          <Grid.Column className="column-footer">
              <Header className="text-field">
                Follow our news and updates
              </Header>
              <Form>
                <Form.Group>
                  <Form.Input className="input-footer" placeholder="Email" />
                  <Form.Button className="btn-black" content="Submit" />
                </Form.Group>
              </Form>
          </Grid.Column>
          <Grid.Column className="column-footer">
            <div>
              <Header className="text-field">
                Join Smartlands
              </Header>
              <div>
                <p>Smartlands it is a unique platform for integration real economy with blockchain technology</p>
              </div>
              <Icon className="icon-telegram" />
              <Icon className="icon-slack" />
              <Icon className="icon-fb" />
              <Icon className="icon-twitter" />
              <Icon className="icon-bitcoin"/>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>*/}
    <Container className="bottom-container">
      <Grid columns={2} divided doubling className="image-row-column" >
        <Grid.Row className="row-footer">
          <Grid.Column className="column-bot">
            <Menu.Item>
              <span className="text-link">
                 <a href="mailto:contact@smartlands.io" >Contact</a>
              </span>
              <span className="text-link">
                <a href="https://smartlands.io/pdf/Terms_of_use.pdf">Terms of use</a>
              </span>
              <span className="text-link">
                <a>contact@smartlands.io</a>
              </span>
            </Menu.Item>
          </Grid.Column>
          <Grid.Column className="column-bot">
            <Menu.Item position="right">
              {navs.map((nav, index) =>
                <span key={index} className="text-link">
                  <a href={nav.href}>{nav.text}</a>
                </span>
              )}
            </Menu.Item>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </Menu>;

Layout.propTypes = {
  goDesktop: PropTypes.func.isRequired,
};

export default Layout;
