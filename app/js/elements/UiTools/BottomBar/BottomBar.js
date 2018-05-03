import React, { PropTypes } from 'react';
import { Grid, Form, Container, Icon, Menu, Button, Header } from 'semantic-ui-react';
import '../../../../styles/bottom_bar.scss';

const light = {
  color: '#bababa',
};

const navs = [
  {
    href: 'https://smartlands.io',
    text: 'smartlands.io',
  },
];

const userAgent = navigator.userAgent.toLowerCase();

const Layout = () =>
  <div className="bottom-bar-menu">
      <ul className="list">
        <li>
          <span className="text-link">
                <a href="https://smartlands.io/pdf/Wallet_Terms_of_Use.pdf" rel="noreferrer noopener" target="_blank">Terms of use</a>
              </span>
        </li>
        <li>
          <span className="text-link">
                 <a href="mailto:contact@smartlands.io" >contact@smartlands.io</a>
              </span>
        </li>
      </ul>
      <ul className="list alt">
          {navs.map((nav, index) =>
              <li key={index} className="text-link">
                  <a href={nav.href} rel="noopener noreferrer" target="_blank">{nav.text}</a>
                </li>
          )}
      </ul>
  </div>;

/*Layout.propTypes = {
  goDesktop: PropTypes.func.isRequired,
};*/

export default Layout;
