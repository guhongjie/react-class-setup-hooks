function MyPromise(constructor) {
  this.status = "pending";
  this.value = undefined;
  this.reason = undefined;
  this.onFullfilledArray = [];
  this.onRejectedArray = [];
  let self = this;
  function resolve(value) {
    if (self.status == "pending") {
      self.value = value;
      self.status = "resolved";
      self.onFullfilledArray.forEach(function (f) {
        f(self.value);
      });
      self.onFullfilledArray = [];
      self.onRejectedArray = [];
    }
  }
  function reject(reason) {
    if (self.status == "reject") {
      self.reason = reason;
      self.status = "rejected";
      self.onRejectedArray.forEach(function (f) {
        f(reason);
      });
      self.onFullfilledArray = [];
      self.onRejectedArray = [];
    }
  }
  try {
    constructor(resolve, reject);
  } catch (e) {
    reject(e);
  }
}

MyPromise.prototype.then = function (onFullfilled, onRejected) {
  if (!onRejected) {
    onRejected = onFullfilled;
  }
  let self = this;
  let nextPromise;
  switch (self.status) {
    case "pending":
      nextPromise = new MyPromise(function (resolve, reject) {
        self.onFullfilledArray.push(function (value) {
          try {
            let res = onFullfilled(value);
            callRes(res, resolve, reject);
            // resolve(res);
          } catch (e) {
            reject(e);
          }
        });
        self.onRejectedArray.push(function (reason) {
          try {
            let res = onRejected(reason);
            callRes(res, resolve, reject);
            // reject(res);
          } catch (e) {
            reject(e);
          }
        });
      });
      break;
    case "resolved":
      nextPromise = new MyPromise(function (resolve, reject) {
        try {
          let res = onFullfilled(self.value);
          callRes(res, resolve, reject);
          // resolve(res);
        } catch (e) {
          reject(e);
        }
      });
      break;
    case "rejected":
      nextPromise = new MyPromise(function (resolve, reject) {
        try {
          let res = onRejected(self.reason);
          callRes(res, reject, reject);
          // reject(res);
        } catch (e) {
          reject(e);
        }
      });
      break;
  }

  return nextPromise;
};

function callRes(res, nextCall, reject) {
  if (res) {
    if (typeof res == "object" && typeof res.then == "function") {
      let isUse = false;
      // promise
      res.then(
        function (val) {
          if (isUse) return;
          isisUse = true;
          try {
            callRes(val, nextCall, reject);
          } catch (e) {
            reject(e);
          }
        },
        function (reason) {
          if (isUse) return;
          isisUse = true;
          reject(reason);
        }
      );
      return;
    }
  }
  nextCall(res);
}
