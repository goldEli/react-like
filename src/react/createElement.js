/**
 *
 * @param {*} type
 * @param {*} props
 * @param {*} children
 */
export function createElement(type, props, ...children) {
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