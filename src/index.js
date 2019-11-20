
import React from "./react"

const element = (
  <div title="mom" >
    hello
    <p title="child">child</p>
  </div>
)
const container = document.getElementById("root");
React.render(element, container);
