// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
import $ from "jquery";
import "./popup.less";

class Component extends Object {
  constructor() {
    super();

    this.initData();

    this.init();
  }

  // 列表-root
  get tabListDiv() {
    return $("#tabList");
  }

  // 初始化 时间列表
  initData() {
    this.timeList = {};
  }

  // 放入时间
  setNewTime(id, date) {
    if (!this.timeList) {
      this.initData();
    }

    const key = `time_${id}`;
    this.timeList[key] = date;
  }

  init() {
    chrome.windows.getCurrent({populate: true}, (window) => {
      console.log(window);
      const { tabs=[] } = window;
      
      tabs.forEach((item) => {
        const row = this.initRowByItem(item);
        this.tabListDiv.append(row);
      })
    })
  }

  // 初始化 行
  initRowByItem(item) {
    const { title, url } = item;
    const tempItem = $(`<div class="rowItem" ><div>${title}</div></div>`);
    tempItem.append(this.initTimeInput(item));
    return tempItem;
  }

  // 初始化-时间输入控件
  initTimeInput(item) {
    const initBtns = (img, clicked) => {
      const tempBtn = $(`<div>
       <img class="icon" src="${img}" />
      </div>`);
      tempBtn.on('click', () => clicked(item));

      return tempBtn;
    }

    const { id } = item;
    if (this.timeList[id]) {
      const tempElement = $(`<div class="timeRow" >关闭时间：<input id="${id}" type="time" /></div>`)
    }
    const tempElement = $(`<div class="timeRow" >
      关闭时间：<input id="input_${id}" type="time" />
    </div>`);

    const canelBtn = initBtns('./images/close.png', this.cancelTime);
    const commitBtn = initBtns('./images/check.png', this.commitTime);

    tempElement.append(canelBtn);
    tempElement.append(commitBtn);

    return tempElement;
  }

  // 提交时间
  commitTime(item) {
    console.log('commitTime', item);
    const { id } = item;
    const input = $(`#input_${id}`)[0];
    if (input) {
      const {valueAsDate} = input;
      this.setNewTime(id, valueAsDate);
    }
  }

  // 取消时间
  cancelTime(item) {
    console.log('cancelTime', item);
  }
}

new Component();