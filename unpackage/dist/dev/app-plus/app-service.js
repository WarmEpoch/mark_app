if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$1 = {
    data() {
      return {
        local: "http://192.168.3.11:5173/",
        static: "/static/index.html",
        webView: plus.webview.create("", "webview", {
          kernelRecovery: "reload"
        })
      };
    },
    onLoad() {
      uni.request({
        url: this.local,
        timeout: 1e3
      }).then((e) => {
        if (/request:ok/.test(JSON.stringify(e))) {
          this.webView.loadURL(this.local);
        } else {
          this.webView.loadURL(this.static);
        }
      }).catch((err) => {
        this.webView.loadURL(this.static);
      }).finally(() => {
        this.webView.overrideUrlLoading({
          mode: "reject"
        }, (e) => {
          const regexp = /(.*)\/\/(.*)\/(.*)/g;
          const array = [...e.url.matchAll(regexp)];
          uni.navigateTo({
            url: `${array[0][2]}?id=${array[0][3]}`
          });
        });
        this.$scope.$getAppWebview().append(this.webView);
      });
    },
    methods: {
      async canBack() {
        return new Promise((resolve) => {
          this.webView.canBack((e) => {
            resolve(e.canBack);
          });
        });
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return null;
  }
  const PagesIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "/Users/warmepoch/Desktop/mark_app/pages/index.vue"]]);
  __definePage("pages/index", PagesIndex);
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const _sfc_main = {
    data() {
      return {
        lanzouBase: "https://muyl.lanzouq.com",
        lanzouUrl: "b068mx5rc",
        lanzouPwd: "hbl8"
      };
    },
    onLaunch: function() {
      formatAppLog("log", "at App.vue:11", "App Launch");
      {
        return false;
      }
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:45", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:48", "App Hide");
    },
    methods: {
      async Lanzou(id) {
        const header = {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
          "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0"
        };
        const _data = await uni.request({
          url: `${this.lanzouBase}/${id}`,
          header
        }).then((res) => res[1].data);
        const desc = [..._data.matchAll(/文件描述：<\/span><br>\n([\s\S]*?)\s*?<\/td>/g)][0][1].replaceAll(
          "<br />",
          ""
        );
        const iframeUrl = [..._data.matchAll(/iframe.*src="(.*)"\sframeborder/g)][1][1];
        const _iframe = await uni.request({
          url: `${this.lanzouBase}/${iframeUrl}`,
          header
        }).then((res) => res[1]["data"]);
        const actionValue = [..._iframe.matchAll(/'action':'(.*?)',/g)][0][1];
        const signValue = [..._iframe.matchAll(/'sign':'(.*?)',/g)][0][1];
        const signsValue = [..._iframe.matchAll(/'signs':(.*?),/g)][0][1];
        const signsReg = new RegExp(signsValue + "\\s=\\s'(.*)'", "g");
        const websignValue = [..._iframe.matchAll(/'websign':(.*?),/g)][0][1];
        const websignReg = new RegExp(websignValue + "\\s=\\s'(.*)'", "g");
        const websignkeyValue = [..._iframe.matchAll(/'websignkey':(.*?),/g)][0][1];
        const websignkeyReg = new RegExp(websignkeyValue + "\\s=\\s'(.*)'", "g");
        const data = {
          "action": actionValue,
          "signs": [..._iframe.matchAll(signsReg)][0][1],
          "sign": signValue,
          "websign": [..._iframe.matchAll(websignReg)][0][1],
          "websignkey": [..._iframe.matchAll(websignkeyReg)][0][1],
          "ves": 1
        };
        const downprocess = await uni.request({
          url: `${this.lanzouBase}/ajaxm.php`,
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": `${this.lanzouBase}/${iframeUrl}`
          },
          data
        }).then((res) => res[1].data);
        const downUrl = `${downprocess.dom}/file/${downprocess.url}`;
        return {
          desc,
          downUrl
        };
      },
      async LanzouMore(id, pwd, type) {
        const _data = await uni.request({
          url: `${this.lanzouBase}/${id}`
        }).then((res) => res[1].data);
        const tValue = [..._data.matchAll(/'t':(.*),/g)][0][1];
        const kValue = [..._data.matchAll(/'k':(.*),/g)][0][1];
        const tReg = new RegExp(tValue + "\\s=\\s'(.*)'", "g");
        const kReg = new RegExp(kValue + "\\s=\\s'(.*)'", "g");
        const data = {
          "lx": "2",
          "fid": "9057744",
          "pg": "1",
          "t": [..._data.matchAll(tReg)][0][1],
          "k": [..._data.matchAll(kReg)][0][1],
          "pwd": pwd
        };
        const more = await uni.request({
          url: `${this.lanzouBase}/filemoreajax.php`,
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data
        }).then((res) => res[1].data);
        if (more.info !== "sucess") {
          return [];
        }
        const json = [];
        more.text.forEach((item) => {
          if (item.icon == type) {
            json.push({
              id: item.id,
              type: item.icon,
              name: item.name_all,
              version: item.name_all.split(".")[1]
            });
          }
        });
        json.sort((a, b) => a.version > b.version ? -1 : 1);
        return json;
      }
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "/Users/warmepoch/Desktop/mark_app/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
