(function () {
  console.show();

  threads.start(function () {
    buy(1);
  });

  threads.start(function () {
    buy(2);
  });

  threads.start(function () {
    buy(3);
  });
})();



function buy(thread) {
  var i = 0;
  while (true) {
    if (textContains("支付剩余时间").findOnce()) return log("线程 " + thread + " 抢购成功");
    if (textContains("抢完").findOnce()) return log("线程 " + thread + " 抢购失败");

    log("线程 " + thread + " 第 " + (++i) + "次尝试");

    var buyBtn =
      text("立即抢购").findOnce() ||
      text("提交订单").findOnce() ||
      text("知道了").findOnce();

    if (buyBtn) {
      log("线程 " + thread + " 找到并点击 " + buyBtn.text());
      clickCenter(buyBtn)
      buyBtn.click()
    }
  }
}


function clickCenter(widget) {
  if (!widget) return false;

  const rect = widget.bounds();
  const [x, y] = [rect.centerX(), rect.centerY()];
  log("clickCenter: ", x, y);

  return click(x, y);
}