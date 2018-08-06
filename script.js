$(document).ready(initializeApp);

var student_array = [];
var selectedStudentID = null;
var pageNum = 0;

function initializeApp() {
    addClickHandlersToElements();
    addClickHandlersToPagination();
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
}

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
                updateStudentList(student_array[student_array.length - 1]);
            } else {
                displayErrorModal(response.errors[0]);
            }
        }
    }
    $.ajax(ajaxConfig);
}

function clearAddStudentFormInputs() {
    $("#studentName, #course, #studentGrade").removeClass("is-invalid");
    $("#studentName, #course, #studentGrade").val("");
}

function renderStudentOnDom(studentObj) {
    var studentName = $('<td>', {
        text: studentObj.name
    });
    var studentCourse = $('<td>', {
        text: studentObj.course_name
    });
    var studentGrade = $('<td>', {
        text: studentObj.grade
    });
    var updateButtonContainer = $('<td>', {
        class: "updateButtonContainer"
    });
    var updateButton = $('<button>', {
        text: 'Update',
        type: "button",
        class: "btn btn-info updateButton",
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
        class: "deleteButtonContainer"
    });
    var deleteButton = $('<button>', {
        text: 'Delete',
        type: "button",
        class: "btn btn-danger deleteButton",
        on: {
            click: function () {
                $(this).parent().hide();
                $(this).parent().siblings('.updateButtonContainer').hide();
                $(this).parent().siblings(".confirmDeleteContainer").show();
            }
        },
    });
    var confirmDeleteContainer = $('<td>', {
        class: "confirmDeleteContainer btn-group",
    });
    var confirmDeleteButton = $('<button>', {
        text: 'Confirm',
        type: "button",
        class: "btn btn-outline-danger confirmDeleteButton",
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
        class: "btn btn-outline-secondary cancelConfirmButton",
        on: {
            click: function () {
                $(this).parent().hide();
                $(this).parent().siblings(".deleteButtonContainer").show();
                $(this).parent().siblings(".updateButtonContainer").show();
            }
        },
    });

    $(updateButtonContainer).append(updateButton);
    $(deleteButtonContainer).append(deleteButton);
    $(confirmDeleteContainer).append(confirmDeleteButton, cancelConfirmButton);
    $(confirmDeleteContainer).hide();
    var studentListContainer = $('<tr>', {
        id: studentObj.id
    });
    studentListContainer.append(studentName, studentCourse, studentGrade, updateButtonContainer, deleteButtonContainer, confirmDeleteContainer);
    $('tbody').append(studentListContainer);
}

function updateStudentList(student) {
    renderStudentOnDom(student);
    calculateGradeAverage();
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
                    handleGetDataClick();
                    calculateGradeAverage();
                } else {
                    displayErrorModal(response.errors[0]);
                }
            }
        }
        $.ajax(ajaxConfig);
    }
    deleteFromServer();
}

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
            } else {
                displayErrorModal(response.errors[0]);
            }
        }
    }
    $.ajax(ajaxConfig);
    calculateGradeAverage();
}

function calculateGradeAverage() {
    let ajaxConfig = {
        data: { action: 'average'},
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
    clearStudentList();
    getFromServer(0,10);
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
                var serverList = response.data;
                for (var listCount = 0; listCount < serverList.length; listCount++) {
                    student_array.push(serverList[listCount]);
                    updateStudentList(serverList[listCount]);
                }
            } else {
                displayErrorModal(response.errors[0]);
            }
        }
    }
    $.ajax(ajaxConfig);
}

function addClickHandlersToPagination() {
    $('.firstPage').on('click', firstPageButtonFunction);
    $('.lastPage').on('click', lastPageButtonFunction);
    $('.navPage').on('click', navPageButtonFunction);
}

function fetchNumberOfStudentsAndPages() {
    var ajaxConfig = {
        data: {action:'pagination'},
        dataType: 'json',
        method: 'POST',
        url: 'data.php',
        success: function (response) {
            if (response.success) {
                pageNum = response.data[1];
            } else {
                displayErrorModal(response.errors[0]);
            }
        }
    }
    $.ajax(ajaxConfig);
}

function firstPageButtonFunction() {
    handleGetDataClick();
    $('.page-item').removeClass('active');
    $('.navPageOne').text(1).parent().addClass('active');
    $('.navPageTwo').text(2);
    $('.navPageThree').text(3);
    $('.navPageFour').text(4);
    $('.navPageFive').text(5);
};

function lastPageButtonFunction() {
    clearStudentList();
    const lastPageNum = (pageNum*10)-10;
    getFromServer(lastPageNum,10);
    $('.page-item').removeClass('active');
    $('.navPageOne').text(pageNum-4);
    $('.navPageTwo').text(pageNum-3);
    $('.navPageThree').text(pageNum-2);
    $('.navPageFour').text(pageNum-1);
    $('.navPageFive').text(pageNum).parent().addClass('active');
};

function navPageButtonFunction() {
    $('.page-item').removeClass('active');
    const selectedPageNum = parseInt($(this).text());
    clearStudentList();
    getFromServer((selectedPageNum*10)-10,10);
    if (selectedPageNum < 4) {
        $('.navPageOne').text(1);
        $('.navPageTwo').text(2);
        $('.navPageThree').text(3);
        $('.navPageFour').text(4);
        $('.navPageFive').text(5);
        $(this).parent().addClass('active');
    } else if (selectedPageNum >= pageNum-2 && selectedPageNum <= pageNum) {
        $('.navPageOne').text(pageNum-4);
        $('.navPageTwo').text(pageNum-3);
        $('.navPageThree').text(pageNum-2);
        $('.navPageFour').text(pageNum-1);
        $('.navPageFive').text(pageNum);
        $(this).parent().addClass('active');
    } else {
        $('.navPageOne').text(selectedPageNum-2);
        $('.navPageTwo').text(selectedPageNum-1);
        $('.navPageThree').text(selectedPageNum).parent().addClass('active');
        $('.navPageFour').text(selectedPageNum+1);
        $('.navPageFive').text(selectedPageNum+2);
    }
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
