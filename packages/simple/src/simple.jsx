import {
  Component,
  setupUseRender,
  setupUseState,
  setupUseReducer,
  renderUseMemo,
  setupUseDidMount,
  setupUseWillUnmount,
  setupUseDidUpdate,
  setupUseEffect,
  setupUseMountEffect,
} from "react-class-setup-hooks";
import { useEffect } from 'react'

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
    // ...

    // 生命周期
    setupUseDidMount(() => {
      console.log("SimpleComponent DidMount 1");
    });
    setupUseDidMount(() => {
      console.log("SimpleComponent DidMount 2");
    });

    setupUseDidUpdate(() => {
      console.log("SimpleComponent DidUpdate 1");
    });
    setupUseDidUpdate((cancel) => {
      console.log("SimpleComponent DidUpdate 2");
      cancel()
    });

    setupUseWillUnmount(() => {
      console.log("SimpleComponent WillUnmount 1");
    });
    setupUseWillUnmount(() => {
      console.log("SimpleComponent WillUnmount 2");
    });

    setupUseEffect(() => {
      console.log("SimpleComponent Effect 1");
      return () => {
        console.log("SimpleComponent WillUnmountEffect 1");
      };
    });
    setupUseEffect(() => {
      console.log("SimpleComponent Effect 2");
    });
    setupUseEffect((cancel) => {
      console.log("SimpleComponent Effect 3");
      cancel()
      return () => {
        console.log("SimpleComponent WillUnmountEffect 3");
      };
    });

    setupUseMountEffect(() => {
      console.log("SimpleComponent MountEffect 1");
      return () => {
        console.log("SimpleComponent WillUnmount MountEffect 1");
      };
    });
    setupUseMountEffect(() => {
      console.log("SimpleComponent MountEffect 2");
    });
    setupUseMountEffect((cancel) => {
      console.log("SimpleComponent MountEffect 3");
      cancel()
      return () => {
        console.log("SimpleComponent WillUnmount MountEffect 3");
      };
    });

    // 最终渲染
    setupUseRender(() => {
      // render阶段 可用render hooks
      const countVM = renderCount();
      const toggleVm = renderToggle();
      useEffect(()=>{
        console.log('effect');
        return ()=>{
          console.log('uneffect');
        }
      })
      return (
        <div>
          {countVM}
          <br />
          {toggleVm}
        </div>
      );
    }, true);
  }
}

export default SimpleComponent;
