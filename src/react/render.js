import _ from "lodash";

/**
 * 将虚拟 dom 渲染到页面上
 * @param {*} element
 * @param {*} container
 */
export function render(element, container) {
  console.log(element);

  const dom = toRealDom(element);
  console.log(dom, container);
  container.append(dom);
}

/**
 * 根据文本创建文本的真实节点
 * @param {*} text 
 */
function createTextRealDom(text) {
  return document.createTextNode(text);
}

/**
 * 根据虚拟dom节点生成真实节点
 * @param {*} element 
 */
function createRealDom(element) {
  const { props, type } = element;
  let dom = document.createElement(type);
  for (let key in props) {
    key !== "children" && dom.setAttribute(key, props[key]);
  }
  if (!_.isEmpty(props.children)) {
    props.children.map(child => {
      const childDom = toRealDom(child);
      dom.append(childDom);
    });
  }
  return dom
}

/**
 * 将虚拟DOM数转换成真实的DOM树
 * @param {*} element
 */
function toRealDom(element) {
  const { props, type } = element;
  let dom = null;
  if (type === "TEXT_ELEMENT") {
    dom = createTextRealDom(props.nodeValue);
  } else {
    dom = createRealDom(element)
  }
  return dom;
}