'use strict';

const electron = require('electron');
const path = require('path');
const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;

// 保持对窗口对象的全局引用。如果不这么做的话，JavaScript垃圾回收的时候窗口会自动关闭
let mainWindow = null;

// 当所有的窗口关闭的时候退出应用
app.on('window-all-closed', function() {
  // 在 OS X 系统里，除非用户按下Cmd + Q，否则应用和它们的menu bar会保持运行
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// 当应用初始化结束后调用这个方法，并渲染浏览器窗口
app.on('ready', function() {
  Menu.setApplicationMenu(null);

  // 创建一个窗口
  mainWindow = new BrowserWindow({
    width: 600,
    height: 600
  });

  // 加载index.html
  mainWindow.loadURL(path.join('file://', __dirname, '/index.html'));

  // 窗口关闭时触发
  mainWindow.on('closed', function() {
    // 如果你的应用允许多个屏幕，那么可以把它存在Array里。
    // 因此删除的时候可以在这里删掉相应的元素
    mainWindow = null;
  });
});