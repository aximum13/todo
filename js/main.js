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
        if (listItem.id === obj.id) {
          listItem.done = !listItem.done;

          if (!listItem.done) inputAllTodo.checked = false;
        }
      }

      textCount(countActiveTodo());

      checkItems(item);

      inputAllTodo.checked = Array.from(todoList.querySelectorAll("li")).every(
        (li) => li.classList.contains("completed")
      );

      saveList(listTodo, listName);
    });

    deleteButton.addEventListener("click", function () {
      item.remove();

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
        blurInputEdit(viewItem, item, inputEdit);
      });

      inputEdit.addEventListener("blur", function () {
        blurInputEdit(viewItem, item, inputEdit);
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
    countText.textContent = `${count} item${count !== 1 ? "s" : ""} left`;
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
      item.style.display = item.classList.contains("completed")
        ? "none"
        : "block";
    } else if (completeTodo.classList.contains("selected")) {
      item.style.display = item.classList.contains("completed")
        ? "block"
        : "none";
    }
  }

  function countActiveTodo() {
    return todoList.querySelectorAll(".todo-item:not(.completed)").length;
  }

  function blurInputEdit(viewItem, item, inputEdit) {
    viewItem.style.display = "block";
    item.classList.remove("editing");
    inputEdit.remove();
    saveList(listTodo, listName);
  }

  function initialization() {
    const localData = localStorage.getItem(listName);

    if (localData) {
      listTodo = JSON.parse(localData);

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
    }

    textCount(countActiveTodo());
    clearFooter();
    inputAllTodo.checked = allDone;
  }

  inputAllTodo.addEventListener("click", function () {
    listTodo.forEach(function (item) {
      item.done = inputAllTodo.checked;
      todoList.querySelectorAll(".todo-item").forEach(function (li) {
        if (inputAllTodo.checked) {
          li.classList.add("completed");
        } else {
          li.classList.remove("completed");
        }
        li.querySelector(".toggle").checked = inputAllTodo.checked;
      });
    });

    todoList.querySelectorAll("li").forEach(function (item) {
      checkItems(item);
    });

    textCount(countActiveTodo());
    saveList(listTodo, listName);
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

    const todoItem = createTodoItem(newItem);
    listTodo.push(newItem);

    saveList(listTodo, listName);
    todoList.append(todoItem.item);
    inputTodo.value = "";

    textCount(countActiveTodo());

    if (completeTodo.classList.contains("selected")) {
      todoItem.item.style.display = "none";
    }

    if (inputAllTodo.checked === true) {
      inputAllTodo.checked = false;
    }
  });

  clearCompletedTodo.addEventListener("click", function () {
    listTodo = listTodo.filter((item) => !item.done);

    todoList.querySelectorAll(".completed").forEach((elem) => elem.remove());

    clearFooter();

    saveList(listTodo, listName);
  });

  allTodo.addEventListener("click", function () {
    allTodo.classList.add("selected");
    activeTodo.classList.remove("selected");
    completeTodo.classList.remove("selected");
    const todoItems = document.querySelectorAll(".todo-item");

    todoItems.forEach(function (li) {
      li.style.display = "block";
    });
  });

  activeTodo.addEventListener("click", function () {
    allTodo.classList.remove("selected");
    activeTodo.classList.add("selected");
    completeTodo.classList.remove("selected");
    const todoItems = document.querySelectorAll(".todo-item");

    todoItems.forEach(function (li) {
      li.style.display = li.classList.contains("completed") ? "none" : "block";
    });
  });

  completeTodo.addEventListener("click", function () {
    allTodo.classList.remove("selected");
    activeTodo.classList.remove("selected");
    completeTodo.classList.add("selected");
    const todoItems = document.querySelectorAll(".todo-item");

   todoItems.forEach(function (li) {
     li.style.display = li.classList.contains("completed") ? "block" : "none";
   });
  });

  initialization();
});
