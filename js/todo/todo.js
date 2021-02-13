import TodoItem from './todo-item.js';

let TodoItemFactory = {
  makeTodoItem: function(e) {
    let title = document.querySelector('#item-name').value;
    new TodoItem(title, document.querySelector('#list-display'));
    this.index++;
  }
}

function filterComplete() {
  console.log('filterComplete was invoked.');
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

function loadList() {
  let storyName = document.getElementById("story_title").value;
  var storyHTML = localStorage.getItem(storyName);
  document.getElementById("story_editor").value = storyHTML;
}

function saveList() {
  let storyName = Array.from(document.getElementById("#list-display").children)
    .map((item) => {

    });
  var storyHTML = document.getElementById("story_editor").value;
  localStorage.setItem(storyName, storyHTML);
}

document.querySelector('#add-item').addEventListener('click', TodoItemFactory.makeTodoItem);
document.querySelector('#show-complete').addEventListener('click', filterComplete);
document.querySelector('#show-all').addEventListener('click', filterAll);
document.querySelector('#show-incomplete').addEventListener('click', filterIncomplete);
