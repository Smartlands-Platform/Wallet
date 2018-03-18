import React, { PropTypes } from 'react';

import ErrorModal from '../elements/UiTools/ErrorModal';

const Layout = ({ children }) =>
  <div className="layout-container">
    {children}
    <ErrorModal />
  </div>;

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
