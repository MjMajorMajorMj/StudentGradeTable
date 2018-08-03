$(document).ready(initializeApp);

var student_array = [];
var selectedStudentID = null;

function initializeApp() {
    addClickHandlersToElements();
    getFromServer();
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
    calculateGradeAverage(student_array);
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
                if (!response.success) {
                    displayErrorModal(response.errors[0]);
                }
            }
        }
        $.ajax(ajaxConfig);
    }
    deleteFromServer();
    calculateGradeAverage(student_array);
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
    calculateGradeAverage(student_array);
}

function calculateGradeAverage(studentObj) {
    var studentGradeTotal = null;
    for (var gradeCount = 0; gradeCount < studentObj.length; gradeCount++) {
        var gradeNum = parseInt(studentObj[gradeCount].grade);
        studentGradeTotal += gradeNum;
    }
    if (studentObj.length === 0) {
        studentObj.length = 1;
    }
    let studentGradeAvg = studentGradeTotal / studentObj.length;
    renderGradeAverage(studentGradeAvg);
}

function renderGradeAverage(gradeAverage) {
    var gradeRound = Math.round(gradeAverage);
    $('.avgGrade').text(gradeRound);
}

function removeStudent(studentNum) {
    student_array.splice(studentNum, 1);
}

function handleGetDataClick() {
    $('tbody').empty();
    student_array = [];
    getFromServer();
}

function getFromServer() {
    var sendData = { action: 'readAll' };
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
