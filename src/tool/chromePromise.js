export default class ChromePromise {
  static getFun(paths, baceFun) {
    if (paths.length > 0) {
      const NewPath = [...paths];
      const p = NewPath.shift();
      this.getFun(NewPath, baceFun[p]);
    } else {
      return baceFun;
    }
  }

  static newPromiseWithProps(paths, props) {
    return new Promise((reslove, reject) => {
      try {
        this.getFun(paths, chrome)(props, (...back) => {
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
        this.getFun(paths, chrome)((...back) => {
          reslove(back);
        });
      } catch (error) {
        reject(error);
      }
    })
  }
}