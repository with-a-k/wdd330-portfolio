import {TodoItem} from './todo-item.js';

let TodoItemFactory = {
  index: 0,
  makeTodoItem: function(e) {
    let title = document.querySelector('#item-name').value;
    new TodoItem(title, index, document.querySelector('#list-display'));
    this.index++;
  }
}

document.querySelector('#add-item').addEventListener('touchend', TodoItemFactory.makeTodoItem);
