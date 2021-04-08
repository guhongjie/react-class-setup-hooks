import {
  createElement,
  Component as ReactComponent,
  PureComponent as ReactPureComponent,
} from "react";

const PREF = "_RCS";
const CODE =
  "_~`!@#$%^&*()_+[{]};:'\",<.>/?\\|qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
const CODE_LEN = 93;

function createCounter() {
  let i = 0;
  return function () {
    let res = PREF;
    let idx = i;
    i++;
    while (true) {
      let n = idx % CODE_LEN;
      res += CODE[n];
      idx = Math.floor(idx / CODE_LEN);
      if (idx === 0) {
        break;
      }
    }
    return res;
  };
}

const id = Symbol ? Symbol() : PREF;

// this[id][idx]
const DID_MOUNT = 0;
const DID_UPDATE = 1;
const WILL_UNMOUNT = 2;
const EFFECT = 3;
const MOUNT_EFFECT = 4;
const RENDER = 5;
const SIZE = 6;
const STATE_COUNTER = 6;

const OBJ_CALLBACK = 0; // 回调
const OBJ_CANCEL = 1; // 取消函数
const OBJ_IS_CANCEL = 2; //取消状态
const OBJ_EFFECT_NEXT = 3; //effect返回

const targetStack = [];
let currTarget;
function pushTarget(target) {
  targetStack.push(target);
  currTarget = target;
}
function popTarget() {
  targetStack.pop();
  currTarget = targetStack[targetStack.length - 1];
}

function objFilterCall(obj) {
  if (obj[OBJ_IS_CANCEL]) {
    return false;
  }
  obj[OBJ_CALLBACK](obj[OBJ_CANCEL]);
  return !obj[OBJ_IS_CANCEL];
}

function objCall(obj) {
  if (obj[OBJ_IS_CANCEL]) {
    return;
  }
  obj[OBJ_CALLBACK]();
}

function effectUpdateFilterCall(obj) {
  if (!obj[OBJ_IS_CANCEL] && obj[OBJ_EFFECT_NEXT]) {
    obj[OBJ_EFFECT_NEXT](obj[OBJ_CANCEL]);
  }
  if (!obj[OBJ_IS_CANCEL]) {
    obj[OBJ_EFFECT_NEXT] = obj[OBJ_CALLBACK](obj[OBJ_CANCEL]);
  }
  return !obj[OBJ_IS_CANCEL];
}

function mountEffectFilterCall(obj) {
  obj[OBJ_EFFECT_NEXT] = obj[OBJ_CALLBACK](obj[OBJ_CANCEL]);
  return !obj[OBJ_IS_CANCEL] && obj[OBJ_EFFECT_NEXT];
}

function effectWillUnmountCall(obj) {
  if (obj[OBJ_IS_CANCEL]) {
    return;
  }
  obj[OBJ_EFFECT_NEXT] && obj[OBJ_EFFECT_NEXT](obj[OBJ_CANCEL]);
}

function pushEventNotCancel(idx, callback) {
  const target = currTarget;
  const obj = [callback];
  target[id][idx].push(obj);
}

function pushEvent(idx, callback) {
  const target = currTarget;
  const obj = [callback];
  obj[OBJ_CANCEL] = function () {
    // cancel
    obj[OBJ_IS_CANCEL] = true;
  };
  target[id][idx].push(obj);
}

export function extendsComponent(ComponentClz, setupFun) {
  return class extends ComponentClz {
    constructor(props, context) {
      super(props, context);
      this[id] = [];
      this.state = { [id]: [] };
      for (let i = 0; i < SIZE; i++) {
        this[id][i] = [];
      }
      this[id][STATE_COUNTER] = createCounter();
      pushTarget(this);
      this.setup();
      popTarget();
    }
    componentDidMount() {
      this[id][DID_MOUNT].forEach(objCall);
      this[id][DID_MOUNT] = null;
      this[id][MOUNT_EFFECT] = this[id][MOUNT_EFFECT].filter(
        mountEffectFilterCall
      );
      this[id][EFFECT] = this[id][EFFECT].filter(effectUpdateFilterCall);
    }
    componentDidUpdate() {
      this[id][DID_UPDATE] = this[id][DID_UPDATE].filter(objFilterCall);
      this[id][EFFECT] = this[id][EFFECT].filter(effectUpdateFilterCall);
    }
    componentWillUnmount() {
      this[id][WILL_UNMOUNT].forEach(objCall);
      this[id][MOUNT_EFFECT].forEach(effectWillUnmountCall);
      this[id][EFFECT].forEach(effectWillUnmountCall);
    }
    setup() {
      setupFun && setupFun();
    }
  };
}

export const Component = extendsComponent(ReactComponent);
export const PureComponent = extendsComponent(ReactPureComponent);

// 生命周期 setup阶段执行
export function setupUseDidMount(didMount) {
  pushEventNotCancel(DID_MOUNT, didMount);
}

export function setupUseDidUpdate(didUpdate) {
  pushEvent(DID_UPDATE, didUpdate);
}

export function setupUseWillUnmount(willUnmount) {
  pushEventNotCancel(WILL_UNMOUNT, willUnmount);
}

export function setupUseEffect(effect) {
  pushEvent(EFFECT, effect);
}

export function setupUseMountEffect(effect) {
  pushEvent(MOUNT_EFFECT, effect);
}

// 状态 setup阶段执行
export function setupUseReducer(reducer, initialState) {
  const target = currTarget;
  const key = target[id][STATE_COUNTER]();
  if (initialState) {
    target.state[key] = initialState;
  }
  function reducerGet() {
    return target.state[key];
  }
  return [
    reducerGet,
    function (action) {
      target.setState((state) => {
        return {
          [key]: reducer(state[key], action),
        };
      });
    },
  ];
}

function STATE_REDUCER(state, action) {
  return action;
}

export function setupUseState(initialState) {
  return setupUseReducer(STATE_REDUCER, initialState);
}

function HooksProvider(props) {
  return props.render();
}
function RenderHooksProvider() {
  return createElement(HooksProvider, {
    render: this._render,
  });
}

// 渲染 setup阶段执行
export function setupUseRender(render, hasOpenReactHooks) {
  const target = currTarget;
  function _render() {
    pushTarget(target);
    target[id][RENDER][0] = 1;
    const res = render.call(target);
    popTarget();
    return res;
  }
  if (hasOpenReactHooks) {
    target.render = RenderHooksProvider;
    target._render = _render;
  } else {
    target.render = _render;
  }
}

// Memo render阶段
export function renderUseStore() {
  const target = currTarget;
  const idx = target[id][RENDER][0];
  let obj = target[id][RENDER][idx];
  if (!obj) {
    obj = {};
    target[id][RENDER][idx] = obj;
  }
  target[id][RENDER][0]++;
  return obj;
}

export function renderUseMemo(fn, deps) {
  const store = renderUseStore();
  let hasChange;
  if (store.deps) {
    if (deps.length !== store.deps.length) {
      hasChange = true;
    } else {
      for (let i = 0; i < store.deps.length; i++) {
        if (!Object.is(store.deps[i], deps[i])) {
          hasChange = true;
          break;
        }
      }
    }
  } else {
    hasChange = true;
  }
  if (hasChange) {
    store.val = fn(deps);
    store.deps = deps;
  }
  return store.val;
}
