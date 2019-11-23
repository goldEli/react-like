import _ from "lodash";

/**
 * fiber root
 */
let wipRoot = null;

let oldFiber = {};

/**
 * 将虚拟 dom 渲染到页面上
 * @param {*} element
 * @param {*} container
 */
export function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element]
    },
    oldFiber
  };
  nextUnitOfWork = wipRoot;
  window.requestIdleCallback(workLoop);
}

const isProperty = key => key !== "children";
const isEvent = key => key.startsWith("on");
function createDom(element) {
  const { type, props } = element;
  const dom =
    type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(type);

  /**
   * add propperty
   */
  Object.keys(props)
    .filter(isProperty)
    .forEach(key => {
      dom[key] = props[key];
    });

  Object.keys(props)
    .filter(isEvent)
    .forEach(key => {
      const eventName = key.slice(2).toLocaleLowerCase();
      window.addEventListener(eventName, props[key]);
    });

  return dom;
}

let nextUnitOfWork = null;

function workLoop(deadline) {
  let shouldYeild = false;

  if (!shouldYeild && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    if (!nextUnitOfWork) {
      commitRoot();
    }
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

  let index = 0;
  let preSibing = null;
  const elements = fiber.props.children;

  while (index < elements.length) {
    const element = elements[index];
    const newFiber = createFiber(fiber, element);

    if (index === 0) {
      fiber.child = newFiber;
      fiber.child.oldFiber = fiber.oldFiber?.child;
    } else {
      preSibing.sibling = newFiber;
      fiber.child.sibling.oldFiber = fiber.oldFiber?.child?.sibling;
    }

    preSibing = newFiber;

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

function createFiber(fiber, element) {
  return {
    parent: fiber,
    dom: null,
    ...element
  };
}

/**
 * 一次性挂载到页面上，防止当浏览器打断渲染后用户看到不完整的渲染。
 */
function commitRoot() {
  commitWork(wipRoot.child);
  oldFiber = { ...wipRoot };
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  if (fiber.type === fiber.oldFiber?.type) {
    updateDom(fiber);
    fiber.dom = fiber.oldFiber.dom
  } else {
    const domParent = fiber.parent.dom;
    domParent.appendChild(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

const isNotEvent = key => !key.startsWith("on");
function updateDom(fiber) {
  const oldFiber = fiber.oldFiber;
  const oldProps = oldFiber.props;
  Object.keys(fiber.props)
    .filter(isProperty)
    .filter(isNotEvent)
    .forEach(key => {
      if (fiber.props[key] !== oldProps[key]) {
        oldFiber.dom[key] = fiber.props[key];
      }
    });
}
