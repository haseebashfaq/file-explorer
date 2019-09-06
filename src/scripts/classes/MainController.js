import MockStructure from '../../assets/mock.json';
import File from './File.js';
import Folder from './Folder.js';
import TreeView from './TreeView.js';

export const FileType = {
  FILE: 'file',
  FOLDER: 'folder',
}

export default class MainController {
  constructor() {
    if (!this.setVars()) {
      return;
    }

    this.renderTreeView();
  }

  setVars() {
    this.structure = MockStructure;
    this.structure = new Folder(this.structure.name, null);
    this.structure.items = MockStructure.items.map((item) => this.mapItemsToObjects(item, this.structure));
    
    this.treeView = new TreeView();

    return true;
  }

  mapItemsToObjects(item, parent) {
    let mappedObject;
    
    if (item.type === FileType.FILE) {
      mappedObject = new File(item.name, parent);
    }

    if (item.type === FileType.FOLDER) {
      mappedObject = new Folder(item.name, parent);

      if (item.items) {
        mappedObject.items = item.items.map((item) => this.mapItemsToObjects(item, mappedObject));
      }
    }

    return mappedObject;
  }

  renderTreeView() {
    this.treeView.setData(this.structure);
    this.treeView.render();
  }
}