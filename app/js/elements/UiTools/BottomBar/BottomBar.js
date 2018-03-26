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

const userAgent = navigator.userAgent.toLowerCase();

const Layout = () =>
  <Menu className="bottom-bar-menu" fixed="bottom" text>
      {userAgent.indexOf(' electron/') === -1 && (<Container className="bottom-container">
        <Grid columns={2} divided doubling className="image-row-column" >
          <Grid.Row className="row-footer">
            <Grid.Column className="column-bot">
              <Menu.Item>
              <span className="text-link">
                 <a href="mailto:contact@smartlands.io" >Contact</a>
              </span>
                <span className="text-link">
                <a href="https://smartlands.io/pdf/Terms_of_use.pdf" rel="noreferrer noopener" target="_blank">Terms of use</a>
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
                  <a href={nav.href} rel="noopener noreferrer" target="_blank">{nav.text}</a>
                </span>
                  )}
              </Menu.Item>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>)}
  </Menu>;

Layout.propTypes = {
  goDesktop: PropTypes.func.isRequired,
};

export default Layout;
