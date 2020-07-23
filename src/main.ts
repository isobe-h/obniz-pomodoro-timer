import Obniz from 'obniz';
import { createCanvas } from 'canvas';

const OBNIZ_ID:string = '4666-2889';
const obniz = new Obniz(OBNIZ_ID);
var isBreaktime:boolean = false;
const initTime = (min: number = 25, sec: number = 0) => {
  var timer = new Date();
  timer.setMinutes(min);
  timer.setSeconds(sec);
  return timer;
}
var mainTimer: Date = initTime();

obniz.onconnect = async () => {
  var interval = setInterval(async() => {
    obniz.display?.clear();
    mainTimer.setSeconds(mainTimer.getSeconds() - 1);
    obniz.display?.draw(getNewDateCanvas(formatDate(mainTimer)));
    if (mainTimer.getSeconds() === 0 && mainTimer.getMinutes() === 0 && !isBreaktime) {
      mainTimer = initTime(5, 1);
      isBreaktime = true;
    } else if (mainTimer.getSeconds() === 0 && mainTimer.getMinutes() === 0 && isBreaktime) {
      mainTimer = initTime();
      isBreaktime = false;
    }
    var state = await obniz.switch?.getWait();
    console.log(state?.toString());
    if (state === 'push') {
      clearInterval(interval);
    } else if (state === 'left') {
      interval.refresh();
    } else if (state === 'right') {
      mainTimer = initTime(0, 0);
    }
  }, 1000);
};

const getNewDateCanvas = (contents: string) =>
{
  var canvas = createCanvas(128, 64);
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = "white";
  ctx.font = "50px Avenir";
  ctx.fillText(contents, 0, 50);
  return ctx;
}
const formatDate = (date: Date, format: string = 'mm:ss') =>
{
  return format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
    .replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
};