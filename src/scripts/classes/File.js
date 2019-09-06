import { FileType } from "./MainController";
import createElement from "../helpers/createElement";

export default class File {
  constructor(name, parent) {
    this.name = name;
    this.type = FileType.FILE;
    this.path = `${parent.path}${name}`;
    this.parent = parent;

    this.classList = {
      base: 'treeViewItem treeViewItem--file',
      list: 'treeViewItem__list',
      listExpanded: 'treeViewItem__list--expanded',
      control: 'treeViewItem__control',
      controlActive: 'treeViewItem__control--active',
      label: 'treeViewItem__label',
      contextMenu: 'treeViewItem__contextMenu dropdown-content',
      contextMenuExpanded: 'treeViewItem__contextMenu--expanded',
      input: 'treeViewItem__input',
    };
  }

  renderTreeViewElement() {
    this.label = createElement(
      'div',
      { class: 'treeViewItem__label'},
      this.name
    );

    this.root = createElement(
      'div',
      { class: this.classList.base},
      this.label,
      this.renderContextMenu(),
    );

    this.label.addEventListener('contextmenu', (ev) => {
      ev.preventDefault();
      this.contextMenu.classList.add(this.classList.contextMenuExpanded);
      return false;
    }, false);

    window.addEventListener('click', (e) => {   
      if (!this.contextMenu.contains(e.target)) {
        this.contextMenu.classList.remove(this.classList.contextMenuExpanded);
      }
    });

    return this.root;
  }

  renderContextMenu() {
    const renameButton = createElement(
      'a',
      { href: '#', class: 'dropdown-item'},
      'Rename'
    );

    const deleteButton = createElement(
      'a',
      { href: '#', class: 'dropdown-item'},
      'Delete'
    );

    this.contextMenu = createElement(
      'div',
      { class: this.classList.contextMenu },
      renameButton,
      deleteButton,
    );
    
    renameButton.addEventListener('click', () => {
      this.renderRenameInput();
    });

    deleteButton.addEventListener('click', () => {
      this.parent.items = this.parent.items.filter(item => item.path !== this.path);
      this.root.remove();
    });

    return this.contextMenu;
  }

  renderRenameInput() {
    while (this.label.firstChild) {
      this.label.firstChild.remove();
    }

    const input = createElement(
      'input',
      { class: this.classList.input, autofocus: true, value: this.name },
      ''
    );

    this.label.appendChild(input);

    input.addEventListener('keyup', (e) => {
      if (e.code === 'Enter') {
        this.name = e.target.value;
        this.parent.reRender();
      }
    });
  }

  static renderFileViewWithInput(inputHandler) {
    const input = createElement(
      'input',
      { class: 'treeViewItem__input' }
    );
    
    const newFile = createElement(
      'div',
      { class: 'treeViewItem treeViewItem--file'},
      createElement(
        'div',
        { class: 'treeViewItem__label'},
        input,
      ),
    );

    input.addEventListener('keyup', inputHandler);

    return newFile;
  }
}
