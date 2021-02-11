class TodoItem {
  constructor(title, index, complete = false) {
    this.title = title;
    this.index = index;
    this.complete = complete;
    this.existing = false;
    this.render(target);
  }

  crossOut() {
    this.complete = true;
    this.existing.classList.add('complete');
  }

  render(target) {
    let item = document.createElement(div);
    item.id = `${this.title}-${this.index}`;
    item.classList.add('todoItem');
    let confirm = document.createElement(button);
    confirm.id = `complete-${this.title}-${this.index}`;
    confirm.onclick = this.crossOut.bind(this);
    let title = document.createElement(h5);
    title.innerHTML = this.title;
    title.classList.add('todoTitle');
    //appendChild returns the child, so these can't be chained
    item.appendChild(title);
    item.appendChild(confirm);
    target.appendChild(item);
  }
}
