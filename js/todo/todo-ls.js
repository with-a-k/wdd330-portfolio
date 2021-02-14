import TodoItem from './todo-item.js';

function loadList() {
  let todoList = localStorage.getItem('saved-tdl').split(";;");
  console.log(todoList);
  let target = document.querySelector('#list-display');
  target.replaceChildren();
  todoList.forEach(function(item) {
    console.log(item);
    let name = item.slice(0, item.indexOf('|'));
    let comp = item.endsWith('c');
    let stamp = item.slice(item.indexOf('|')+1, comp ? item.length-1 : item.length);
    new TodoItem(name, target, comp, stamp);
  });
}

function saveList() {
  console.log('saveList was invoked');
  let todoList = Array.from(document.getElementById("list-display").children)
    .map((item) => {
      let complete = Array.from(item.classList).includes('complete');
      return `${item.id}${complete ? 'c' : ''}
    })
    .join(';;');
  console.log(todoList);
  localStorage.setItem('saved-tdl', todoList);
}

export {loadList, saveList};
