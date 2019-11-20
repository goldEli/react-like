/**
 *
 * @param {*} type
 * @param {*} props
 * @param {*} children
 */
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "string" ? createTextElement(child) : child
      )
    }
  };
}

/**
 * 创建文本节点
 * @param {*} text 
 */
function createTextElement(text) {
  return { type: "TEXT_ELEMENT", props: { children: [], nodeValue: text } };
}

/**
 * 将虚拟 dom 渲染到页面上
 * @param {*} element 
 * @param {*} container 
 */
function render(element, container) {
  console.log(JSON.stringify(element));
  console.log(element, container);
  const {type} = props
}

export default { createElement, render };
