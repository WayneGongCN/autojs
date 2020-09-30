(function () {
  const { Utils } = require("./common.js");
  const { WeChat } = require("./WeChat.js");

  Utils.setUp();

  const wx = new WeChat();
  wx.restart();

  if (!wx.enterChat("招商银行信用卡")) return false;

  if (!Utils.clickSelectCenter(textContains("领积分")))
    throw new Error("点击菜单失败");

  if (!Utils.clickSelectCenter(textContains("签到领积分")))
    throw new Error("点击子菜单失败");

  // 点击签到按钮
  sleep(10000);
  click(540, 450);

  sleep(2000);
  toast("签到完成");

  Utils.saveScreen(
    Utils.path(
      "tmp/" + Utils.curScriptFilename() + "_" + Utils.dateString() + ".png"
    )
  );
  wx.clear();
})();
