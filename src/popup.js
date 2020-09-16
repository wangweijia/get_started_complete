// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';
import moment from 'moment';
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
    if (!this.__tabList) {
      this.__tabList = $("#tabList");
    }
    return this.__tabList;
  }

  // 后期后台对象
  get bg() {
    return chrome.extension.getBackgroundPage();
  }

  // 初始化 时间列表
  initData() {
    const obj = this.bg.getCurrentTimes();
    this.timeList = obj || {};
  }

  // 放入时间
  setNewTime(id, date) {
    console.log(id, date, typeof date, new Date(date).valueOf());
    if (!this.timeList) {
      this.initData();
    }

    const key = `${id}`;
    if (date) {
      this.timeList[key] = date.valueOf();
    } else {
      delete this.timeList[key];
    }

    this.bg.updateTimes(this.timeList);
  }

  init() {
    chrome.windows.getCurrent({populate: true}, (window) => {
      const { tabs=[] } = window;
      this.tabListDiv.empty();
      
      // tabs.forEach((item) => {
      //   const row = this.initRowByItem(item);
      //   this.tabListDiv.append(row);
      // });
      for (let index = 0; index < tabs.length; index++) {
        const item = tabs[index];
        const row = this.initRowByItem(item);
        this.tabListDiv.append(row);
      }
    });
  }

  // 初始化 行
  initRowByItem(item) {
    const { title, url } = item;
    const tempItem = $(`<div class="rowItem" ></div>`);
    tempItem.text(title)
    tempItem.append(this.initTimeInput(item));
    return tempItem;
  }

  // 初始化-时间输入控件
  initTimeInput(item) {
    const initBtns = (img, clicked) => {
      const tempBtn = $(`<div>
       <img class="icon" src="${img}" />
      </div>`);
      tempBtn.on('click', () => {
        clicked(item);
      });

      return tempBtn;
    }

    const { id } = item;
    console.log('id:', id);
    const canelBtn = initBtns('./images/close.png', (item)=>this.cancelTime(item));
    const commitBtn = initBtns('./images/check.png', (item)=>this.commitTime(item));

    let tempElement = undefined;

    if (this.timeList[id]) {
      // todo-获取已有 id
      const tl = this.timeList[id] || 0;
      tempElement = $(`<div  id="div_input_${id}" class="timeRow" >关闭时间：${moment(tl).format('YYYY-MM-DD HH:mm')}</div>`);
      tempElement.append(canelBtn);
    } else {
      const aId = `input_${id}`;
      const input = $(`<input id="${aId}" type="datetime-local" />`);
      input.on('change', (e) => {
        $(`#${aId}`).attr({value: e.target.value});
      })

      tempElement = $(`<div id="div_input_${aId}" class="timeRow" >关闭时间：</div>`);
      tempElement.append(input);
      tempElement.append(commitBtn);
    }

    return tempElement;
  }

  // 提交时间
  commitTime(item) {
    const { id } = item;
    const input = $(`#input_${id}`)[0];
    if (input) {
      const {value} = input;
      this.setNewTime(id, new Date(value));
      
      this.init();
    }
  }

  // 取消时间
  cancelTime(item) {
    const { id } = item;
    this.setNewTime(id, undefined);      
    this.init();
  }
}

new Component();
