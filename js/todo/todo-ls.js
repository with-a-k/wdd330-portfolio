function loadList() {
  let todoList = localStorage.getItem(savedList);
}

function saveList() {
  let todoList = Array.from(document.getElementById("#list-display").children)
    .map((item) => {
      return {
        name: Array.from(item.children)[0].innerHTML,
        timestamp: item.id.substr(item.id.indexOf('|')+1)
      };
    });
  localStorage.setItem(savedList, todoList);
}

export {loadList, saveList};
