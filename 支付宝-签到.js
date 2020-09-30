!(function () {
  const { Utils } = require("./common.js");
  const { Alipay } = require("./Alipay.js");
  Utils.setUp();

  const alipay = new Alipay();
  alipay.restart();

  if (!Utils.clickSelectCenter(text("我的"), 10 * 1000))
    throw new Error("点击“我的”错误");

  // 点击 “支付宝会员” 进入签到页面
  sleep(2000);
  click(100, 530);

  if (!Utils.clickSelectCenter(text("领积分")))
    throw new Error("点击“领积分”错误");

  if (!Utils.clickSelectCenter(text("点击领取")))
    throw new Error("点击“领取积分”错误");

  sleep(2000);
  toast("签到完成");

  Utils.saveScreen(
    Utils.path(
      "tmp/" + Utils.curScriptFilename() + "_" + Utils.dateString() + ".png"
    )
  );
  alipay.clear();
})();
