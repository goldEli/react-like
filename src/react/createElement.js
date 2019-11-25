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
      children: children
        // .filter(child => child) // 去空
        .map(child =>
          typeof child === "object" ? child : createTextElement(child)
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
