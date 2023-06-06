// ************ Elements *************
const alert = document.querySelector(".alert");
const form = document.querySelector(".shopping-form");
const input = document.querySelector(".shopping-input");
const add = document.querySelector(".add-btn");
const clear = document.querySelector(".clear-btn");
const list = document.querySelector(".items");
const container = document.querySelector(".items-container");

let editElement = "unchanged";
let editID = "";
let editFlag = false;

// ************ Events *************
window.addEventListener("DOMContentLoaded", setupItems());
form.addEventListener("submit", addItem);
clear.addEventListener("click", clearItems);

// edit
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-btn")) {
    const element = e.target.parentElement.parentElement;
    editElement = e.target.parentElement.previousElementSibling;
    input.value = editElement.innerHTML;
    input.focus();
    editFlag = true;
    editID = element.dataset.id;
    add.textContent = "edit";
  }
});

// delete
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const element = e.target.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);

    if (list.children.length === 0) {
      container.classList.remove("show-container");
    }

    defaultState();
    removeFromLocalStorage(id);
  }
});

// ************ Functions *************

// Add item
function addItem(e) {
  e.preventDefault();
  const value = input.value;
  id = new Date().getTime().toString();
  if (value && !editFlag) {
    createList(id, value);
    displayAlert("Item added to the list!", "success");
    container.classList.add("show-container");
    saveToLocalStorage(id, value);
    defaultState();
    input.focus();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    // displayAlert("Item added to the list!", "success");
    displayAlert(`${value}`, "success");
    editLocalStorage(editID, value);
    defaultState();
  } else {
    displayAlert("Please, enter a value!", "danger");
  }
}

//display alert

function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  // remove alert

  setTimeout(() => {
    alert.textContent = ".............";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

//clear

function clearItems(e) {
  e.preventDefault();
  container.classList.remove("show-container");
  list.innerHTML = "";
  localStorage.removeItem("list");
}

// defaultState
function defaultState() {
  input.value = "";
  editFlag = false;
  editID = "";
  add.textContent = "add";
}

// create list
function createList(id, value) {
  const element = document.createElement("article");
  element.classList.add("item");
  const attr = document.createAttribute("data-id");
  attr.value = id;
  element.setAttributeNode(attr);
  element.innerHTML = `
      <p class="item-title">${value}</p>
      <div class="btn-container">
            <button type="button" class="edit-btn">edit</button>
            <button type="button" class="delete-btn">delete</button>
          </div>
      `;

  list.appendChild(element);
}

// ************ Local storage *************

function saveToLocalStorage(id, value) {
  const shoppingItem = { id, value };
  let items = getLocalStorage();
  console.log(items);
  items.push(shoppingItem);
  localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getLocalStorage();
  items = items.filter((item) => {
    if (item.id != id) {
      return item;
    }
  });
  console.log(items);
  localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value) {
  let items = getLocalStorage();
  items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
}

// ************ Setup Items *************
function setupItems() {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createList(item.id, item.value);
    });
    container.classList.add("show-container");
  }
}
