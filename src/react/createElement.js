/**
 *
 * @param {*} type
 * @param {*} props
 * @param {*} children
 */
export function createElement(type, props, ...children) {
  if (type instanceof Function) {
    return {
      type: "FUNCTION_ELEMENT",
      props: {
        children: [type()]
      }
    };  
  }
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
