export default class ChromePromise extends Object {
  static getFun(paths, baceFun) {
    if (paths.length > 0) {
      const NewPath = [...paths];
      const p = NewPath.shift();
      const next = baceFun[p];
      if (typeof next === 'function') {
        next.bind(baceFun);
      }
      return this.getFun(NewPath, baceFun[p]);
    } else {
      return baceFun;
    }
  }

  static newPromiseWithProps(paths, props) {
    return new Promise((reslove, reject) => {
      try {
        this.getFun(paths, window.chrome)(props, (...back) => {
          reslove(back);
        });
      } catch (error) {
        reject(error);
      }
    })
  }

  static newPromiseNoProps(paths) {
    return new Promise((reslove, reject) => {
      try {
        console.log(this.getFun(paths, window.chrome));

        this.getFun(paths, window.chrome)((...back) => {
          reslove(back);
        });
      } catch (error) {
        reject(error);
      }
    })
  }

  // chrome.runtime.xxxxx.addListener
  static runtimeAddListener(path, props) {
    if (props) {
      return this.newPromiseWithProps(['runtime', path, 'addListener'], props);
    }
    return this.newPromiseNoProps(['runtime', path, 'addListener']);
  }
}