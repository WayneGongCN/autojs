!function () {
  var { App, Utils } = require("./common.js");
  Utils.setUp();

  const passwd = "123456";
  const appInstance = new App("掌上生活");
  appInstance.restart();

  if(!Utils.clickSelectCenter(text("我的"), 10 * 1000)) throw new Error('进入个人中心错误')
  sleep(2000);

  if(!Utils.clickImgOnScreen(Utils.path("imgs/zssh_signin.png"))) throw new Error('点击签到按钮错误');

  if(!text("下一步").findOne(2000)) throw new Error('进入登录页面错误');

  // 输入密码（以图找图）
  const screen = captureScreen();
  for (let i = 0; i < passwd.length; i++) {
    var imgPath = "imgs/zssh_num_" + passwd[i] + ".png";
    var target = images.read(Utils.path(imgPath));
    var point = findImage(screen, target);
    target = null;

    if (!point) {
      throw new Error('安全键盘识别失败')
    } else {
      if(!click(point.x, point.y)) throw new Error('输入密码错误');
    }
  }
  screen = null;
  if(!Utils.clickSelectCenter(text("下一步"))) throw new Error('登录错误');

  // 点击签到按钮
  sleep(5000);
  click(540, 540);

  // if(!text("签到成功").findOne(2000)) throw new Error('签到失败');
  toast("签到完成");

  Utils.saveScreen(
    Utils.path(
      "tmp/" + Utils.curScriptFilename() + "_" + Utils.dateString() + ".png"
    )
  );
  appInstance.clear();
};()

// 安全键盘截图
// function getNumberKeybord(start, end) {
//   const screen = captureScreen();
//   var width = end[0] - start[0];
//   var height = end[1] - start[1];
//   var lineHeight = height / 3;
//   var colWeight = width / 3;

//   var keybordMap = {};
//   for (let i = 0; i < 12; i++) {
//     sleep(500);
//     var row = parseInt(i / 3);
//     var col = i % 3;
//     var x = start[0] + col * colWeight;
//     var y = start[1] + row * lineHeight;
//     var clip = images.clip(screen, x, y, colWeight, lineHeight);
//     images.save(
//       clip,
//       Utils.path("zssh_num_" + i + ".png")
//     );
//   }
//   return keybordMap;
// }
// getNumberKeybord([0, 1550], [device.width, 2040]);
