function loadList() {
  let todoList = localStorage.getItem('saved-tdl');
  todoList.forEach(function(item) {
    console.log(item);
  });
}

function saveList() {
  let todoList = Array.from(document.getElementById("list-display").children)
    .map((item) => {
      return {
        name: Array.from(item.children)[0].innerHTML,
        timestamp: item.id.substr(item.id.indexOf('|')+1)
      };
    });
  console.log(todoList);
  localStorage.setItem('saved-tdl', todoList);
}

export {loadList, saveList};
