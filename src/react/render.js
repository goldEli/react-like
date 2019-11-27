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


let hookIndex = 0;
export function useState(initState) {

  const oldHook = wipFiber?.oldFiber?.hooks[hookIndex]
  const hook = {
    state: oldHook? oldHook.state : initState,
  }
  const setState = newState => {

    hook.state = newState
    wipRoot = {
      dom: oldFiber.dom,
      props: oldFiber.props,
      oldFiber
    };
    hookIndex = 0;
    nextUnitOfWork = wipRoot;
  };

  wipFiber.hooks.push(hook)
  ++hookIndex
  return [hook.state, setState];
}

const isProperty = key => key !== "children";
const isEvent = key => key.startsWith("on");
const isNotEvent = key => !key.startsWith("on");

function createDom(element) {
  const { type, props } = element;

  let dom =
    type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(type);

  updateDom(dom, {}, props);

  return dom;
}

let nextUnitOfWork = null;

function workLoop(deadline) {
  let shouldYeild = false;

  if (!shouldYeild && nextUnitOfWork) {
    console.log(nextUnitOfWork);
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);

    if (!nextUnitOfWork) {
      // 所有单元处理完成，一起挂载到页面上
      commitRoot();
    }
    shouldYeild = deadline.timeRemaining() < 1;
  }

  window.requestIdleCallback(workLoop);
}

const isFunctionComponent = type => typeof type === "function";

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
  // todo add dom node
  // create new fiber
  // todo return next unit of work

  if (isFunctionComponent(fiber.type)) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }
  reconcileChildren(fiber);

  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.sibling) {
    return fiber.sibling;
  }
  let fiberParent = fiber.parent;
  while (fiberParent) {
    if (fiberParent.sibling) {
      return fiberParent.sibling;
    } else {
      fiberParent = fiberParent.parent;
    }
  }
}
let wipFiber = null
function updateFunctionComponent(fiber) {
  wipFiber = fiber
  wipFiber.hooks = []
  fiber.dom = null;
  fiber.props.children = [fiber.type(fiber.props)];
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
}

let deletions = [];

function reconcileChildren(fiber) {
  let index = 0;
  let preSibing = null;
  const elements = fiber.props.children;
  let oldFiber = fiber.oldFiber && fiber.oldFiber.child;
  while (index < elements.length) {
    const element = elements[index];

    const sameType = oldFiber && element && element.type === oldFiber.type;
    let newFiber = null;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: fiber,
        oldFiber,
        effectTag: "UPDATE"
      };
    }

    if (!sameType && element) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: element.dom,
        parent: fiber,
        oldFiber: null,
        effectTag: "PLACEMENT"
      };
    }

    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      preSibing.sibling = newFiber;
    }

    preSibing = newFiber;

    ++index;
  }
}

/**
 * 一次性挂载到页面上，防止当浏览器打断渲染后用户看到不完整的渲染。
 */
function commitRoot() {
  // remove 所有已经删除的节点
  deletions.map(item => {
    item.dom.remove();
  });
  deletions = [];
  commitWork(wipRoot.child);
  oldFiber = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  if (fiber.effectTag === "UPDATE") {
    updateDom(fiber.dom, fiber.oldFiber.props, fiber.props);
    fiber.dom = fiber.oldFiber.dom;
  } else if (fiber.effectTag === "PLACEMENT" && fiber.dom) {
    let domParentDom = fiber.parent.dom;
    let domParent = fiber.parent;
    while (!domParentDom) {
      domParent = domParent.parent;
      domParentDom = domParent.dom;
    }

    domParentDom.appendChild(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

const isNew = (prev, next) => key => prev[key] !== next[key];
const isGone = (prev, next) => key => !(key in next);

function updateDom(dom, prevProps, nextProps) {
  // remove old attribute
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(key => {
      dom[key] = prevProps[key];
    });

  // Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // update attribute
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNotEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(key => {
      dom[key] = nextProps[key];
    });

  // add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}
