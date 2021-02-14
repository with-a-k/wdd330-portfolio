function loadList() {
  let todoList = localStorage.getItem('saved-tdl').split(";;");
  console.log(todoList);
  todoList.forEach(function(item) {
    console.log(item);
  });
}

function saveList() {
  console.log('saveList was invoked');
  let todoList = Array.from(document.getElementById("list-display").children)
    .map((item) => {
      return item.id
    })
    .join(';;');
  console.log(todoList);
  localStorage.setItem('saved-tdl', todoList);
}

export {loadList, saveList};
