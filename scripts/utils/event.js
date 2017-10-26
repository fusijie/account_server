/**
 * Created by Jacky on 2017/10/25.
 */

let events = require('events');
let util = require('util');

function MyEvent() {
    events.EventEmitter.call(this);
}
util.inherits(MyEvent, events.EventEmitter);

let myEvent = new MyEvent();
myEvent.setMaxListeners(50);

module.exports = myEvent;