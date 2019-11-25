import React from "./react";

const container = document.getElementById("root");

let visible = false

const updateInput = e => {
  visible = !visible
  rerender(e.target.value, visible)
}

const rerender = (value,visible) => {
  const element = (
    <div title="begin">
      <input onInput={updateInput} value={value}/>
      <h1>hello {value}</h1>
      {visible && <h2>visible</h2>}
    </div>
  );
  React.render(element, container);
};

rerender("world", visible)
