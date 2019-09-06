export default function createElement(tag, attributes, ...children) {
  const element = document.createElement(tag);

  if (attributes && typeof attributes === 'object') {
		Object.entries(attributes).forEach(([name, value]) => {
      element.setAttribute(name, value);
    });
  }

  children.forEach((child) => {
    if (!child) {
      return;
    }
    if (typeof child === 'string') {
      child = new Text(child);
    }
		element.appendChild(child);
	});

  return element;
}