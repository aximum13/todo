document.addEventListener("DOMContentLoaded", function () {
  let listTodo = [],
    listName = "x";
  let inputTodo = document.querySelector(".new-todo");
  let inputAllTodo = document.querySelector(".toggle-all");
  let count = 0;
  let todoList = document.querySelector(".todo-list");
  let footer = document.querySelector(".footer");
  let itemLeft = document.querySelector(".todo-count");
  let clearCompletedTodo = document.querySelector(".clear-completed");
  let allTodo = document.querySelector(".all-todo");
  let activeTodo = document.querySelector(".active-todo");
  let completeTodo = document.querySelector(".complete-todo");

  let allDone = true;
  let localData = localStorage.getItem(listName); // получаем сохраненные данные из локального хранилища в виде строки;

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

    // if (obj.done == true) item.classList.add("list-group-item-success"); // если у объекта стоит статус "Выполнен", то выделяем фон зелёным цветом

    doneButton.addEventListener("click", function () {
      item.classList.toggle("completed");

      for (const listItem of listTodo) {
        if (listItem.id == obj.id) {
          listItem.done = !listItem.done;

          if (listItem.done && count > 0) {
            count -= 1;
            itemLeft.textContent = count + " items left";
          } else count += 1;
          itemLeft.textContent = count + " items left";

          if (count == 1) {
            itemLeft.textContent = "1 item left"; // change text content to "1 item left" when count is 1
          } else {
            itemLeft.textContent = count + " items left";
          }
        }
      }

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

      saveList(listTodo, listName);
    });

    deleteButton.addEventListener("click", function () {
      item.remove();

      count -= 1;
      if (count > 0) {
      } else {
        count = 0;
      }

      itemLeft.textContent = count + " items left";

      if (count == 1) {
        itemLeft.textContent = "1 item left";
      } else {
        itemLeft.textContent = count + " items left";
      }

      for (let i = 0; i < listTodo.length; i++) {
        if (listTodo[i].id == obj.id) listTodo.splice(i, 1); // если id проверяемых элементов совпадают, то из массива всех дел удаляется данный элемент
      }

      if (listTodo.length === 0) {
        footer.style.display = "none";
        inputAllTodo.nextElementSibling.style.display = "none";
      }

      saveList(listTodo, listName);
    });

    return {
      item,
      doneButton,
      label,
      deleteButton,
    };
  }

  function getNewID(arg) {
    let max = 0;
    for (let item of arg) {
      if (item.id > max) max = item.id;
    }
    return max + 1; // задаём id каждому объекту задачи
  }

  function saveList(arg, key) {
    localStorage.setItem(key, JSON.stringify(arg)); // сохраняем данные в локальное хранилище в виде "ключ - значение"
  }

  if (localData !== null && localData !== "") {
    listTodo = JSON.parse(localData); // преобразуем данные из строки в объект
  }

  if (listTodo.length === 0) {
    footer.style.display = "none";
    inputAllTodo.nextElementSibling.style.display = "none";
  }
  for (let item of listTodo) {
    let todoItem = createTodoItem(item);

    if (item.done) {
      todoItem.doneButton.checked = true;
      todoItem.item.classList.toggle("completed");
    } else {
      allDone = false;
    }

    todoList.append(todoItem.item);
  }

  inputAllTodo.checked = allDone;

  listTodo.forEach(function (item) {
    if (!item.done) count += 1;
    itemLeft.textContent = count + " items left";
  });

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
      }

      itemLeft.textContent = count + " items left";
      saveList(listTodo, listName);
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
    if (count == 1) {
      itemLeft.textContent = "1 item left";
    } else {
      itemLeft.textContent = count + " items left";
    }

    let todoItem = createTodoItem(newItem);
    listTodo.push(newItem);

    saveList(listTodo, listName);
    console.log(listTodo);
    todoList.append(todoItem.item);
    inputTodo.value = "";
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

    if (count == 1) {
      itemLeft.textContent = "1 item left";
    } else {
      itemLeft.textContent = count + " items left";
    }

    if (listTodo.length === 0) {
      footer.style.display = "none";
      inputAllTodo.nextElementSibling.style.display = "none";
    }

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

  console.log(todoList.children);

  activeTodo.addEventListener("click", function () {
    allTodo.classList.remove("selected");
    activeTodo.classList.add("selected");
    completeTodo.classList.remove("selected");
    let todoItems = document.querySelectorAll(".todo-item");

    todoItems.forEach(function (li) {
      console.log(li);
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
      console.log(li);
      if (li.classList.contains("completed")) {
        li.style.display = "block";
      } else {
        li.style.display = "none";
      }
    });
  });
  console.log(allTodo, activeTodo, completeTodo);
});
