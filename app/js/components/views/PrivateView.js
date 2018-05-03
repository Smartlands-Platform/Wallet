import React from 'react';

import TopBar from '../../elements/UiTools/TopBar';
import BottomBar from '../../elements/UiTools/BottomBar';
import TabsPanel from '../../elements/UiTools/TabsPanel';

const PrivateView = () => (
    <div className="pages-container">
        <TopBar/>
        <TabsPanel/>
        <BottomBar/>
    </div>
);

export default PrivateView;
