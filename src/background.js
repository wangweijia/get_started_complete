// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

class Background extends Object {
  constructor() {
    super();
    console.log('--init');

    this.init();
  }

  init() {
    // 初始化
    chrome.runtime.onInstalled.addListener(()=>this.onInstalled());
    // 收到通知
    chrome.runtime.onMessage.addListener((message, callback)=>this.onMessage(message, callback));
  }

  onInstalled() {
    console.log('onInstalled');
  }

  onMessage(message, callback) {
    console.log('message', message);
  }

}

const current = new Background();
console.log(current);