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

function saveStory() {
  let storyName = document.getElementById("story_title").value;
  var storyHTML = document.getElementById("story_editor").value;
  localStorage.setItem(storyName, storyHTML);
}

document.querySelector('#add-item').addEventListener('click', TodoItemFactory.makeTodoItem);
document.querySelector('#show-complete').addEventListener('click', filterComplete);
document.querySelector('#show-all').addEventListener('click', filterAll);
document.querySelector('#show-incomplete').addEventListener('click', filterIncomplete);
