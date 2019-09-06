import { FileType } from "./MainController";
import createElement from '../helpers/createElement';
import File from "./File";

export default class Folder {
  
  constructor(name, parent) {
    this.name = name;
    this.type = FileType.FOLDER;
    this.items = [];

    this.classList = {
      base: 'treeViewItem treeViewItem--folder',
      list: 'treeViewItem__list',
      listExpanded: 'treeViewItem__list--expanded',
      control: 'treeViewItem__control',
      controlActive: 'treeViewItem__control--active',
      label: 'treeViewItem__label',
      contextMenu: 'treeViewItem__contextMenu dropdown-content',
      contextMenuExpanded: 'treeViewItem__contextMenu--expanded',
      input: 'treeViewItem__input',
    }  

    if (parent !== null) {
      this.path = `${parent.path}${name}/`;
    } else {
      this.path = '/';
    }
  }

  renderTreeViewElement() {
    this.list = createElement(
      'div',
      { class: this.classList.list},
      ...this.items.map(item => item.renderTreeViewElement())
    );

    this.root = createElement(
      'div',
      { class: this.classList.base},
      this.renderFolderControl(),
      this.list,
    );

    return this.root;
  }

  reRender() {
    while (this.root.firstChild) {
      this.root.firstChild.remove();
    }

    this.list = createElement(
      'div',
      { class: this.classList.list},
      ...this.items.map(item => item.renderTreeViewElement())
    );

    this.root.appendChild(this.renderFolderControl());

    this.root.appendChild(this.list);
  }

  renderFolderControl() {
    this.control = createElement(
      'span',
      { class: this.classList.control},
      ''
    ),

    this.label = createElement(
      'div',
      { class: this.classList.label},
      this.name,
      this.control,
      this.renderContextMenu(),
    );

    this.control.addEventListener('click', () => this.toggleListView());

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

    return this.label;
  }

  renderContextMenu() {
    const renameButton = createElement(
      'a',
      { href: '#', class: 'dropdown-item'},
      'Rename'
    );

    const addNewFolderButton = createElement(
      'a',
      { href: '#', class: 'dropdown-item'},
      'Add new folder'
    );

    const addNewFileButton = createElement(
      'a',
      { href: '#', class: 'dropdown-item'},
      'Add new file'
    );

    const deleteButton = createElement(
      'a',
      { href: '#', class: 'dropdown-item'},
      'Delete'
    );

    this.contextMenu = createElement(
      'div',
      { class: this.classList.contextMenu },
      this.path === '/' ? undefined : renameButton,
      addNewFolderButton,
      addNewFileButton,
      this.path === '/' ? undefined : deleteButton,
    );
    
    renameButton.addEventListener('click', () => {
      this.renderRenameInput();
    });

    addNewFolderButton.addEventListener('click', () => {
      this.contextMenu.classList.remove(this.classList.contextMenuExpanded);
      this.list.classList.add(this.classList.listExpanded);
      this.list.appendChild(this.renderFolderViewWithInput());
    });

    addNewFileButton.addEventListener('click', () => {
      this.contextMenu.classList.remove(this.classList.contextMenuExpanded);
      this.list.classList.add(this.classList.listExpanded);
      this.list.appendChild(File.renderFileViewWithInput((e) => this.newFileInputHandler(e)));
    });

    deleteButton.addEventListener('click', () => {
      this.items = this.items.filter(item => item.path !== this.path);
      this.root.remove();
    });

    return this.contextMenu;
  }

  toggleListView() {
    this.list.classList.toggle(this.classList.listExpanded);
    this.control.classList.toggle(this.classList.controlActive);
  }

  renderFolderViewWithInput() {
    const input = createElement(
      'input',
      { class: this.classList.input, autofocus: true },
      ''
    );

    const newFolderRoot = createElement(
      'div',
      { class: this.classList.base},
      createElement(
        'div',
        { class: this.classList.label},
        input,
      ),
    );

    input.addEventListener('keyup', (e) => {
      if (e.code === 'Enter') {
        const newFolder = new Folder(e.target.value, this);
        this.items.push(newFolder);
        this.reRender();
      }
    });

    return newFolderRoot;
  }

  newFileInputHandler(e) {
    if (e.code === 'Enter') {
      const newFolder = new File(e.target.value, this);
      this.items.push(newFolder);
      this.reRender();
    }
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
        this.reRender();
      }
    });
  }
}
