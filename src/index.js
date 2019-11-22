
import React from "./react"

const element = (
  <div title="begin">
    begin
    <div>
      1
      <div>2</div>
      <div>
        3
        <div>4</div>
      </div>
    </div>
  </div>
)
const container = document.getElementById("root");
React.render(element, container);
