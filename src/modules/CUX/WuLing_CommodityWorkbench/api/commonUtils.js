// 6: left; 8:right; 3: 2*right
function rotateImg(img, direction, canvas) {
  //最小与最大旋转方向，图片旋转4次后回到原方向
  let minStep = 0;
  let maxStep = 3;
  //var img = document.getElementById(pid);
  if (!img) { return; }
  //img的高度和宽度不能在img元素隐藏后获取，否则会出错
  let height = img.height;
  let width = img.width;
  // console.log('imag-原始宽高', width, height)
  //var step = img.getAttribute('step');
  let step = 2;
  if (step < minStep) {
    step = minStep;
  }
  if (direction === "right") {
    step++;
    //旋转到原位置，即超过最大值
    step > maxStep && (step = minStep);
  } else {
    step--;
    step < minStep && (step = maxStep);
  }
  //旋转角度以弧度值为参数
  let degree = step * 90 * Math.PI / 180; // 0: 0; 1: PI/2； 2: PI; 3/2 PI(270)
  let ctx = canvas.getContext("2d");
  // console.log('step', step)
  switch (step) {
    case 0:
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0);
      break;
    case 1: // 顺时针旋转90度
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(degree);
      ctx.drawImage(img, 0, -height);
      break;
    case 2: // // 顺时针旋转180度
      canvas.width = width;
      canvas.height = height;
      ctx.rotate(degree);
      ctx.drawImage(img, -width, -height);
      break;
    case 3: // // 顺时针旋转270度
      canvas.width = height;
      canvas.height = width;
      ctx.rotate(degree);
      ctx.drawImage(img, -width, 0);
      break;
    default: break;
  }
}

export { rotateImg };