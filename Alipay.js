var { App } = require("./common.js");

function Alipay() {
  // extends
  App.call(this, "支付宝");

  this.startedActivity = "com.eg.android.AlipayGphone.AlipayLogin";
}

// extends
Alipay.prototype = Object.create(App.prototype);
Alipay.prototype.constructor = Alipay;

/**
 * 重写 App.start
 */
Alipay.prototype.start = function () {
  launchApp(this.appName);
  waitForActivity(this.startedActivity);
  sleep(5000);
};

module.exports = {
  Alipay: Alipay,
};
