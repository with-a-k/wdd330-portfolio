import TodoItem from './todo-item.js';

let TodoItemFactory = {
  index: 0,
  makeTodoItem: function(e) {
    let title = document.querySelector('#item-name').value;
    new TodoItem(title, this.index, document.querySelector('#list-display'));
    this.index++;
  }
}

function filterComplete() {
  let collection = document.querySelector('#list-display');
  Array.from(collection.children).forEach(function(tdi) {
    if(tdi.classList.includes('complete')) {
      tdi.classList.remove('hidden');
    } else {
      tdi.classList.add('hidden');
    }
  });
}

function filterIncomplete() {
  let collection = document.querySelector('#list-display');
  Array.from(collection.children).forEach(function(tdi) {
    if(!tdi.classList.includes('complete')) {
      tdi.classList.remove('hidden');
    } else {
      tdi.classList.add('hidden');
    }
  });
}

document.querySelector('#add-item').addEventListener('click', TodoItemFactory.makeTodoItem);
