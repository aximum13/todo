document.addEventListener("DOMContentLoaded", function () {
  let listTodo = [],
    listName = "x";

  const inputTodo = document.querySelector(".new-todo");
  const inputAllTodo = document.querySelector(".toggle-all");
  const todoList = document.querySelector(".todo-list");
  const footer = document.querySelector(".footer");
  const countText = document.querySelector(".todo-count");
  const clearCompletedTodo = document.querySelector(".clear-completed");
  const allTodo = document.querySelector(".all-todo");
  const activeTodo = document.querySelector(".active-todo");
  const completeTodo = document.querySelector(".complete-todo");

  let allDone = true;
  let localData = localStorage.getItem(listName);

  function createTodoItem(obj) {
    const item = document.createElement("li");
    const viewItem = document.createElement("div");
    const doneButton = document.createElement("input");
    const label = document.createElement("label");
    const deleteButton = document.createElement("button");
    const inputEdit = document.createElement("input");

    item.classList.add("todo-item");
    viewItem.classList.add("view");
    doneButton.classList.add("toggle");
    doneButton.type = "checkbox";
    inputEdit.classList.add("edit");
    inputEdit.type = "text";
    deleteButton.classList.add("destroy");

    label.classList.add("todo-text");
    label.textContent = obj.name;

    viewItem.append(doneButton);
    viewItem.append(label);
    viewItem.append(deleteButton);
    item.append(viewItem);

    doneButton.addEventListener("click", function () {
      item.classList.toggle("completed");

      for (const listItem of listTodo) {
        if (listItem.id == obj.id) {
          listItem.done = !listItem.done;

          if (!listItem.done) inputAllTodo.checked = false;

          countActiveTodo();
          console.log(countActiveTodo());
          textCount(countActiveTodo());
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

      countActiveTodo();
      textCount(countActiveTodo());

      listTodo = listTodo.filter((item) => item.id !== obj.id);

      clearFooter();

      saveList(listTodo, listName);
    });

    label.addEventListener("dblclick", function () {
      item.classList.add("editing");
      viewItem.style.display = "none";
      item.append(inputEdit);
      inputEdit.value = label.textContent;
      inputEdit.focus();
      inputEdit.addEventListener("change", function () {
        obj.name = inputEdit.value;
        label.textContent = obj.name;
        viewItem.style.display = "block";
        item.classList.remove("editing");
        inputEdit.remove();
        console.log(obj.name);
        saveList(listTodo, listName);
      });
    });

    return {
      item,
      doneButton,
      label,
      deleteButton,
    };
  }

  function textCount(count) {
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

  function countActiveTodo() {
    let count = 0;
    todoList.querySelectorAll(".todo-item").forEach(function (elem) {
      if (!elem.classList.contains("completed")) {
        count += 1;
      }
      console.log(elem, count, !elem.classList.contains("completed"));
    });
    return count;
  }

  if (localData !== null && localData !== "") {
    listTodo = JSON.parse(localData);
  }

  clearFooter();

  for (const item of listTodo) {
    let todoItem = createTodoItem(item);

    if (item.done) {
      todoItem.doneButton.checked = true;
      todoItem.item.classList.toggle("completed");
    } else {
      allDone = false;
    }

    todoList.append(todoItem.item);
  }

  countActiveTodo();
  console.log(countActiveTodo());
  textCount(countActiveTodo());

  inputAllTodo.checked = allDone;

  inputAllTodo.addEventListener("click", function () {
    listTodo.forEach(function (item) {
      if (inputAllTodo.checked) {
        item.done = true;
        todoList.querySelectorAll("li").forEach(function (li) {
          li.classList.add("completed");
          li.querySelector(".toggle").checked = true;
        });
      } else {
        item.done = false;
        todoList.querySelectorAll("li").forEach(function (li) {
          li.classList.remove("completed");
          li.querySelector(".toggle").checked = false;
        });
      }
      countActiveTodo();
      textCount(countActiveTodo());

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

    const newItem = {
      id: getNewID(listTodo),
      name: inputTodo.value,
      done: false,
    };

    if (listTodo.length === 0) {
      footer.style.display = "flex";
      inputAllTodo.nextElementSibling.style.display = "block";
      inputAllTodo.checked = false;
    }

    let todoItem = createTodoItem(newItem);
    listTodo.push(newItem);

    saveList(listTodo, listName);
    todoList.append(todoItem.item);
    inputTodo.value = "";

    countActiveTodo();
    textCount(countActiveTodo());

    if (completeTodo.classList.contains("selected")) {
      todoItem.item.style.display = "none";
    }

    if (inputAllTodo.checked == true) {
      inputAllTodo.checked = false;
    }
  });

  clearCompletedTodo.addEventListener("click", function () {
    listTodo = listTodo.filter((item) => !item.done);

    todoList.querySelectorAll(".completed").forEach((elem) => elem.remove());

    countActiveTodo();
    textCount(countActiveTodo());

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
