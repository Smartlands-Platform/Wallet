export default function Trigger() {
    let nextIndex = 0;
    let listeners = [];
    this.listen = cb => {
        const listenerId = nextIndex;
        listeners[listenerId] = cb;
        nextIndex += 1;
        return listenerId;
    };
    this.sub = cb => {
        const listenerId = nextIndex;
        listeners[listenerId] = cb;
        nextIndex += 1;
        return () => {
            this.unlisten(listenerId)
        }
    };
    this.unlisten = listenerId => {
        if (!isFinite(listenerId)) {
            throw new Error('Listener ID must be a number');
        }
        if (listenerId > nextIndex) {
            throw new Error('Listener ID out of range');
        }
        listeners[listenerId] = null;
    };
    this.trigger = (data) => {
        listeners.forEach(cb => {
            if (cb) {
                cb(data);
            }
        })
    };
}
