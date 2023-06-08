document.addEventListener('DOMContentLoaded', function () {

    let sortableElements = document.querySelectorAll('.sortable');
    sortableElements.forEach(function (element) {
        element.addEventListener('click', function () {

            sortableElements.forEach(function (sortable) {
                if (sortable != element) {
                    sortable.textContent = sortable.textContent.replace("▼", "▲");
                }
            });

            if (element.textContent.includes("▲")) {
                element.textContent = element.textContent.replace("▲", "▼");
            } else {
                element.textContent = element.textContent.replace("▼", "▲");
            }

            let table = document.getElementById('contactsTable');
            let th = this;
            let columnIndex = Array.prototype.indexOf.call(th.parentNode.children, th);

            let sortDirection;
            if (th.classList.contains('asc')) {
                sortDirection = -1;
            } else {
                sortDirection = 1;
            }

            let tbody = table.querySelector('tbody');
            let rows = Array.from(tbody.querySelectorAll('tr'));

            rows.sort(function (a, b) {
                let aValue = a.querySelectorAll('td')[columnIndex].textContent;
                let bValue = b.querySelectorAll('td')[columnIndex].textContent;

                if (!isNaN(parseFloat(aValue)) && isFinite(aValue)) {
                    return (parseFloat(aValue) - parseFloat(bValue)) * sortDirection;
                }

                let dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
                if (dateRegex.test(aValue) && dateRegex.test(bValue)) {
                    let aParts = aValue.split('.');
                    let bParts = bValue.split('.');
                    let aDate = new Date(aParts[2], aParts[1] - 1, aParts[0]);
                    let bDate = new Date(bParts[2], bParts[1] - 1, bParts[0]);
                    return (aDate - bDate) * sortDirection;
                }

                return aValue.localeCompare(bValue) * sortDirection;
            });

            rows.forEach(function (row) {
                tbody.appendChild(row);
            });

            let thElements = table.querySelectorAll('th');
            thElements.forEach(function (thElement) {
                thElement.classList.remove('asc', 'desc');
            });

            if (sortDirection === 1) {
                th.classList.add('asc');
            } else {
                th.classList.add('desc');
            }


        });
    });

    var saveButton = document.getElementById('saveButton');
    saveButton.addEventListener('click', function () {
        var contacts = [];

        var rows = document.querySelectorAll('#contactsTable tbody tr');
        rows.forEach(function (row) {
            var contact = {
                Id: null,
                Name: row.cells[0].textContent,
                DateOfBirth: row.cells[1].textContent,
                Married: row.cells[2].textContent,
                Phone: row.cells[3].textContent,
                Salary: row.cells[4].textContent
            };

            contacts.push(contact);
        });

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/Home/SaveContacts');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function () {
            if (xhr.status === 200) {
                alert('Data saved succesfully');
            }
            else {
                alert('Error while saving data');
            }
        };
        xhr.send(JSON.stringify(contacts));
    });

    var uploadCSVButton = document.getElementById('uploadCSVButton');
    var fileForm = document.getElementById('fileForm');

    uploadCSVButton.addEventListener('click', function () {
        fileForm.submit();
    });
});

const filterInput = document.getElementById('filterInput');
const contactsTable = document.getElementById('contactsTable');

filterInput.addEventListener('input', function () {
    const filterValue = filterInput.value;

    const rows = contactsTable.getElementsByTagName('tr');
    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let shouldDisplay = false;

        for (let j = 0; j < cells.length; j++) {
            const cellValue = cells[j].innerText;
            if (cellValue.includes(filterValue)) {
                shouldDisplay = true;
                break;
            }
        }

        if (shouldDisplay) {
            rows[i].style.display = 'table-row';
        } else {
            rows[i].style.display = 'none';
        }
    }
});

var deleteImages = document.querySelectorAll('.delete-image');
deleteImages.forEach(function (img) {
    img.addEventListener('click', function () {
        var row = this.closest('tr');
        row.remove();
    });
});