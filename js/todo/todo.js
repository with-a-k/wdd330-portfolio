import TodoItem from './todo-item.js';
import {loadList, saveList} from './todo-ls.js';

let TodoItemFactory = {
  makeTodoItem: function(e) {
    let title = document.querySelector('#item-name').value;
    new TodoItem(title, document.querySelector('#list-display'));
    this.index++;
  }
}

function filterComplete() {
  let collection = document.querySelector('#list-display');
  Array.from(collection.children).forEach(function(tdi) {
    if(Array.from(tdi.classList).includes('complete')) {
      tdi.classList.remove('hidden');
    } else {
      tdi.classList.add('hidden');
    }
  });
}

function filterIncomplete() {
  let collection = document.querySelector('#list-display');
  Array.from(collection.children).forEach(function(tdi) {
    if(!Array.from(tdi.classList).includes('complete')) {
      tdi.classList.remove('hidden');
    } else {
      tdi.classList.add('hidden');
    }
  });
}

function filterAll() {
  let collection = document.querySelector('#list-display');
  Array.from(collection.children).forEach(function(tdi) {
    tdi.classList.remove('hidden');
  });
}

document.querySelector('#add-item').addEventListener('click', TodoItemFactory.makeTodoItem);
document.querySelector('#show-complete').addEventListener('click', filterComplete);
document.querySelector('#show-all').addEventListener('click', filterAll);
document.querySelector('#show-incomplete').addEventListener('click', filterIncomplete);
document.querySelector('#load-list').addEventListener('click', loadList);
document.querySelector('#save-list').addEventListener('click', saveList);
