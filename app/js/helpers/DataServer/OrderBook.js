import ParseData from './DataFromAPI';
import Trigger from './Trigger';

export default function Orderbook(driver) {
    this.event = new Trigger();
    const init = () => {
        this.data = {
            ready: false,
        };
    };
    init();
    this.handlers = {
        pickPrice: (price) => {
            this.event.trigger({
                pickPrice: price,
            });
        },
        setOrderbook: (baseBuying, counterSelling, limit) => {
            if (this.data.ready && this.data.baseBuying.equals(baseBuying) && this.data.counterSelling.equals(counterSelling)) {
                return;
            }
            if (this.data.close) {
                this.data.close();
            }

            this.data = new ParseData.Orderbook(driver.Server, baseBuying, counterSelling, () => {
                this.event.trigger();
                driver.session.updateAccountOffers();
            }, limit);


        },
    };
}