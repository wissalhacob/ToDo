const inputBox=document.getElementById("input-box")
const list=document.getElementById("list")
const DateTime=document.getElementById("DateTime")
const quote=document.getElementById("quote")
const author=document.getElementById("author")
const api="https://api.quotable.io/random";


new Sortable(list, {
  animation: 300 ,
  ghostClass: 'sortable',
});

function dateTime(){
    var now = new Date();
    DateTime.innerHTML = now.toLocaleString();
}
async function Quote(api){
    const response = await fetch(api);
    var data=await response.json();
    quote.innerHTML = data.content;
    author.innerHTML = data.author;
}

function addTask() {
    if (inputBox.value === '') {
        alert("empty");
    } else {
        let li = document.createElement("li");
        li.contentEditable=false;
        let input = document.createElement("p");
        input.textContent= inputBox.value  ;
        input.classList.add("col-sm-8");
        li.appendChild(input);
        let span = document.createElement("span");
        span.classList.add("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
        let editButton = document.createElement("span");
        editButton.innerHTML = "\u270E";
        editButton.classList.add("edit-button");
        li.appendChild(editButton);
        editButton.contentEditable = false;
        list.appendChild(li);
        inputBox.value = "";
        applyEditButtonListener(editButton,input);
        save();
    }
}

var isEditing = false;
function applyEditButtonListener(editButton,input) {
    editButton.onclick = function (e) {
        isEditing = true;
        const li = editButton.parentElement;
        const textNode = input.childNodes[0]; 
        const textLength = textNode.textContent.length;
        input.contentEditable = true;
        li.contentEditable=true;
        input.classList.add("col-sm-8");
        const range = document.createRange();
        const sel = window.getSelection();
        range.setStart(textNode, textLength);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        li.addEventListener("blur", function () {
                input.contentEditable = false;
                li.contentEditable = false;
                save();
                isEditing = false;
        });
        input.focus(); 
        li.focus();
    };
}

list.addEventListener("click", function (e) {
    const target = e.target;
    if (target.tagName === "LI" || target.classList.contains("col-sm-8")) {
        handleCheckClick(target);
    } else if (target.tagName === "SPAN" && target.classList.contains("span")) {
        handleDeleteClick(target);
    } else if (target.tagName === "SPAN" && target.classList.contains("edit-button")) {
        handleEditClick(target);
    }
}, false);

function handleCheckClick(element) {
    if (!isEditing) {
        const li = element.tagName === "LI" ? element : element.closest("li");
        li.classList.toggle("checked");
        save();
    }
}
function handleDeleteClick(span) {
        span.parentElement.remove();
        save();
}
function handleEditClick(editButton) {
    if (!isEditing) {
        var listItem = editButton.parentElement;
        const input = listItem.querySelector(".col-sm-8");
        applyEditButtonListener(editButton, input);
        save();
    }
}
function save(){
    localStorage.setItem("data",list.innerHTML);
}
function showList() {
    isEditing = false;
    list.innerHTML = localStorage.getItem("data");

    const editButtons = document.querySelectorAll(".edit-button");
    editButtons.forEach((editButton) => {
        const listItem = editButton.parentElement;
        const input = listItem.querySelector(".col-sm-8");
        applyEditButtonListener(editButton, input);
    });
}

showList();
dateTime();
Quote(api);
