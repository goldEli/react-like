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

window.requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {

  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  if (fiber.parent) {
    fiber.parent.dom.append(fiber.dom);
  }

  let index = 0;
  let preSibing = null;

  while (index < fiber.props.children.length) {
    if (index === 0) {
      fiber.child = fiber.props.children[index];
      fiber.child.parent = fiber;
      preSibing = fiber.props.children[index];
    } else {
      const newFiber = {
        parent: fiber,
        ...fiber.props.children[index]
      };

      if (preSibing) {
        preSibing.sibling = newFiber;
      }
      preSibing = newFiber;
    }

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
