import React from "./react";

const container = document.getElementById("root");

const updateInput = e => {
  rerender(e.target.value)
}

const rerender = value => {
  const element = (
    <div title="begin">
      <input onInput={updateInput} value={value}/>
      <h1>hello {value}</h1>
    </div>
  );
  React.render(element, container);
};

rerender("world")
