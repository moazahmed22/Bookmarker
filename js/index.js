const siteName = document.querySelector("#siteName");
const siteURL = document.querySelector("#siteURL");
const submitBtn = document.querySelector("#submitBtn");
const tableBody = document.querySelector("tbody");
const closeBtn = document.querySelector("#closeBtn");
const lightBox = document.querySelector(".light-box");
const validationIcons = Array.from(document.querySelectorAll(".input-icon"));
let isEmpty = true;
let isValid = false;
let regex;

siteName.addEventListener("input", (e) => {
  checkInputValidation(e);
});
siteURL.addEventListener("input", (e) => {
  checkInputValidation(e);
});

closeBtn.addEventListener("click", () => {
  lightBox.classList.replace("d-block", "d-none");
});

document.addEventListener("click", (e) => {
  // check if target = light box
  if (e.target.classList.contains("light-box")) {
    lightBox.classList.replace("d-block", "d-none");
  }
});

// check the local storage for previous bookmarks
let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
showTable(bookmarks);

// add bookmark
submitBtn.addEventListener("click", addBookmark);

// function to add bookmarks
function addBookmark() {
  let bookmarkObj = {
    websiteName: siteName.value,
    websiteURL: siteURL.value,
  };
  //  URL manipulation
  if (!bookmarkObj.websiteURL.startsWith("http")) {
    bookmarkObj.websiteURL = "https://" + bookmarkObj.websiteURL;
  }

  // check if all inputs are valid (using the validationIcons)
  if (validationIcons.every((icon) => icon.classList.contains("fa-check"))) {
    bookmarks.push(bookmarkObj);
    saveToLocalStorage();
    showTable(bookmarks);
  } else {
    lightBox.classList.replace("d-none", "d-block");
  }
}

// function to show bookmarks
function showTable(array) {
  tableBody.innerHTML = "";
  array.map((element, index) => {
    tableBody.innerHTML += `<tr class="align-middle">
                                <th scope="row">${index + 1}</th>
                                    <td>${element.websiteName}</td>
                                    <td>
                                        <a href=${
                                          element.websiteURL
                                        } class="btn btn-success">
                                            <i class="fa-solid fa-eye me-2"></i> visit
                                        </a>
                                    </td>
                                <td><button class="btn btn-danger deleteBookmarkBtn" onclick="deleteBookmark(${index})">
                                        <i class="fa-solid fa-trash me-2"></i> delete
                                    </button></td>
                            </tr>`;
  });
}

// function to save bookmark on local storage
let saveToLocalStorage = () => {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
};
// function to delete bookmark
function deleteBookmark(index) {
  bookmarks = bookmarks.filter((element, i) => {
    return i != index;
  });
  saveToLocalStorage();
  showTable(bookmarks);
}
// validation function
function checkInputValidation(event) {
  let icon = event.target.parentElement.querySelector(".input-icon");
  if (event.target.value == "") {
    isEmpty = true;
  } else {
    isEmpty = false;
  }
  switch (event.target.id) {
    case "siteName":
      regex = /^[a-zA-Z0-9]*$/;
      isValid = regex.test(event.target.value) ? true : false;
      break;
    case "siteURL":
      regex =
        /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,63}(\/[-a-zA-Z0-9@:%_+.~#?&\/\/=]*)?$/;
      isValid = regex.test(event.target.value) ? true : false;
      break;
  }
  // validation styling
  if (isEmpty || !isValid) {
    event.target.classList.remove("input-success");
    event.target.classList.add("input-error");
    icon.classList.remove("d-none");
    icon.classList.replace("fa-check", "fa-circle-exclamation");
    icon.classList.replace("text-success", "text-danger");
  } else {
    event.target.classList.remove("input-error");
    event.target.classList.add("input-success");
    icon.classList.replace("fa-circle-exclamation", "fa-check");
    icon.classList.replace("text-danger", "text-success");
  }
}
