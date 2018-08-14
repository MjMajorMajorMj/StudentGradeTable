$(document).ready(initializeApp);

var student_array = [];
var selectedStudentID = null;
var pageNum = 0;
var totalNumStudents = 0;

function initializeApp() {
    addClickHandlersToElements();
    addClickHandlersToPagination();
    addClickHandlersToSearch();
    handleGetDataClick();
    fetchNumberOfStudentsAndPages();
}

function addClickHandlersToElements() {
    $(".btnAdd").on('click', handleAddClicked);
    $(".btnCancel").on('click', handleCancelClick);
    $('.btnGetData').on('click', handleGetDataClick);
    $('.btnUpdateToServer').on('click', handleUpdateClick);
    $('.btnCancelUpdate').on('click', function () {
        $("#updateStudentName, #updateCourse, #updateStudentGrade").removeClass("is-invalid");
    });
};

function addClickHandlersToPagination() {
    $('.firstPage').on('click', firstPageButtonFunction);
    $('.lastPage').on('click', lastPageButtonFunction);
    $('.navPage').on('click', navPageButtonFunction)
    $('.goToPageBtn').on('click', gotoPage);
};

function addClickHandlersToSearch() {
    $('.searchBarBtn').on('click', searchFunction);
    $('.mobileSearchBtn').on('click', mobileSearchFunction);
};

function handleAddClicked() {
    addStudent();
};

function handleCancelClick() {
    clearAddStudentFormInputs();
};

function handleUpdateClick() {
    updateStudentServer();
};

function addStudent() {
    let invalidTrigger = 0;
    var studentObj = {
        name: $("#studentName").val(),
        course_name: $("#course").val(),
        grade: parseInt($("#studentGrade").val()),
    }

    if (studentObj.name === "") {
        $("#studentName").addClass("is-invalid");
        invalidTrigger = 1;
    }
    if (studentObj.course_name === "") {
        $("#course").addClass("is-invalid");
        invalidTrigger = 1;
    }
    if (isNaN(studentObj.grade) || studentObj.grade > 100 || studentObj.grade < 0) {
        $("#studentGrade").addClass("is-invalid");
        invalidTrigger = 1;
    }
    if (invalidTrigger === 1) {
        return;
    } else {
        $("#studentName, #course, #studentGrade").removeClass("is-invalid");
    }

    student_array.push(studentObj);
    clearAddStudentFormInputs();
    var sendData = { name: studentObj.name, course_name: studentObj.course_name, grade: studentObj.grade, action: 'insert' };
    var ajaxConfig = {
        data: sendData,
        dataType: 'json',
        method: 'POST',
        url: 'data.php',
        success: function (response) {
            if (response.success) {
                student_array[student_array.length - 1].id = response.insertID;
                updateStudentList(student_array[student_array.length - 1], 1);
                addStudentLastPage();
            } else {
                displayErrorModal(response.errors[0]);
            }
        }
    }
    $.ajax(ajaxConfig);
}

function addStudentLastPage() {
    totalNumStudents++;
    const currentPageNum = getCurrentPageNum();
    if (student_array.length > 10 && currentPageNum === pageNum) {
        pageNum++;
        checkPageNum();
        lastPageButtonFunction();
        goToPagePlaceholder(pageNum);
    } else if (student_array.length > 10 && currentPageNum !== pageNum) {
        const numStudentsArray = Array.from(totalNumStudents.toString());
        if (numStudentsArray[numStudentsArray.length - 1] === "1") {
            pageNum++;
            checkPageNum();
            lastPageButtonFunction();
            goToPagePlaceholder(pageNum);
        } else {
            lastPageButtonFunction();
        }
    };
};

function getCurrentPageNum() {
    let currentPageNum = 1;
    const activeRegex = /active\b/gm;
    $('.page-item').each(function () {
        if (activeRegex.test(this.className) === true) {
            currentPageNum = parseInt(this.children[0].text);
        };
    });
    return currentPageNum;
};

function clearAddStudentFormInputs() {
    $("#studentName, #course, #studentGrade").removeClass("is-invalid");
    $("#studentName, #course, #studentGrade").val("");
}

function renderStudentOnDom(studentObj) {
    var studentName = $('<td>', {
        text: studentObj.name,
        style: "overflow-wrap: break-word"
    });
    var studentCourse = $('<td>', {
        text: studentObj.course_name,
        style: "overflow-wrap: break-word"
    });
    var studentGrade = $('<td>', {
        text: studentObj.grade
    });
    var updateButtonContainer = $('<td>', {
        class: "updateButtonContainer d-none d-md-table-cell"
    });
    var updateButton = $('<button>', {
        text: 'Update',
        type: "button",
        class: "btn btn-info updateButton mb-1",
        on: {
            click: function () {
                $("#updateStudentName, #updateCourse, #updateStudentGrade").removeClass("is-invalid");
                $("#updateModal").modal();
                selectedStudentID = parseInt($(this).closest('tr').attr('id'));
                let studentIndex = student_array.indexOf(studentObj);
                $('.update-modal-title').text("Updating " + student_array[studentIndex].name + "'s Entry");
                $('#updateStudentName').val(student_array[studentIndex].name);
                $("#updateCourse").val(student_array[studentIndex].course_name);
                $("#updateStudentGrade").val(student_array[studentIndex].grade);
            }
        },
    });
    var deleteButtonContainer = $('<td>', {
        class: "deleteButtonContainer d-none d-md-table-cell"
    });
    var deleteButton = $('<button>', {
        text: 'Delete',
        type: "button",
        class: "btn btn-danger deleteButton mb-1",
        on: {
            click: function () {
                $(this).parent().removeClass("d-md-table-cell");
                $(this).parent().siblings('.updateButtonContainer').removeClass("d-md-table-cell");
                $(this).parent().siblings(".confirmDeleteContainer").addClass("d-md-table-cell");
            }
        },
    });
    var confirmDeleteContainer = $('<td>', {
        class: "confirmDeleteContainer d-none",
    });
    var confirmDeleteButton = $('<button>', {
        text: 'Confirm',
        type: "button",
        class: "btn btn-outline-danger confirmDeleteButton mb-1",
        on: {
            click: function () {
                const deleteStudentID = parseInt($(this).closest('tr').attr('id'));
                const deleteStudentIndex = student_array.indexOf(studentObj);
                deleteStudentFromServer(deleteStudentID, deleteStudentIndex);
            }
        },
    });
    var cancelConfirmButton = $('<button>', {
        text: 'Cancel',
        type: "button",
        class: "btn btn-outline-secondary cancelConfirmButton mr-1 mb-1",
        on: {
            click: function () {
                $(this).parent().removeClass("d-md-table-cell");
                $(this).parent().siblings(".deleteButtonContainer").addClass("d-md-table-cell");
                $(this).parent().siblings(".updateButtonContainer").addClass("d-md-table-cell");
            }
        },
    });
    let dropDownContainer = $('<div>', {
        class: 'dropdown d-table-cell d-md-none pt-2'
    });
    let dropDownToggle = $('<button>', {
        class: 'btn btn-secondary dropdown-toggle',
        type: 'button',
        id: 'dropdownMenu',
        'data-toggle': 'dropdown',
        'aria-haspopup': 'true',
        'aria-expanded': 'false',
    });
    let dropDownToggleIcon = $('<i>', {
        class: "fas fa-cogs"
    });
    let dropdownMenu = $('<div>', {
        class: 'dropdown-menu dropdown-menu-right',
        'aria-labelledby': 'dropdownMenu'
    });
    let dropdownUpdateBtn = $('<button>', {
        class: 'dropdown-item dropdownUpdate',
        type: 'button',
        text: 'Update',
        on: {
            click: function () {
                $("#updateStudentName, #updateCourse, #updateStudentGrade").removeClass("is-invalid");
                $("#updateModal").modal();
                selectedStudentID = parseInt($(this).closest('tr').attr('id'));
                let studentIndex = student_array.indexOf(studentObj);
                $('.update-modal-title').text("Updating " + student_array[studentIndex].name + "'s Entry");
                $('#updateStudentName').val(student_array[studentIndex].name);
                $("#updateCourse").val(student_array[studentIndex].course_name);
                $("#updateStudentGrade").val(student_array[studentIndex].grade);
            }
        },
    });
    let dropdownDeleteBtn = $('<button>', {
        class: 'dropdown-item dropdownDelete',
        type: 'button',
        text: 'Delete',
        on: {
            click: function () {
                const deleteStudentID = parseInt($(this).closest('tr').attr('id'));
                const deleteStudentIndex = student_array.indexOf(studentObj);
                mobileConfirmDeleteFunction(deleteStudentID, deleteStudentIndex);
            }
        }
    });
    let dropdownBtnSplit = $('<div>', {
        class: 'dropdown-divider'
    });
    $(dropDownToggle).append(dropDownToggleIcon);
    $(dropdownMenu).append(dropdownUpdateBtn, dropdownBtnSplit, dropdownDeleteBtn);
    $(dropDownContainer).append(dropDownToggle, dropdownMenu);
    $(updateButtonContainer).append(updateButton);
    $(deleteButtonContainer).append(deleteButton);
    $(confirmDeleteContainer).append(cancelConfirmButton, confirmDeleteButton);
    $(confirmDeleteContainer).hide();
    var studentListContainer = $('<tr>', {
        id: studentObj.id
    });
    studentListContainer.append(studentName, studentCourse, studentGrade, deleteButtonContainer, updateButtonContainer, confirmDeleteContainer, dropDownContainer);
    $('tbody').append(studentListContainer);
}

function updateStudentList(student, triggerAverage) {
    renderStudentOnDom(student);
    if (triggerAverage === 1) {
        calculateGradeAverage();
    }
}

function deleteStudentFromServer(studentID, studentIndex) {
    const deletedStudentID = '#' + studentID;
    $(deletedStudentID).remove();
    removeStudent(studentIndex);
    function deleteFromServer() {
        var sendData = { id: studentID, action: 'delete' };
        var ajaxConfig = {
            data: sendData,
            dataType: 'json',
            method: 'POST',
            url: 'data.php',
            success: function (response) {
                if (response.success) {
                    deletedStudentSuccess();
                } else {
                    displayErrorModal(response.errors[0]);
                }
            }
        }
        $.ajax(ajaxConfig);
    }
    deleteFromServer();
}

function deletedStudentSuccess() {
    totalNumStudents--;
    const currentPageNum = getCurrentPageNum();
    if (student_array.length === 0 && pageNum === currentPageNum) {
        pageNum--;
        checkPageNum();
        navPageFunction(pageNum);
        calculateGradeAverage();
        goToPagePlaceholder(pageNum);
        return;
    } else if (pageNum !== currentPageNum) {
        const numStudentsArray = Array.from(totalNumStudents.toString());
        if (numStudentsArray[numStudentsArray.length - 1] === "0") {
            pageNum--;
            checkPageNum();
            goToPagePlaceholder(pageNum);
        }
        navPageFunction(currentPageNum);
        calculateGradeAverage();
    };
};

function mobileConfirmDeleteFunction(id, index) {
    $("#confirmDeleteMobileModal").modal();
    $('.confirmDeleteMobileMessage').text("Are you sure you want to delete " + student_array[index].name + "'s entry?");
    $('.mobileConfirmDelete').one('click', function () {
        deleteStudentFromServer(id, index);
    });
};

function updateStudentServer() {
    let invalidTrigger = 0;
    var studentObj = {
        name: $("#updateStudentName").val(),
        course_name: $("#updateCourse").val(),
        grade: parseInt($("#updateStudentGrade").val()),
    }
    if (studentObj.name === "") {
        $("#updateStudentName").addClass("is-invalid");
        invalidTrigger = 1;
    }
    if (studentObj.course_name === "") {
        $("#updateCourse").addClass("is-invalid");
        invalidTrigger = 1;
    }
    if (isNaN(studentObj.grade) || studentObj.grade > 100 || studentObj.grade < 0) {
        $("#updateStudentGrade").addClass("is-invalid");
        invalidTrigger = 1;
    }
    if (invalidTrigger === 1) {
        return;
    } else {
        $("#updateStudentName, #updateCourse, #updateStudentGrade").removeClass("is-invalid");
    }
    var sendData = { name: studentObj.name, course_name: studentObj.course_name, grade: studentObj.grade, id: selectedStudentID, action: 'update' };
    var ajaxConfig = {
        data: sendData,
        dataType: 'json',
        method: 'POST',
        url: 'data.php',
        success: function (response) {
            if (response.success) {
                handleGetDataClick();
                $('#updateModal').modal('toggle');
                $("#updateStudentName, #updateCourse, #updateStudentGrade").val("");
                calculateGradeAverage();
                $('.alert').alert();
            } else {
                displayErrorModal(response.errors[0]);
            }
        }
    }
    $.ajax(ajaxConfig);
}

function calculateGradeAverage() {
    let ajaxConfig = {
        data: { action: 'average' },
        dataType: 'json',
        method: 'POST',
        url: 'data.php',
        success: function (response) {
            if (response.success) {
                const averageGradeNum = response.data[0]["AVG(`grade`)"];
                renderGradeAverage(averageGradeNum);
            } else {
                displayErrorModal(response.errors[0]);
            }
        }
    }
    $.ajax(ajaxConfig);
}

function renderGradeAverage(gradeAverage) {
    var gradeRound = Math.round(gradeAverage);
    $('.avgGrade').text(gradeRound);
}

function removeStudent(studentNum) {
    student_array.splice(studentNum, 1);
}

function handleGetDataClick() {
    $('.mobileSearchBar, .searchBar').removeClass('is-invalid is-valid');
    clearStudentList();
    const currentPageNum = getCurrentPageNum();
    const offsetNum = (currentPageNum * 10) - 10;
    getFromServer(offsetNum, 10);
}

function clearStudentList() {
    $('tbody').empty();
    student_array = [];
};

function getFromServer(sqlOffsetNum, sqlLimitNum) {
    var sendData = { action: 'readAll', sqlOffset: sqlOffsetNum, sqlLimit: sqlLimitNum };
    var ajaxConfig = {
        data: sendData,
        dataType: 'json',
        method: 'POST',
        url: 'data.php',
        success: function (response) {
            if (response.success) {
                const serverList = response.data;
                handleServerDataToDOM(serverList);
            } else {
                displayErrorModal(response.errors[0]);
            }
        }
    }
    $.ajax(ajaxConfig);
}

function handleServerDataToDOM(list) {
    let triggerAverage = 0;
    for (let listCount = 0; listCount < list.length; listCount++) {
        student_array.push(list[listCount]);
        if (listCount === list.length - 1) {
            triggerAverage = 1;
        }
        updateStudentList(list[listCount], triggerAverage);
    };
};

function fetchNumberOfStudentsAndPages() {
    var ajaxConfig = {
        data: { action: 'pagination' },
        dataType: 'json',
        method: 'POST',
        url: 'data.php',
        success: function (response) {
            if (response.success) {
                totalNumStudents = parseInt(response.data[0]);
                pageNum = response.data[1];
                checkPageNum();
                goToPagePlaceholder(pageNum);
            } else {
                displayErrorModal(response.errors[0]);
            }
        }
    }
    $.ajax(ajaxConfig);
}

function firstPageButtonFunction() {
    $('.goToPage').val("");
    clearStudentList();
    getFromServer(0, 10);
    $('.page-item').removeClass('active');
    $('.navPageOne').text(1).parent().addClass('active');
    $('.navPageTwo').text(2);
    $('.navPageThree').text(3);
    $('.navPageFour').text(4);
    $('.navPageFive').text(5);
};

function lastPageButtonFunction() {
    $('.goToPage').val("");
    clearStudentList();
    const lastPageNum = (pageNum * 10) - 10;
    getFromServer(lastPageNum, 10);
    $('.page-item').removeClass('active');
    $('.navPageOne').text(pageNum - 4);
    $('.navPageTwo').text(pageNum - 3);
    $('.navPageThree').text(pageNum - 2);
    $('.navPageFour').text(pageNum - 1);
    $('.navPageFive').text(pageNum).parent().addClass('active');
};

function navPageButtonFunction() {
    $('.goToPage').val("");
    const selectedPageBtnNum = parseInt($(this).text());
    navPageFunction(selectedPageBtnNum);
};

function navPageFunction(selectedPageNum) {
    $('.page-item').removeClass('active');
    clearStudentList();
    getFromServer((selectedPageNum * 10) - 10, 10);
    if (selectedPageNum < 4) {
        let navPageUp = 1;
        $('.navPage').each(function () {
            this.text = navPageUp;
            if (parseInt(this.text) === selectedPageNum) {
                this.parentElement.className += " active";
            };
            navPageUp++;
        });
    } else if (selectedPageNum > pageNum - 3 && selectedPageNum <= pageNum) {
        let navPageDown = 4;
        if (pageNum === 4) {
            navPageDown--;
        } else if (pageNum === 3) {
            navPageDown-2;
        } else if (pageNum === 2) {
            navPageDown-3;
        } else if (pageNum === 1) {
            navPageDown-4;
        };
        $('.navPage').each(function () {
            this.text = pageNum - navPageDown;
            if (parseInt(this.text) === selectedPageNum) {
                this.parentElement.className += " active";
            };
            navPageDown--;
        });
    } else {
        $('.navPageOne').text(selectedPageNum - 2);
        $('.navPageTwo').text(selectedPageNum - 1);
        $('.navPageThree').text(selectedPageNum).parent().addClass('active');
        $('.navPageFour').text(selectedPageNum + 1);
        $('.navPageFive').text(selectedPageNum + 2);
    }
};

function goToPagePlaceholder(num) {
    $('.goToPage').attr("placeholder", "Go To Pages 1- " + num);
};

function gotoPage() {
    const inputNum = parseInt($('.goToPage').val());
    if (inputNum < 1 || inputNum > pageNum || isNaN(inputNum)) {
        $('.goToPage').addClass('is-invalid');
        $('.goToPage').val("");
        return;
    }
    $('.goToPage').val("");
    $('.goToPage').removeClass('is-invalid');
    navPageFunction(inputNum);
}

function checkPageNum() {
    if (pageNum < 5) {
        $('.firstPage, .lastPage').hide();
        switch (pageNum) {
            case 1:
                $('.navPageFive, .navPageFour, .navPageThree, .navPageTwo').hide();
                break;
            case 2:
                $('.navPageFive, .navPageFour, .navPageThree').hide();
                break;
            case 3:
                $('.navPageFive, .navPageFour').hide();
                break;
            case 4:
                $('.navPageFive').hide();
                break;
        }
    } else {
        $('.firstPage, .lastPage, .navPage').show();
    };
}

function searchFunction() {
    $('.mobileSearchBar, .searchBar').removeClass('is-invalid is-valid');
    const searchString = $('.searchBar').val();
    if (searchString === "") {
        $('.mobileSearchFailMsg, .searchFailMsg').text('Please search for valid terms.');
        $('.searchBar').addClass('is-invalid');
        return;
    } else {
        $('.searchBar').removeClass('is-invalid');
        $('.searchBar').val("");
    };
    const searchInput = searchString.split(" ");
    searchFromServer(searchInput);
};

function mobileSearchFunction() {
    $('.mobileSearchBar, .searchBar').removeClass('is-invalid is-valid');
    const searchString = $('.mobileSearchBar').val();
    if (searchString === "") {
        $('.mobileSearchFailMsg, .searchFailMsg').text('Please search for valid terms.');
        $('.mobileSearchBar').addClass('is-invalid');
        return;
    } else {
        $('.mobileSearchBar').removeClass('is-invalid');
        $('.mobileSearchBar').val("");
    };
    const searchInput = searchString.split(" ");
    searchFromServer(searchInput);
};

function searchFromServer(searchInput) {
    var ajaxConfig = {
        data: { action: 'search', search: searchInput },
        dataType: 'json',
        method: 'POST',
        url: 'data.php',
        success: function (response) {
            if (response.success) {
                $('.mobileSearchBar, .searchBar').addClass('is-valid');
                $('.mobileSearchSuccessMsg, .searchSuccessMsg').text("Found " + response.searchCount + " results.");
                displaySearchResults(response.data);
            } else {
                if (response.errors[0] === "no search data") {
                    displayNoResults();
                } else {
                    displayErrorModal(response.errors[0]);
                };
            };
        }
    };
    $.ajax(ajaxConfig);
};

function displaySearchResults(list) {
    clearStudentList();
    for (let listCount = 0; listCount < list.length; listCount++) {
        student_array.push(list[listCount]);
        updateStudentList(list[listCount], 0);
    };
};

function displayNoResults() {
    clearStudentList();
    $('.mobileSearchBar, .searchBar').addClass('is-invalid');
    $('.mobileSearchFailMsg, .searchFailMsg').text('Zero results found.');
};

function displayErrorModal(error) {
    let errorText = "";
    $('#errorModal').modal('toggle');
    switch (error) {
        case 'database error':
            errorText = 'Failed to connect to database. Please try again later. If error persists, please contact the system administrator.';
            break;
        case 'update error':
            $('#updateModal').modal('toggle');
            errorText = 'Update failed. Try to change the student\'s entry. If error persists, please contact the system administrator.';
            break;
        case 'delete error':
            errorText = 'Deletion failed. If error persists, please contact the system administrator.';
            break;
        case 'no data':
            errorText = 'No data available. If error persists, please contact the system administrator.';
            break;
        default:
            errorText = 'Unknown error occured. Please contact the system administrator.';
    }
    $('.modalErrorMessage').text(errorText);
};
