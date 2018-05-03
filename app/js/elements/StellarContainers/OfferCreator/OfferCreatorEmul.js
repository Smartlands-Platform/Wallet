import React, {Component} from 'react';
import '../../../../styles/style.scss';
export default class SellBuy extends Component{
    render(){
        return(

                <div className="OfferMakers island__sub" style={{width: 100 + "%"}}>
                    <div className="OfferMakers_maker island__sub__division"><div>
                        <h3 className="island__sub__division__title island__sub__division__title--left">Buy SLT using XLM</h3>
                        <form disabled="">
                            <table className="OfferMaker__table">
                            <tbody>
                            <tr className="OfferMaker__table__row">
                                <td className="OfferMaker__table__label">Price</td>
                                <td className="OfferMaker__table__input">
                                    <label className="OfferMaker__table__input__group">
                                        <input type="text" className="OfferMaker__table__input__input" value="4.8600004" placeholder="" />
                                        <div className="OfferMaker__table__input__group__tag">XLM</div>
                                    </label>
                                </td>
                            </tr>
                            <tr className="OfferMaker__table__row">
                                <td className="OfferMaker__table__label">Amount</td>
                                <td className="OfferMaker__table__input">
                                    <label className="OfferMaker__table__input__group">
                                        <input type="text" className="OfferMaker__table__input__input" value="" placeholder=""/>
                                        <div className="OfferMaker__table__input__group__tag">SLT</div>
                                    </label>
                                </td>
                            </tr>
                            <tr className="OfferMaker__table__row">
                                <td className="OfferMaker__table__label">Total</td>
                                <td className="OfferMaker__table__input">
                                    <label className="OfferMaker__table__input__group">
                                        <input type="text" className="OfferMaker__table__input__input" value="" placeholder="" />
                                        <div className="OfferMaker__table__input__group__tag">XLM</div>
                                    </label>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                            <div className="OfferMaker__overview">
                                <span className="OfferMaker__message">
                                    <a href="#account">Log in</a> to create an offer</span>
                            </div>
                        </form>
                    </div>
                    </div>
                    <div className="OfferMakers_maker island__sub__division">
                        <div>
                            <h3 className="island__sub__division__title island__sub__division__title--left">Sell SLT for XLM</h3>
                            <form disabled="">
                                <table className="OfferMaker__table">
                                    <tbody>
                                    <tr className="OfferMaker__table__row">
                                        <td className="OfferMaker__table__label">Price</td>
                                        <td className="OfferMaker__table__input">
                                            <label className="OfferMaker__table__input__group">
                                                <input type="text" className="OfferMaker__table__input__input" value="4.96999" placeholder="" />
                                                <div className="OfferMaker__table__input__group__tag">XLM</div>
                                            </label>
                                        </td>
                                    </tr>
                                    <tr className="OfferMaker__table__row">
                                        <td className="OfferMaker__table__label">Amount</td>
                                        <td className="OfferMaker__table__input">
                                            <label className="OfferMaker__table__input__group">
                                            <input type="text" className="OfferMaker__table__input__input" value="" placeholder=""/>
                                            <div className="OfferMaker__table__input__group__tag">SLT</div>
                                        </label>
                                        </td>
                                    </tr>
                                    <tr className="OfferMaker__table__row">
                                        <td className="OfferMaker__table__label">Total</td>
                                        <td className="OfferMaker__table__input">
                                            <label className="OfferMaker__table__input__group">
                                            <input type="text" className="OfferMaker__table__input__input" value="" placeholder="" />
                                                <div className="OfferMaker__table__input__group__tag">XLM</div>
                                            </label>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="OfferMaker__overview">
                                <span className="OfferMaker__message">
                                <a href="#account">Log in</a> to create an offer</span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        );
    }
}