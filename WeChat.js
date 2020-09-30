var { App, Utils } = require("./common.js");

function WeChat() {
  // extends
  App.call(this, "微信");

  this.startedActivity = "com.tencent.mm.ui.LauncherUI";
}

// extends
WeChat.prototype = Object.create(App.prototype);
WeChat.prototype.constructor = WeChat;

/**
 * 重写 App.start
 */
WeChat.prototype.start = function () {
  launchApp(this.appName);
  waitForActivity(this.startedActivity);
};

/**
 * 进入指定会话
 * @param {*} chatName 会话名
 * @param {*} i 搜索结果顺序
 */
WeChat.prototype.enterChat = function (chatName, i) {
  i = i || 1;
  if (!Utils.clickSelectCenter(text("通讯录")))
    throw new Error("点击通讯录失败");

  const searchIcon = Utils.path("imgs/wx_search.png");
  if (!Utils.clickImgOnScreen(searchIcon))
    throw new Error("点击搜索 Icon 失败");

  const searchInput = text("搜索").findOne(2000);
  if (!searchInput) throw new Error("未找到搜索框");

  if (!Utils.clickCenter(searchInput)) throw new Error("点击搜索框失败");
  sleep(1000);
  if (!searchInput.setText(chatName)) throw new Error("输入关键词失败");
  sleep(3000);

  const searchResults = text(chatName).find();
  if (searchResults.length === 1) throw new Error("未找到搜索结果");

  // 进入会话
  const result = searchResults.get(i).parent();
  if (!result || !Utils.clickCenter(result)) throw new Error("进入会话失败");

  return true;
};

module.exports = {
  WeChat: WeChat,
};
