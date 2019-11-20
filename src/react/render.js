import _ from "lodash";

/**
 * 将虚拟 dom 渲染到页面上
 * @param {*} element
 * @param {*} container
 */
export function render(element, container) {
  console.log(element);

  const { type, props } = element;

  const dom =
    type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(type);

  /**
   * add propperty
   */
  const isProperty = key => key !== "children";
  Object.keys(props)
    .filter(isProperty)
    .forEach(key => {
      dom[key] = props[key];
    });

  /**
   * Recursive rendering children
   */
  props.children.forEach(child => {
    setTimeout(render(child, dom), 0)
  });

  container.append(dom);
}
