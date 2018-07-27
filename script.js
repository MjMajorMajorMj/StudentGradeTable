$(document).ready(initializeApp);

var student_array = [];
var studentGradeAvg = null;
var selectedStudentID = null;

function initializeApp(){
      addClickHandlersToElements();
      getFromServer();
}

function addClickHandlersToElements(){
      $(".btnAdd").on('click', handleAddClicked);
      $(".btnCancel").on('click', handleCancelClick);
      $('.btnGetData').on('click', handleGetDataClick);
      $('.btnUpdateToServer').on('click', handleUpdateClick);
}

function handleAddClicked(){
      addStudent();
}

function handleCancelClick(){
      clearAddStudentFormInputs();
}

function handleUpdateClick() {
    updateStudentServer();
}

function addStudent(){
      if (isNaN($("#studentGrade").val())) {
            displayModalError('Invalid Grade');
            return;
      }
      var studentObj = {
            name: $("#studentName").val(),
            course_name: $("#course").val(),
            grade: parseInt($("#studentGrade").val()),
      }
      student_array.push(studentObj);
      clearAddStudentFormInputs();
      var sendData = {name: studentObj.name, course_name:studentObj.course_name, grade:studentObj.grade, action:'insert'};
      var ajaxConfig = {
            data: sendData,
            dataType: 'json',
            method: 'GET',
            url: 'data.php',
            success: function(response) {
                  student_array[student_array.length-1].id = response.insertID;
                  updateStudentList(student_array[student_array.length-1]);
            }
      }
      $.ajax(ajaxConfig);
}

function clearAddStudentFormInputs(){
      $("#studentName, #course, #studentGrade").val("");
}

function renderStudentOnDom(studentObj){
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
      var updateButton =  $('<button>', {
            text: 'Update',
            type: "button",
            class: "btn btn-info updateButton",
            on: {
                  click: function() {
                    displayUpdateModal();
                    selectedStudentID = parseInt($(this).closest('tr').attr('id'));
                    let studentIndex = student_array.indexOf(studentObj);
                  }
            },
      });
      var deleteButtonContainer = $('<td>', {
            class: "deleteButtonContainer"
      });
      var deleteButton =  $('<button>', {
            text: 'Delete',
            type: "button",
            class: "btn btn-danger deleteButton",
            on: {
                  click: function() {
                        var studentID = parseInt($(this).closest('tr').attr('id'));
                        $(this).closest('tr').remove();
                        var studentIndex = student_array.indexOf(studentObj);
                        removeStudent(studentIndex);
                        function deleteFromServer() {
                              var sendData = {id: studentID, action:'delete'};
                              var ajaxConfig = {
                                    data: sendData,
                                    dataType: 'json',
                                    method: 'GET',
                                    url: 'data.php',
                              }
                              $.ajax(ajaxConfig);
                        }
                        deleteFromServer();
                        calculateGradeAverage(student_array);
                        renderGradeAverage();
                  }
            },
      });
      $(updateButtonContainer).append(updateButton);
      $(deleteButtonContainer).append(deleteButton);
      var studentListContainer = $('<tr>', {
            id: studentObj.id
      });
      studentListContainer.append(studentName, studentCourse, studentGrade, updateButtonContainer, deleteButtonContainer);
      $('tbody').append(studentListContainer);
}

function updateStudentList(student){
      renderStudentOnDom(student);;
      calculateGradeAverage(student_array);
      renderGradeAverage();
}

function updateStudentServer() {
    var studentObj = {
        name: $("#updateStudentName").val(),
        course_name: $("#updateCourse").val(),
        grade: parseInt($("#updateStudentGrade").val()),
    }
    var sendData = {name: studentObj.name, course_name:studentObj.course_name, grade:studentObj.grade, id: selectedStudentID, action: 'update' };
    var ajaxConfig = {
        data: sendData,
        dataType: 'json',
        method: 'GET',
        url: 'data.php',
        success: function(response) {
            handleGetDataClick();
            $('#updateModal').modal('toggle');
            $("#updateStudentName, #updateCourse, #updateStudentGrade").val("");
      }
    }
    $.ajax(ajaxConfig);
    calculateGradeAverage(student_array);
    renderGradeAverage(); 
}

function calculateGradeAverage(studentObj){
      var studentGradeTotal = null;
      for (var gradeCount = 0; gradeCount < studentObj.length; gradeCount++) {
            var gradeNum = parseInt(studentObj[gradeCount].grade);
            studentGradeTotal+=gradeNum;
      }
      studentGradeAvg = studentGradeTotal / studentObj.length;
}

function renderGradeAverage(){
      var gradeRound = Math.round(studentGradeAvg);
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
      var sendData = {action:'readAll'};
      var ajaxConfig = {
            data: sendData,
            dataType: 'json',
            method: 'GET',
            url: 'data.php',
            success: function(response) {
                  var serverList = response.data;
                  for (var listCount = 0; listCount < serverList.length; listCount++) {
                        student_array.push(serverList[listCount]);
                        updateStudentList(serverList[listCount]);
                  }
            },
            error: handleError
    }
    $.ajax(ajaxConfig);
}

function displayModalError(errorKey) {
      if (errorKey === 'Invalid Grade') {
            $('.modalError').text('Please input a number in the Grade field.');
      };
      $("#errorModal").modal();
}

function displayUpdateModal() {
      $("#updateModal").modal();
}

function handleError(xhr, status, error) {
      console.log(xhr);
      console.log(status);
      console.log(error);
}