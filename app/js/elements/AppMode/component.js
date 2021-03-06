import React, { PropTypes } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

import Welcome from '../../components/views/WelcomeView';
import PrivateView from '../../components/views/PrivateView';
// import PublicView from '../../components/views/PublicView';

function AppMode({ isAccountLoading, accountSet, canSign }) {
  return (
    <div>
      <Dimmer inverted active={isAccountLoading}>
        <Loader inverted active={isAccountLoading} />
      </Dimmer>
      {
        accountSet && <PrivateView />
        // (canSign ? <PrivateView /> : <PublicView />)
      }
      {
        !accountSet && <Welcome />
      }
    </div>
  );
}

AppMode.propTypes = {
  accountSet: PropTypes.bool,
  canSign: PropTypes.bool,
  isAccountLoading: PropTypes.bool,
};

export default AppMode;
