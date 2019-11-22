import _ from "lodash";

/**
 * 将虚拟 dom 渲染到页面上
 * @param {*} element
 * @param {*} container
 */
export function render(element, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [element]
    }
  };
  window.requestIdleCallback(workLoop);
}

function createDom(element) {
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

  return dom;
}

let nextUnitOfWork = null;

function workLoop(deadline) {
  
  let shouldYeild = false;

  if (!shouldYeild && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYeild = deadline.timeRemaining() < 1;
  }

  window.requestIdleCallback(workLoop);

}

/**
 * 返回下一个 unit of work
 * 
 * fiber 数据结构，是虚拟dom的扩展，增加属性（parent, child, sibling）
 * 首先返回 fiber.child
 * 如果没有就返回 fiber.sibling
 * 如果没哟就返回 fiber.parent.sibling
 * @param {*} fiber 
 */
function performUnitOfWork(fiber) {

  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  if (fiber.parent) {
    fiber.parent.dom.append(fiber.dom);
  }

  let index = 0;
  let preSibing = null;
  const elements = fiber.props.children

  while (index < elements.length) {
    const element = elements[index]
    const newFiber = {
      parent: fiber,
      dom: null,
      ...element
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      preSibing.sibling = newFiber;
    }

    preSibing = newFiber

    ++index;
  }

  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.sibling) {
    return fiber.sibling;
  }

  if (fiber.parent) {
    if (fiber.parent.sibling) {
      return fiber.parent.sibling;
    }
  }
}
