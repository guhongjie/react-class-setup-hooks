# react-class-setup-hooks

一个 React Class Component 扩展，使得 React Class Component 可以使用一些 Hooks，并像 vue3 setup 一样支持组合式 API 让业务代码更加集中，并且拥抱闭包，友好混淆。

如果你还不了解组合式 API，建议参考 Vue3 提供的文档介绍：[组合式 API](https://v3.cn.vuejs.org/guide/composition-api-introduction.html#%E4%BB%80%E4%B9%88%E6%98%AF%E7%BB%84%E5%90%88%E5%BC%8F-api)

另外相比 React Function Hooks，规避了 Hooks 在每次渲染时都要传递 init 参数，实际上 init 创建只会使用一次，每次渲染重复创建造成没必要的开销。

## Install

Using npm:

```sh
npm install --save-dev react-class-setup-hooks
```

<hr />

## 快速入门

### Step 1:

继承提供的 Component/PureComponent

```jsx
import { Component, PureComponent } from "react-class-setup-hooks";

class UComponent extends Component {}
```

### Step 2:

实现 setup 函数，在 setup 函数中分块完成你的具体业务，在最后调用 useRender Hook 创建渲染函数

```jsx
import {
  Component,
  setupUseRender,
  setupUseState,
  setupUseReducer,
  renderUseMemo,
} from "react-class-setup-hooks";

class SimpleComponent extends Component {
  setup() {
    // setup阶段 可用setup hooks
    // 业务1 计数器
    const [countGet, countDispatch] = setupUseReducer((state, action) => {
      switch (action.type) {
        case "add":
          return state + 1;
        case "reduce":
          return state - 1;
        case "reset":
          return 3;
        default:
          return state;
      }
    }, 3);
    const addClick = () => {
      countDispatch({
        type: "add",
      });
    };
    const reduceClick = () => {
      countDispatch({
        type: "reduce",
      });
    };
    const resetClick = () => {
      countDispatch({
        type: "reset",
      });
    };
    const countVmMemoFun = ([count]) => (
      <div>
        count: {count}
        <br />
        <button onClick={addClick}>add</button>,
        <button onClick={reduceClick}>reduce</button>,
        <button onClick={resetClick}>reset</button>
      </div>
    );
    const renderCount = () => {
      const countVM = renderUseMemo(countVmMemoFun, [countGet()]);
      return countVM;
    };

    // 业务2 toggle
    const [showGet, showSet] = setupUseState(false);
    const toggleClick = () => {
      showSet(!showGet());
    };
    const toggleVmMemoFun = ([show]) => (
      <div>
        <div>Title: {show ? "Toggle" : null}</div>
        <button onClick={toggleClick}>toggle</button>
      </div>
    );
    const renderToggle = () => {
      const toggleVm = renderUseMemo(toggleVmMemoFun, [showGet()]);
      return toggleVm;
    };

    // 业务N ...

    // 最终渲染
    setupUseRender(() => {
      // render阶段 可用render hooks
      const countVM = renderCount();
      const toggleVm = renderToggle();

      return (
        <div>
          {countVM}
          <br />
          {toggleVm}
        </div>
      );
    });
  }
}
```

<hr />

## API

### ClassComponent 相关 API

一个 setup 扩展 ClassComponent 需要使用以下开放的 API 创建，只有 setup 扩展后的 ClassComponent 才能。

setup 扩展类会实现 constructor 构造函数，并在构造函数阶段调用对象的 setup 函数，并接管和实现 componentDidMount、componentDidUpdate、componentWillUnmount 生命周期和 render 渲染函数

#### `extendsComponent(ComponentClz, setupFun) => Class`

创建一个 setup 扩展 ClassComponent，继承 ComponentClz 的 ReactClassComponent

ComponentClz：要继承的类，例如 React.Component、React.PureComponent，或者你自己继承自 React.Component 的类

setupFun：`() => void` 要创建类的 setup 函数实现，可选参数

#### `Component`

一个预设的继承自 React.Component 的 setup 扩展 ClassComponent，你可以继承该类并实现 setup 函数完成你的业务

```js
export const Component = extendsComponent(ReactComponent);
```

#### `PureComponent`

一个预设的继承自 React.Component 的 setup 扩展 ClassComponent，你可以继承该类并实现 setup 函数完成你的业务

```js
export const PureComponent = extendsComponent(ReactPureComponent);
```

<hr />

### setup 阶段 API

setup 阶段是 react-class-setup-hooks 定义的一个概念，在对象的 setup 函数执行时进入 setup 阶段，函数执行完成则退出 setup 阶段，在 setup 阶段时，你可以使用以下 setupUse\* API

#### 生命周期相关

#### `setupUseDidMount(didMount) => void`

组件 componentDidMount 生命周期

didMount：`() => void`

#### `setupUseDidUpdate(didUpdate) => void`

组件 componentDidUpdate 生命周期

didUpdate：`() => void`

#### `setupUseWillUnmount(willUnmount) => void`

组件 componentWillUnmount 生命周期

willUnmount：`(cancel: () => void) => void`

cancel：`() => void`

取消 willUnmount 函数

#### `setupUseEffect(effect) => void`

类 React useEffect 生命周期，会在 componentDidMount、componentDidUpdate 先回调上一次 Effect Return 函数（如果有或者非第一次）并再次调用 Effect 函数，在 componentWillUnmount 回调最后一次 Effect Return 函数

effect：`(cancel: () => void) => effectReturn`

effect 生命周期函数

effectReturn: `(cancel: () => void) => void`

Effect Return 生命周期函数

cancel：`() => void`

取消 Effect 函数

#### `setupUseMountEffect(effect) => void`

类 React useEffect 生命周期，会在 componentDidMount 调用 Effect 函数，在 componentWillUnmount 回调最后一次 Effect Return 函数

effect：`(cancel: () => void) => effectReturn`

effect 生命周期函数

effectReturn: `(cancel: () => void) => void`

Effect Return 生命周期函数

cancel：`() => void`

取消 Effect 函数

#### 状态state相关

#### `setupUseReducer(reducer, initialState) => [getter, dispatch]`
类 React useReducer API

reducer： `(state, action) => NewState`

reducer函数，用于处理dispatch传过来的action，并修改state，NewState为返回的新状态

initialState：初始状态，可选

getter：`() => State`

getter函数，调用返回数据

dispatch：`(action) => void`

dispatch函数，发起reducer请求，给reducer函数处理

#### `setupUseState(initialState) => [getter, setter]`
类 React useState API

initialState：初始状态，可选

getter：`() => State`

getter函数，调用返回数据

setter：`(newState) => void`

setter函数，调用修改state

#### Render相关
#### `setupUseRender(render, hasOpenReactHooks) => void`
调用该hook后会接管render渲染，并在渲染时，参数render函数执行时进入render状态，render状态可以调用以下renderUse开头的Hook函数

render：`() => ReactElement`

渲染函数，ReactElement为渲染结果React虚拟Element

hasOpenReactHooks：`boolean`

是否启用React Hooks，true时，可以在render阶段使用React函数Hooks，例如useContext等这类本扩展未实现的API

#### `renderUseStore() => Object`
renderUseStore为预留扩展API，返回为一个空对象，第一次调用时创建，后续渲染时返回第一次创建的对象，在自定义render hooks时使用，自行维护该对象

#### `renderUseMemo(fn, deps) => Result`
类 React useMemo API

deps：[]

fn函数依赖数据，deps内容发生变化会重新调用fn函数计算结果

fn：`(deps) => Result`

fn计算函数

Result：结果，deps未发生变化时，不会重复计算出新结果


