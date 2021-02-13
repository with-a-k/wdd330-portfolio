export default class TodoItem {
  constructor(title, index, target, complete = false) {
    this.title = title;
    this.index = index;
    this.complete = complete;
    this.existing = false;
    if (this.title === "") {
      return;
    }
    this.render(target);
  }

  crossOut() {
    this.complete = true;
    this.existing.classList.add('complete');
  }

  render(target) {
    let item = document.createElement('div');
    item.id = `${this.title.replace(/\s/g, '-')}-${this.index}`;
    item.classList.add('todoItem');
    let title = document.createElement('p');
    title.innerHTML = this.title;
    title.classList.add('todoTitle');
    let confirm = document.createElement('button');
    confirm.id = `complete-${this.title}-${this.index}`;
    confirm.innerHTML = "Finished?";
    confirm.onclick = this.crossOut.bind(this);
    let remove = document.createElement('button');
    remove.id = `remove-${this.title}-${this.index}`;
    remove.innerHTML = "Remove";
    remove.onclick = this.removeSelf.bind(this);
    //appendChild returns the child, so these can't be chained
    item.appendChild(title);
    item.appendChild(confirm);
    item.appendChild(remove);
    target.appendChild(item);
    this.existing = item;
  }

  removeSelf() {
    this.existing.parentNode.removeChild(this.existing);
  }
}
