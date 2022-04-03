function createElementWithProps(
  elementType,
  elementClass,
  elementId,
  elementText
) {
  const newElement = document.createElement(elementType);
  if (elementClass) {
    newElement.classList = elementClass;
  }
  if (elementId) {
    newElement.id = elementId;
  }
  if (elementText) {
    newElement.textContent = elementText;
  }
  return newElement;
}

function addChildren(parent, children) {
  children.forEach((child) => {
    parent.appendChild(child);
  });
}

export { createElementWithProps, addChildren };
