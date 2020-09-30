!(function () {
  var { App, Utils } = require("./common.js");

  const appInstance = new App("什么值得买");
  appInstance.restart();

  if (!Utils.clickSelectCenter(text("我的"), 10 * 1000))
    throw new Error("进入个人中心失败");

  if (!Utils.clickSelectCenter(text("签到领奖")))
    throw new Error("点击签到按钮失败");

  // if (!id("iv_close").findOne(2000)) throw new Error("签到失败");
  toast("签到完成");

  Utils.saveScreen(
    Utils.path(
      "tmp/" + Utils.curScriptFilename() + "_" + Utils.dateString() + ".png"
    )
  );

  appInstance.clear();
})();
