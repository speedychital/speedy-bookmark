//DOM Elements
const inputEl = document.querySelector("#input-el");
const saveBtn = document.querySelector("#save-btn");
const deleteBtn = document.querySelector("#delete-btn");
const listEl = document.querySelector("#list-el");
const tabBtn = document.querySelector("#tab-btn");
const downBtn = document.querySelector("#download-btn");

//Fields
let bookmarks = [];
if (localStorage.getItem("bookmarks")) {
  bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  renderBookmarks();
}
//Functions
function renderBookmarks() {
  if (listEl.children[0].classList[0] === "default") {
    listEl.innerHTML = "";
  }

  let lists = "";
  for (let bookmark of bookmarks) {
    if (isValidHttpUrl(bookmark)) {
      lists += `
        <li>
            <a target='_blank' href='${bookmark}'>
                ${bookmark}
            </a>
        </li>
        `;
    } else {
      lists += `
        <li>${bookmark}</li>
        `;
    }
  }

  if (lists) listEl.innerHTML = lists;
  else {
    listEl.innerHTML = `<li class="default"> Your bookmarks appear here</li>`;
  }
}

function saveBookmark() {
  if (inputEl.value === "") return;
  bookmarks.push(inputEl.value);
  inputEl.value = "";
  renderBookmarks();
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function deleteBookmarks() {
  if (
    confirm(
      "Bookmarks once deleted can't be recovered. Export to sheets if required."
    )
  ) {
    bookmarks = [];
    renderBookmarks();
    localStorage.clear();
  }
}

function saveURL() {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    bookmarks.push(tabs[0].url);
    renderBookmarks();
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  });
}

function downloadLists() {
  if (bookmarks.length == 0) {
    alert("No Bookmarks to download!");
    return;
  }
  let output = JSON.stringify(bookmarks);
  let fileName = "output.txt";

  let element = document.createElement("a");
  element.setAttribute(
    "href",
    `data:text/plain;charset=utf-8, ${encodeURIComponent(bookmarks)}`
  );
  element.setAttribute("download", fileName);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

//Not Mine
function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

//Event Listners
saveBtn.addEventListener("click", saveBookmark);
deleteBtn.addEventListener("click", deleteBookmarks);
inputEl.addEventListener("keypress", function (e) {
  if (e.code === "Enter") saveBookmark();
});
tabBtn.addEventListener("click", saveURL);
downBtn.addEventListener("click", downloadLists);
