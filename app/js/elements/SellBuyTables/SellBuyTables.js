import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../../../styles/style.scss'

class SellBuyTables extends Component {
    render() {
        return (
            <div style={{width: 100 + "%"}}>
                <div className="island__sub__division" style={{width: 100 + "%"}}>
                    <h3 className="island__sub__division__title">Buy offers</h3>
                    <div className="OfferTable">
                        <div className="OfferTable__header">
                            <div className="OfferTable__header__item OfferTable__cell--depth">Sum XLM</div>
                            <div className="OfferTable__header__item OfferTable__cell--amount">XLM</div>
                            <div className="OfferTable__header__item OfferTable__cell--amount">SLT</div>
                            <div className="OfferTable__header__item OfferTable__cell--price">Price</div>
                        </div>
                        <div className="OfferTable__table">
                            <div className="OfferTable__row">
                                <div className="OfferTable__row__item OfferTable__cell--depth">1,511</div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">1,511.4<span className="lightenZeros__unemph">000000</span></span>
                                </div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">300<span className="lightenZeros__unemph">.0000000</span></span>
                                </div>
                                <div className="OfferTable__row__item OfferTable__cell--price"><span className="lightenZeros">5.038<span className="lightenZeros__unemph">0</span></span>
                                </div>
                            </div>
                            <div className="OfferTable__row" >
                                <div className="OfferTable__row__item OfferTable__cell--depth">2,411</div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">900.0000001</span></div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">178.6423184</span></div>
                                <div className="OfferTable__row__item OfferTable__cell--price"><span className="lightenZeros">5.038<span className="lightenZeros__unemph">0</span></span>
                                </div>
                            </div>
                            <div className="OfferTable__row" >
                                <div className="OfferTable__row__item OfferTable__cell--depth">2,465</div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">53.8602682</span></div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">10.7056784</span></div>
                                <div className="OfferTable__row__item OfferTable__cell--price"><span className="lightenZeros">5.031<span className="lightenZeros__unemph">0</span></span>
                                </div>
                            </div>
                            <div className="OfferTable__row" >
                                <div className="OfferTable__row__item OfferTable__cell--depth">4,980</div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">2,515<span className="lightenZeros__unemph">.0000000</span></span>
                                </div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">500<span className="lightenZeros__unemph">.0000000</span></span>
                                </div>
                                <div className="OfferTable__row__item OfferTable__cell--price"><span className="lightenZeros">5.03<span className="lightenZeros__unemph">00</span></span>
                                </div>
                            </div>
                            <div className="OfferTable__row" >
                                <div className="OfferTable__row__item OfferTable__cell--depth">5,480</div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">500<span className="lightenZeros__unemph">.0000000</span></span>
                                </div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">100<span className="lightenZeros__unemph">.0000000</span></span>
                                </div>
                                <div className="OfferTable__row__item OfferTable__cell--price"><span className="lightenZeros">5<span className="lightenZeros__unemph">.0000</span></span>
                                </div>
                            </div>
                            <div className="OfferTable__row" >
                                <div className="OfferTable__row__item OfferTable__cell--depth">6,309</div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">828.9999999</span></div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">167.440921<span className="lightenZeros__unemph">0</span></span>
                                </div>
                                <div className="OfferTable__row__item OfferTable__cell--price"><span className="lightenZeros">4.951<span className="lightenZeros__unemph">0</span></span>
                                </div>
                            </div>
                            <div className="OfferTable__row" >
                                <div className="OfferTable__row__item OfferTable__cell--depth">8,451</div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">2,141.69<span className="lightenZeros__unemph">00000</span></span>
                                </div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">434.4198783</span></div>
                                <div className="OfferTable__row__item OfferTable__cell--price"><span className="lightenZeros">4.93<span className="lightenZeros__unemph">00</span></span>
                                </div>
                            </div>
                            <div className="OfferTable__row" >
                                <div className="OfferTable__row__item OfferTable__cell--depth">8,929</div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">478.0987686</span></div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">97.3724163</span></div>
                                <div className="OfferTable__row__item OfferTable__cell--price"><span className="lightenZeros">4.91<span className="lightenZeros__unemph">00</span></span>
                                </div>
                            </div>
                            <div className="OfferTable__row" >
                                <div className="OfferTable__row__item OfferTable__cell--depth">9,322</div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">392.8<span className="lightenZeros__unemph">000000</span></span>
                                </div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">80<span className="lightenZeros__unemph">.0000000</span></span>
                                </div>
                                <div className="OfferTable__row__item OfferTable__cell--price"><span className="lightenZeros">4.91<span className="lightenZeros__unemph">00</span></span>
                                </div>
                            </div>
                            <div className="OfferTable__row" >
                                <div className="OfferTable__row__item OfferTable__cell--depth">9,812</div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">490.2<span className="lightenZeros__unemph">000000</span></span>
                                </div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">100<span className="lightenZeros__unemph">.0000000</span></span>
                                </div>
                                <div className="OfferTable__row__item OfferTable__cell--price"><span className="lightenZeros">4.902<span className="lightenZeros__unemph">0</span></span>
                                </div>
                            </div>
                            <div className="OfferTable__row" >
                                <div className="OfferTable__row__item OfferTable__cell--depth">12,218</div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">2,405.55<span className="lightenZeros__unemph">00000</span></span>
                                </div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">500<span className="lightenZeros__unemph">.0000000</span></span>
                                </div>
                                <div className="OfferTable__row__item OfferTable__cell--price"><span className="lightenZeros">4.8111</span></div>
                            </div>
                            <div className="OfferTable__row" >
                                <div className="OfferTable__row__item OfferTable__cell--depth">13,947</div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">1,729.22794<span className="lightenZeros__unemph">00</span></span>
                                </div>
                                <div className="OfferTable__row__item OfferTable__cell--amount"><span className="lightenZeros">359.5068333</span></div>
                                <div className="OfferTable__row__item OfferTable__cell--price"><span className="lightenZeros">4.81<span className="lightenZeros__unemph">00</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}



export default SellBuyTables;
