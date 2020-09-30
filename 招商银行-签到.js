!(function () {
  const { App, Utils } = require("./common.js");
  Utils.setUp();

  const passwd = "123456";
  const appInstance = new App("招商银行");
  appInstance.restart();

  if (!Utils.clickSelectCenter(text("我的"), 10 * 1000))
    throw new Error("进入个人中心错误");

  if (!text("登录").findOne(2000)) throw new Error("进入登录页面错误");
  for (let i = 0; i < passwd.length; i++) {
    if (!Utils.clickSelectCenter(text(passwd[i])))
      throw new Error("输入密码错误");
  }

  if (!Utils.clickSelectCenter(text("登录"))) throw new Error("登录错误");
  sleep(2000); // 登录 loading

  if (!Utils.clickSelectCenter(text("积分")))
    throw new Error("进入积分页面错误");

  if (!Utils.clickSelectCenter(text("签到")))
    throw new Error("进入签到页面错误");

  if (!Utils.clickSelectCenter(text("签到领积分"))) throw new Error("签到错误");

  // 点击签到按钮
  sleep(10000);
  click(550, 1420);

  sleep(2000);
  toast("签到完成");

  Utils.saveScreen(
    Utils.path(
      "tmp/" + Utils.curScriptFilename() + "_" + Utils.dateString() + ".png"
    )
  );
  appInstance.clear();
})();
