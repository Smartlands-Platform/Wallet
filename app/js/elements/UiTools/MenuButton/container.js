import { connect } from 'react-redux';
import Component from './component';

import { toggleNavigation } from '../../../actions/ui';
import {toggleNav} from "js/selectors/ui";

const mapStateToProps = state => ({
  toggle: toggleNav(state),
});

const mapDispatchToProps = dispatch => ({
  openNavigation: () => dispatch(toggleNavigation(true)),
  closeNavigation: () => dispatch(toggleNavigation(false)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Component);