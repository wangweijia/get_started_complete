// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
let _t = 0;

class Background extends Object {
  constructor() {
    super();
    console.log('--init');

    this.init();
    // 时间列表
    this.timeListObj = {};
    //开启时间检测
    this.currentTimeout();
  }

  init() {
    // 初始化
    chrome.runtime.onInstalled.addListener(()=>this.onInstalled());
    // 收到通知
    chrome.runtime.onMessage.addListener((message, callback)=>this.onMessage(message, callback));
    // 设置时间
    window.updateTimes = (times) => this.updateTimes(times);
    // 获取当前的时间
    window.getCurrentTimes = () => this.timeListObj;
  }

  onInstalled() {
    console.log('onInstalled');
  }

  onMessage(message, callback) {
    console.log('message', message);
  }

  // 更新时间列表
  updateTimes(times) {
    this.timeListObj = times;
    this.currentTimeout();
  }

  // 检测出到期的 tab-关闭
  checkoutCloseTab() {
    const currentT = (new Date()).valueOf();
    console.log('currentT,', currentT);
    const newList = {};
    const closeList = [];
    const keys = Object.keys(this.timeListObj||{}) || [];
    keys.map((key) => {
      let time = this.timeListObj[key];
      if (time > currentT) {
        newList[key] = time;
      } else {
        console.log('-push(key)', key);
        closeList.push((Number(key)));
      }
    });
    this.timeListObj = newList;
    if (closeList.length > 0) {
      chrome.tabs.remove(closeList, () => {
        console.log('chrome.tabs.remove');
      }); 
    }

    return closeList.length < keys.length;
  }

  // 定时器
  currentTimeout() {
    if (this.__currentTimeout) {
      clearTimeout(this.__currentTimeout);
    }

    this.__currentTimeout = setTimeout(() => {
      _t = _t + 1;
      console.log('-1:', _t);
      console.log(this.timeListObj);

      if (this.checkoutCloseTab()) {
        this.currentTimeout();
      }
    }, 5000);
  }
}

const current = new Background();