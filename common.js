const MIN_RANDOM_SLEEP = 1000;
const MAX_RANDOM_SLEEP = 10000;

originToast = toast;
toast = function (args) {
  log("tosas: ", args);
  originToast(args);
};

/**
 * App
 * @param {*} name
 */
function App(name) {
  this.appName = name;
  this.packageName = getPackageName(name);
}

App.prototype.start = function () {
  return launchApp(this.appName);
};

App.prototype.kill = function () {
  const res = shell("am force-stop " + this.packageName, true);
  sleep(1000);
  return res.code === 0;
};

App.prototype.restart = function () {
  this.kill();
  sleep(2000);
  return this.start();
};

App.prototype.clear = function () {
  Utils.clearApps();
  this.kill();
};

var Utils = {
  km: context.getSystemService(context.KEYGUARD_SERVICE),

  path(val) {
    return "/storage/emulated/0/脚本/" + val;
  },

  dateString() {
    const now = new Date();
    const years = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const milliSeconds = now.getMilliseconds();
    return (
      years +
      "-" +
      month +
      "-" +
      date +
      "_" +
      hours +
      ":" +
      minutes +
      ":" +
      seconds +
      ":" +
      milliSeconds
    );
  },

  curScriptFilename() {
    return engines.myEngine().source.toString().replace(this.path(), "");
  },

  /**
   * 初始化
   */
  setUp() {
    this.unlockDevice("123456");
    auto.waitFor();
    if (!requestScreenCapture()) {
      toast("请求截图失败");
      exit();
    }

    // 运行期间屏幕常亮
    device.keepScreenOn();

    // 设置 click 缩放
    setScreenMetrics(1080, 2250);

    toast(
      this.dateString() + " 开始执行 [" + this.curScriptFilename() + "]..."
    );
    this.clearApps();

    // 脚本结束
    events.on("exit", function () {
      device.cancelKeepingAwake();
      toast("结束运行");
    });
  },

  /**
   * 清除最近任务
   */
  clearApps() {
    sleep(1000);
    toast("清理最近任务");
    home();
    sleep(1000);

    recents();
    this.clickSelectCenter(id("clearAnimView"));
    home();
    sleep(1000);
  },

  /**
   * 设备锁定状态
   */
  isLocked() {
    return this.km.inKeyguardRestrictedInputMode();
  },

  /**
   *
   */
  isKeyguardSecure() {
    return this.km.isKeyguardSecure();
  },

  /**
   * 解锁设备
   * @param {*} passwd
   */
  unlockDevice(passwd) {
    if (!this.isLocked()) {
      toast("设备未锁定");
      home();
      return true;
    }

    device.wakeUp();
    sleep(2000);

    // 滑动页面
    gesture(320, [540, device.height * 0.9], [540, device.height * 0.1]);
    sleep(2000);

    // 输入密码
    if (this.isKeyguardSecure()) {
      for (let i = 0; i < passwd.length; i++) {
        this.clickSelectCenter(text(passwd[i]), 100, 100);
      }
    }

    sleep(2000);
    if (this.isLocked()) {
      log("设备解锁失败");
      back();
      return false;
    } else {
      toast("设备已解锁");
      return true;
    }
  },

  /**
   * 随机延时
   */
  rSleep(min, max) {
    min = min || MIN_RANDOM_SLEEP;
    max = max || MAX_RANDOM_SLEEP;

    var r = random(min, max);
    toast("随机延时: " + r + "ms");
    sleep(r);
  },

  /**
   * 点击控件的中心位置
   */
  clickCenter(widget) {
    if (!widget) return false;
    let rect = widget.bounds();
    return click(rect.centerX(), rect.centerY());
  },

  /**
   * 点击 selector 中心
   * 默认 5s 超时
   * 延迟 1s
   */
  clickSelectCenter(selector, timeout, delay) {
    if (!selector) return false;
    timeout = timeout || 5 * 1000;
    delay = delay || 1000;

    const widget = selector.findOne(timeout);
    delay && sleep(delay);
    return this.clickCenter(widget);
  },

  /**
   * 当前屏幕找图
   *
   * @param {*} path 图片路径
   * @returns
   */
  findImgOnScreen(path, options) {
    const screen = captureScreen();
    const target = images.read(path);
    const w = target.getWidth();
    const h = target.getHeight();
    images.save(screen, Utils.path("tmp/findImgOnScreen.png"));

    const point = findImage(screen, target, options);
    target = screen = null;
    return point ? { x: point.x, y: point.y, w: w, h: h } : false;
  },

  /**
   * 找到并点击当前屏幕上的图片
   */
  clickImgOnScreen(path, options) {
    const point = this.findImgOnScreen(path, options);
    if (!point) return log("未找到: " + path);

    const { x, y, w, h } = point;
    return click(x + parseInt(w / 2), y + parseInt(h / 2));
  },

  /**
   * 裁切并保存当前屏幕
   */
  clipScreenSave(x, y, w, h, path) {
    const screen = captureScreen();
    var clip = images.clip(screen, x, y, w, h);
    images.save(clip, path);
    toast("Clip and save success.");
  },

  /**
   * 截屏并保存
   */
  saveScreen(path) {
    sleep(1000);
    const screen = captureScreen();
    images.save(screen, path);
  },
};

module.exports = {
  App: App,
  Utils: Utils,
};
