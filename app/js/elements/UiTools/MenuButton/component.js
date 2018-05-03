import React, { PropTypes } from 'react';
import passiveIcon from '../../../../../content/assets/images/vector-smart-object-1.png';
import activeIcon from '../../../../../content/assets/images/menu-hover.png';
import '../../../../styles/top_bar.scss'


class MenuButton extends React.Component {

  constructor(props) {
    super(props);

  }

  toggleButton(){
    if (!this.props.toggle){
      this.props.openNavigation();
    } else {
      this.props.closeNavigation()
    }
  }


  render() {
    return (
      <button className="menu-button" onClick={::this.toggleButton}>
        {this.props.toggle ? <img className="first-button" src={activeIcon} /> : <img className="second-button" alt="Button" src={passiveIcon} />}</button>
    );
  }
}

MenuButton.propTypes = {
  toggle: React.PropTypes.bool,
  openNavigation: PropTypes.func.isRequired,
  closeNavigation: PropTypes.func.isRequired,
}
export default MenuButton;