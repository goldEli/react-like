import React from "./react";

const container = document.getElementById("root");

function App() {
  return (
    <div title="begin">
      <div><h2>I just stated the facts</h2></div>
      <h1>hello</h1>
      <h1>world</h1>
    </div>
  );
}

React.render(<App />, container);

// let visible = false;

// const updateInput = e => {
//   visible = !visible;
//   rerender(e.target.value, visible);
// };

// const rerender = (value, visible) => {
//   const element = (
//     <div title="begin">
//       <input onInput={updateInput} value={value} />
//       <h1>hello {value}</h1>
//       {visible && <h2>visible</h2>}
//     </div>
//   );
//   React.render(element, container);
// };

// rerender("world", visible);
