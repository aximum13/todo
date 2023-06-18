(function () {
  let listTodo = [],
    listName = "";
  let count = 0;
  let countTasks = document.createElement("p");

  function createAppTitle(title) {
    let appTitle = document.createElement("h2"); // ссоздаем элемент h2
    appTitle.classList.add("mb-4");
    appTitle.innerHTML = title; // присваиваем название заголовка h2
    return appTitle;
  }

  function createTodoItemForm() {
    let form = document.createElement("form"); // создаём элементы
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите название нового дела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";
    button.disabled = true;

    buttonWrapper.append(button); // добавляем элементы в div и в form
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function createTodoItem(obj) {
    let item = document.createElement("li");
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    item.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "align-items-center"
    );
    item.textContent = obj.name;

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    if (obj.done == true) item.classList.add("list-group-item-success"); // если у объекта стоит статус "Выполнен", то выделяем фон зелёным цветом

    doneButton.addEventListener("click", function () {
      item.classList.toggle("list-group-item-success");

      for (const listItem of listTodo) {
        if (listItem.id == obj.id) {
          listItem.done = !listItem.done;

          if (listItem.done && count > 0) {
            count -= 1;
            countTasks.textContent = `Осталось выполнить задач: ${count}`;
          } else count += 1;
          countTasks.textContent = `Осталось выполнить задач: ${count}`;
        } // если id элемента из списка совпадает с id создаваемого объекта, то статусу элемента присвоить противоположный статус
      }

      saveList(listTodo, listName);
    });

    deleteButton.addEventListener("click", function () {
      if (confirm("Вы уверены?")) {
        item.remove();

        for (let i = 0; i < listTodo.length; i++) {
          if (listTodo[i].id == obj.id) listTodo.splice(i, 1); // если id проверяемых элементов совпадают, то из массива всех дел удаляется данный элемент
        }

        count -= 1;
        if (count > 0)
          countTasks.textContent = `Осталось выполнить задач: ${count}`;
        else count = 0;
        countTasks.textContent = `Осталось выполнить задач: ${count}`;

        saveList(listTodo, listName);
      }
    });

    return {
      item,
      doneButton,
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

  function createTodoApp(container, title, key) {
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    listName = key; //присваиваем переменной название ключа, которое становится доступным по всей функции

    todoItemForm.form.addEventListener("input", function () {
      if (todoItemForm.input.value) {
        todoItemForm.button.disabled = false;
      } else {
        todoItemForm.button.disabled = true;
      }
    });

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let localData = localStorage.getItem(listName); // получаем сохраненные данные из локального хранилища в виде строки;

    if (localData !== null && localData !== "") {
      listTodo = JSON.parse(localData); // преобразуем данные из строки в объект
    }

    for (let item of listTodo) {
      let todoItem = createTodoItem(item);
      todoList.append(todoItem.item);
    }

    listTodo.forEach(function (item) {
      if (!item.done) count += 1;
    });

    countTasks.classList.add("mt-3");
    countTasks.textContent = `Осталось выполнить задач: ${count}`;
    container.append(countTasks);

    todoItemForm.form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!todoItemForm.input.value) {
        return;
      }

      let newItem = {
        id: getNewID(listTodo),
        name: todoItemForm.input.value,
        done: false,
      };

      count += 1;
      countTasks.textContent = `Осталось выполнить задач: ${count}`;

      let todoItem = createTodoItem(newItem);
      listTodo.push(newItem);

      saveList(listTodo, listName);

      todoList.append(todoItem.item);
      todoItemForm.button.disabled = true;
      todoItemForm.input.value = "";
    });
  }

  window.createTodoApp = createTodoApp;
})();
