var t,e;t=this,e=function(t,e){const n="_RCS",o=Symbol?Symbol():n,r=[];let s;function u(t){r.push(t),s=t}function i(){r.pop(),s=r[r.length-1]}function c(t){return!t[2]&&(t[0](t[1]),!t[2])}function f(t){t[2]||t[0]()}function p(t){return!t[2]&&t[3]&&t[3](t[1]),t[2]||(t[3]=t[0](t[1])),!t[2]}function l(t){return t[3]=t[0](t[1]),!t[2]&&t[3]}function h(t){t[2]||t[3]&&t[3](t[1])}function d(t,e){const n=[e];s[o][t].push(n)}function a(t,e){const n=s,r=[e];r[1]=function(){r[2]=!0},n[o][t].push(r)}function m(t,e){return class extends t{constructor(t,e){super(t,e),this[o]=[],this.state={[o]:[]};for(let t=0;t<6;t++)this[o][t]=[];this[o][6]=function(){let t=0;return function(){let e=n,o=t;for(t++;e+="_~`!@#$%^&*()_+[{]};:'\",<.>/?\\|qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890"[o%93],o=Math.floor(o/93),0!==o;);return e}}(),u(this),this.setup(),i()}componentDidMount(){this[o][0].forEach(f),this[o][0]=null,this[o][4]=this[o][4].filter(l),this[o][3]=this[o][3].filter(p)}componentDidUpdate(){this[o][1]=this[o][1].filter(c),this[o][3]=this[o][3].filter(p)}componentWillUnmount(){this[o][2].forEach(f),this[o][4].forEach(h),this[o][3].forEach(h)}setup(){e&&e()}}}const U=m(e.Component),E=m(e.PureComponent);function b(t,e){const n=s,r=n[o][6]();return e&&(n.state[r]=e),[function(){return n.state[r]},function(e){n.setState((n=>({[r]:t(n[r],e)})))}]}function y(t,e){return e}function C(t){return t.render()}function M(){return e.createElement(C,{render:this._render})}function S(){const t=s,e=t[o][5][0];let n=t[o][5][e];return n||(n={},t[o][5][e]=n),t[o][5][0]++,n}t.extendsComponent=m,t.Component=U,t.PureComponent=E,t.setupUseDidMount=function(t){d(0,t)},t.setupUseDidUpdate=function(t){a(1,t)},t.setupUseWillUnmount=function(t){d(2,t)},t.setupUseEffect=function(t){a(3,t)},t.setupUseMountEffect=function(t){a(4,t)},t.setupUseReducer=b,t.setupUseState=function(t){return b(y,t)},t.setupUseRender=function(t,e){const n=s;function r(){u(n),n[o][5][0]=1;const e=t.call(n);return i(),e}e?(n.render=M,n._render=r):n.render=r},t.renderUseStore=S,t.renderUseMemo=function(t,e){const n=S();let o;if(n.deps){if(e.length!==n.deps.length)o=!0;else for(let t=0;t<n.deps.length;t++)if(!Object.is(n.deps[t],e[t])){o=!0;break}}else o=!0;return o&&(n.val=t(e),n.deps=e),n.val},Object.defineProperty(t,"__esModule",{value:!0})},"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("react")):"function"==typeof define&&define.amd?define(["exports","react"],e):e(t["react-class-setup-hooks"]={},t.React);