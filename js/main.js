document.addEventListener("DOMContentLoaded", function () {
  let listTodo = [],
    listName = "x";

  let inputTodo = document.querySelector(".new-todo");
  let inputAllTodo = document.querySelector(".toggle-all");
  let todoList = document.querySelector(".todo-list");
  let footer = document.querySelector(".footer");
  let countText = document.querySelector(".todo-count");
  let clearCompletedTodo = document.querySelector(".clear-completed");
  let allTodo = document.querySelector(".all-todo");
  let activeTodo = document.querySelector(".active-todo");
  let completeTodo = document.querySelector(".complete-todo");

  let count = 0;
  let allDone = true;
  let localData = localStorage.getItem(listName);

  function createTodoItem(obj) {
    let item = document.createElement("li");
    let doneButton = document.createElement("input");
    let label = document.createElement("label");
    let deleteButton = document.createElement("button");

    item.classList.add("todo-item");
    doneButton.classList.add("toggle");
    doneButton.type = "checkbox";
    deleteButton.classList.add("destroy");

    label.classList.add("todo-text");
    label.textContent = obj.name;

    item.append(doneButton);
    item.append(label);
    item.append(deleteButton);

    doneButton.addEventListener("click", function () {
      item.classList.toggle("completed");

      for (const listItem of listTodo) {
        if (listItem.id == obj.id) {
          listItem.done = !listItem.done;
          if (listItem.done && count > 0) {
            count -= 1;
          } else {
            count += 1;
          }

          if (!listItem.done) inputAllTodo.checked = false;

          countText.textContent = count + " items left";

          countVal();
        }
      }

      checkItems(item);

      let isAllCompleted = Array.from(todoList.querySelectorAll("li")).every(
        function (li) {
          return li.classList.contains("completed");
        }
      );
      if (isAllCompleted) {
        inputAllTodo.checked = true;
      }

      saveList(listTodo, listName);
    });

    deleteButton.addEventListener("click", function () {
      item.remove();

      count -= 1;
      if (count > 0) {
      } else {
        count = 0;
      }

      countText.textContent = count + " items left";

      countVal();

      for (let i = 0; i < listTodo.length; i++) {
        if (listTodo[i].id == obj.id) listTodo.splice(i, 1);
      }

      clearFooter();

      saveList(listTodo, listName);
    });

    return {
      item,
      doneButton,
      label,
      deleteButton,
    };
  }

  function countVal() {
    if (count == 1) {
      countText.textContent = "1 item left";
    } else {
      countText.textContent = count + " items left";
    }
  }

  function clearFooter() {
    if (listTodo.length === 0) {
      footer.style.display = "none";
      inputAllTodo.nextElementSibling.style.display = "none";
    }
  }

  function getNewID(arg) {
    let max = 0;
    for (let item of arg) {
      if (item.id > max) max = item.id;
    }
    return max + 1;
  }

  function saveList(arg, key) {
    localStorage.setItem(key, JSON.stringify(arg));
  }

  function checkItems(item) {
    if (activeTodo.classList.contains("selected")) {
      if (item.classList.contains("completed")) {
        item.style.display = "none";
      } else {
        item.style.display = "block";
      }
    } else if (completeTodo.classList.contains("selected")) {
      if (item.classList.contains("completed")) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    }
  }

  if (localData !== null && localData !== "") {
    listTodo = JSON.parse(localData);
  }

  clearFooter();

  for (let item of listTodo) {
    let todoItem = createTodoItem(item);

    if (item.done) {
      todoItem.doneButton.checked = true;
      todoItem.item.classList.toggle("completed");
    } else {
      allDone = false;
    }

    if (!item.done) count += 1;
    countVal();

    todoList.append(todoItem.item);
  }

  inputAllTodo.checked = allDone;

  inputAllTodo.addEventListener("click", function () {
    listTodo.forEach(function (item) {
      if (inputAllTodo.checked) {
        item.done = true;
        count = 0;
        todoList.querySelectorAll("li").forEach(function (li) {
          li.classList.add("completed");
          li.querySelector(".toggle").checked = true;
        });
      } else {
        item.done = false;
        count = listTodo.length;
        todoList.querySelectorAll("li").forEach(function (li) {
          li.classList.remove("completed");
          li.querySelector(".toggle").checked = false;
        });
        countVal();
      }

      saveList(listTodo, listName);
    });

    console.log(todoList);

    todoList.querySelectorAll("li").forEach(function (item) {
      checkItems(item);
    });
  });

  inputTodo.addEventListener("change", function (e) {
    e.preventDefault();

    if (!inputTodo.value) {
      return;
    }

    let newItem = {
      id: getNewID(listTodo),
      name: inputTodo.value,
      done: false,
    };

    if (listTodo.length === 0) {
      footer.style.display = "flex";
      inputAllTodo.nextElementSibling.style.display = "block";
      inputAllTodo.checked = false;
    }

    count += 1;

    countVal();

    let todoItem = createTodoItem(newItem);
    listTodo.push(newItem);

    saveList(listTodo, listName);
    todoList.append(todoItem.item);
    inputTodo.value = "";

    if (completeTodo.classList.contains("selected")) {
      todoItem.item.style.display = "none";
    }

    if (inputAllTodo.checked == true) {
      inputAllTodo.checked = false;
    }
  });

  clearCompletedTodo.addEventListener("click", function () {
    let doneItems = [];
    for (let i = 0; i < listTodo.length; i++) {
      if (listTodo[i].done == true) {
        doneItems.push(listTodo[i].id);
      }
    }

    for (let i = todoList.children.length - 1; i >= 0; i--) {
      let element = todoList.children[i];
      if (element.classList.contains("completed")) {
        element.remove();
      }
    }

    listTodo = listTodo.filter((item) => !doneItems.includes(item.id));
    count = listTodo.filter((item) => !item.done).length;

    countVal();

    clearFooter();

    saveList(listTodo, listName);
  });

  allTodo.addEventListener("click", function () {
    allTodo.classList.add("selected");
    activeTodo.classList.remove("selected");
    completeTodo.classList.remove("selected");
    let todoItems = document.querySelectorAll(".todo-item");

    todoItems.forEach(function (li) {
      li.style.display = "block";
    });
  });

  activeTodo.addEventListener("click", function () {
    allTodo.classList.remove("selected");
    activeTodo.classList.add("selected");
    completeTodo.classList.remove("selected");
    let todoItems = document.querySelectorAll(".todo-item");

    todoItems.forEach(function (li) {
      if (li.classList.contains("completed")) {
        li.style.display = "none";
      } else {
        li.style.display = "block";
      }
    });
  });

  completeTodo.addEventListener("click", function () {
    allTodo.classList.remove("selected");
    activeTodo.classList.remove("selected");
    completeTodo.classList.add("selected");
    let todoItems = document.querySelectorAll(".todo-item");

    todoItems.forEach(function (li) {
      if (li.classList.contains("completed")) {
        li.style.display = "block";
      } else {
        li.style.display = "none";
      }
    });
  });
});
