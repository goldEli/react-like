import React from "./react";

const container = document.getElementById("root");

function App(props) {

  const [count, setCount] = React.useState(0)
  const [num, setNum] = React.useState(100)

  return (
    <div title="begin">
      <button onClick={() => setCount(count+1)}>click</button>
      <h1>show count: {count}</h1>
      <h1 onClick={() => setNum(num+100)}>show num: {num}</h1>
      <div><Child /></div>
      <h1>hello</h1>
      <h1>world</h1>
    </div>
  );
}

function Child(props) {
  return <div>child</div>
}

React.render(<App />, container);