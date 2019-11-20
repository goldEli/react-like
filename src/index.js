
import React from "./react"

const element = (
  <div title="father" >
    hello
    <p>son</p>
  </div>
)
const container = document.getElementById("root");
React.render(element, container);
