import createElement from "../helpers/createElement";

export default class TreeView {
  constructor() {
    this.container = document.querySelector('.treeView');
  }

  setData(structure) {
    this.structure = structure;
  }

  render() {
    while (this.container.firstChild) {
      this.container.firstChild.remove();
    }

    const el = createElement('div', { class: 'treeView__root'}, this.structure.renderTreeViewElement());

    this.container.appendChild(el);
  }
}