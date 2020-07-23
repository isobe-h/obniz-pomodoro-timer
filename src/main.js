"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const obniz_1 = __importDefault(require("obniz"));
const canvas_1 = require("canvas");
const OBNIZ_ID = '4666-2889';
const obniz = new obniz_1.default(OBNIZ_ID);
var isBreaktime = false;
const initTime = (min = 25, sec = 0) => {
    var timer = new Date();
    timer.setMinutes(min);
    timer.setSeconds(sec);
    return timer;
};
var mainTimer = initTime();
obniz.onconnect = () => __awaiter(void 0, void 0, void 0, function* () {
    var interval = setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        (_a = obniz.display) === null || _a === void 0 ? void 0 : _a.clear();
        mainTimer.setSeconds(mainTimer.getSeconds() - 1);
        (_b = obniz.display) === null || _b === void 0 ? void 0 : _b.draw(getNewDateCanvas(formatDate(mainTimer)));
        if (mainTimer.getSeconds() === 0 && mainTimer.getMinutes() === 0 && !isBreaktime) {
            mainTimer = initTime(5, 1);
            isBreaktime = true;
        }
        else if (mainTimer.getSeconds() === 0 && mainTimer.getMinutes() === 0 && isBreaktime) {
            mainTimer = initTime();
            isBreaktime = false;
        }
        var state = yield ((_c = obniz.switch) === null || _c === void 0 ? void 0 : _c.getWait());
        console.log(state === null || state === void 0 ? void 0 : state.toString());
        if (state === 'push') {
            clearInterval(interval);
        }
        else if (state === 'left') {
            interval.refresh();
        }
        else if (state === 'right') {
            mainTimer = initTime(0, 0);
        }
    }), 1000);
});
const getNewDateCanvas = (contents) => {
    var canvas = canvas_1.createCanvas(128, 64);
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "white";
    ctx.font = "50px Avenir";
    ctx.fillText(contents, 0, 50);
    return ctx;
};
const formatDate = (date, format = 'mm:ss') => {
    return format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
        .replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
};
