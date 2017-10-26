/**
 * Created by Jacky on 2017/10/26.
 */

let ajax = {
    get: function (url, params, cb) {
        this.send(url, 'GET', params, cb);
    },

    post: function (url, params, cb) {
        this.send(url, 'POST', params, cb);
    },

    send: function (url, method, params, cb) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let data = xhr.responseText;
                try {
                    data = JSON.parse(data);
                } catch (exc) {
                }
                if (cb) {
                    cb(data);
                }
            }
        };

        let body;
        if (params) {
            let bodies = [];
            for (let name in params) {
                bodies.push(name + '=' + encodeURIComponent(params[name]));
            }

            body = bodies.join('&');
            if (body.length) {
                xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            }
        }

        xhr.send(body);
    },

    getJSON: function (url, params, cb) {
        let pairs = ['callback=jsonp'];
        for (let key in params) {
            if (params.hasOwnProperty(key)) {
                pairs[pairs.length] = key + '=' + params[key];
            }
        }
        if (pairs.length) {
            url = url + (url.indexOf('?') === -1 ? '?' : '&') + pairs.join('&');
        }

        function jsonpReturn(o) {
            self.jsonp = undefined;
            if (!o || o.error) {
                if (cb) cb(o);
            } else {
                if (cb) cb(0, o);
            }
        }

        self.jsonp = jsonpReturn;

        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                eval(xhr.responseText);
                self.jsonp = null;
            }
        };
        xhr.send("");
    },

    postJSON: function (url, params, cb) {
        this.post(url, params, function (data) {
            let result = eval(data);
            cb(0, result);
        });
    },
};

module.exports = ajax;