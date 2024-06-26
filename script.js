const dialog = document.querySelector('dialog');
const showBtn = document.querySelector('#show-dialog');
const closeBtn = document.querySelector('.close');
const submit = document.querySelector('.submit');
const form = document.querySelector('form');
const input = form.querySelectorAll('div > input');
const book = form.querySelector('#book');
const author = form.querySelector('#author');
const pages = form.querySelector('#pages');
const pagesRead = form.querySelector('#pagesRead');
const startDate = form.querySelector('#startDate');
const endDate = form.querySelector('#endDate');
const days = numberOfDays(startDate.value, endDate.value);


showBtn.addEventListener('click', () => {
  dialog.showModal();
})

closeBtn.addEventListener('click', (e) => {
  e.preventDefault();
  dialog.close();
})


book.addEventListener('input', (e) =>{
  if (book.validity.valueMissing){
    book.setCustomValidity("This field is required, please fill it in.");
  } else {
    book.setCustomValidity("");
  }
});

pages.addEventListener('input', (e) =>{
  if (pages.validity.valueMissing){
    pages.setCustomValidity("This field is required, please fill it in.");
  } else {
    pages.setCustomValidity("");
  }
});

author.addEventListener('input', (e) =>{
  if (author.validity.valueMissing){
    author.setCustomValidity("This field is required, please fill it in.");
  } else {
    author.setCustomValidity("");
  }
});

startDate.addEventListener('input', (e) =>{
  if (startDate.validity.valueMissing){
    startDate.setCustomValidity("This field is required, please fill it in.");
  } else {
    startDate.setCustomValidity("");
  }
});

submit.addEventListener('click', (e) => {
  if (book.validity.valueMissing){
    book.setCustomValidity("This field is required, please fill it in.");
  } else if (author.validity.valueMissing){
    author.setCustomValidity("This field is required, please fill it in.");
  } else if (pages.validity.valueMissing){
    pages.setCustomValidity("This field is required, please fill it in.");
  } else if (startDate.validity.valueMissing) {
    startDate.setCustomValidity("This field is required, please fill it in.");
  } else if (pages.validity.rangeOverflow || pages.validity.rangeUnderflow){
    pages.setCustomValidity("Out of range. Number needs to be between 1 and 999.");
  } else {
    e.preventDefault();
    addAndDisplayBook();
    dialog.close();
    const removeBtn = document.querySelectorAll('tr > td > .remove');
    removeBtn.forEach((btn) => {
      btn.addEventListener('click', deleteBook);
    })
    const statusBtn = document.querySelectorAll('tr > td > .status');
    statusBtn.forEach((btn) => {
      btn.addEventListener('click', toggleStatus);
    })
    const endDateChange = document.querySelectorAll('tr > td:nth-child(6) > input');
    endDateChange.forEach((date) => {
      date.addEventListener('change', recalculateDays);
    })
    const statusCheck = document.querySelectorAll('tr > td:nth-child(8) > button');
    statusCheck.forEach((check) => {
      if (check.textContent === 'Read') {
        check.style.backgroundColor = 'green';
        check.style.color = 'white';
      } else {
        check.textContent = 'Not Read'
        check.style.backgroundColor = 'red';
        check.style.color = 'white';
      }
    })
    clearForm();
  }
});

const myLibrary = [];

function Book(book, author, pages, readPages, startDate, endDate, days, status) {
  this.book = book;
  this.author = author;
  this.pages = pages;
  this.readPages = readPages;
  this.startDate = startDate;
  this.endDate = endDate;
  this.days = days;
  this.status = status;
}

function addAndDisplayBook() {
  //add book to library

  const status = form.querySelector('#status');
  const newBook = new Book(book.value, author.value, pages.value, pagesRead.value, startDate.value, endDate.value, days, status.value)
  myLibrary.push(newBook);

  // display book on table

  const table = document.querySelector('table');
  const tableRow = document.createElement('tr');
  for (let key in newBook){
    const row = document.createElement('td');
    row.textContent = newBook[key];
    tableRow.appendChild(row);
  }

  const pagesReadChild = tableRow.querySelector('td:nth-child(4)');
  const readPagesInput = document.createElement('input');
  readPagesInput.setAttribute('type', 'number');
  readPagesInput.value = pagesReadChild.textContent;
  pagesReadChild.textContent = "";
  pagesReadChild.appendChild(readPagesInput);

  const startDateChild = tableRow.querySelector('td:nth-child(5)');
  const startDateInput = document.createElement('input');
  startDateInput.setAttribute('type', 'date');
  startDateInput.value = startDateChild.textContent;
  startDateChild.textContent = ""
  startDateChild.appendChild(startDateInput);

  const endDateChild = tableRow.querySelector('td:nth-child(6)');
  const endDateInput = document.createElement('input');
  endDateInput.setAttribute('type', 'date');
  endDateInput.setAttribute('data-position', myLibrary.length - 1);
  endDateInput.value = endDateChild.textContent;
  endDateChild.textContent = ""
  endDateChild.appendChild(endDateInput);

  const numberOfDaysChild = tableRow.querySelector('td:nth-child(7)');
  numberOfDaysChild.textContent = numberOfDays(startDateInput.value, endDateInput.value);
  newBook.days = numberOfDaysChild.textContent;

  const statusChild = tableRow.querySelector('td:nth-child(8)');
  const statusBtn = document.createElement('button');
  statusBtn.textContent = statusChild.textContent;
  statusChild.textContent = "";
  statusBtn.classList.add('status');
  statusChild.appendChild(statusBtn);

  const removeBookData = document.createElement('td');
  const removeBook = document.createElement('button');
  removeBook.textContent = 'Remove Book';
  removeBook.setAttribute('data-position', myLibrary.length - 1);
  removeBook.classList.add('remove');
  removeBookData.appendChild(removeBook);
  tableRow.appendChild(removeBookData);
  table.appendChild(tableRow);
}

function clearForm() {
  const status = form.querySelector('#status');
  book.value = "";
  author.value = "";
  pages.value = "";
  pagesRead.value = "";
  startDate.value = "";
  endDate.value = "";
  status.value = "default";
}

function numberOfDays (startDate, endDate) {
  if (startDate === endDate){
    return 1;
  } else{
    let date1 = new Date(startDate);
    let date2 = new Date(endDate);
    let date3 = new Date();

    let differenceInTime = date2.getTime() - date1.getTime();
    let differenceInDays = Math.round(differenceInTime / (1000 * 3600 * 24));

    let currentDays = date3.getTime() - date1.getTime();
    let days = Math.round(currentDays / (1000 * 3600 * 24))

    if (!differenceInDays) {
      return days;
    } else {
      return differenceInDays + 1;
    }
  }
}

// add delete function for the remove button

function deleteBook() {
  myLibrary.splice(this.dataset.position, 1);
  const rows = document.querySelectorAll('table > tr');
  rows[this.dataset.position].remove();

  //recalculate each button position
  const buttons = document.querySelectorAll('table > tr > td > .remove');
  const dates = document.querySelectorAll('table > tr > td:nth-child(6) > input')
  for (let i = 0; i < myLibrary.length; i++){
    buttons[i].setAttribute('data-position', i);
    dates[i].setAttribute('data-position', i);
  }
}

function recalculateDays() {
  const newValue = document.querySelector('tr > td:nth-child(6) > input');
  const newDays = document.querySelector('tr > td:nth-child(7)');
  myLibrary[this.dataset.position].endDate = newValue.value;
  newDays.textContent = numberOfDays(myLibrary[this.dataset.position].startDate, myLibrary[this.dataset.position].endDate);
  myLibrary[this.dataset.position].days = newDays.textContent;
}

function toggleStatus(){
  if (this.textContent === 'Not Read') {
    this.textContent = 'Read';
    this.style.backgroundColor = 'green';
    this.style.color = 'white';
  } else {
    this.textContent = 'Not Read';
    this.style.backgroundColor = 'red';
    this.style.color = 'white';
  }
}