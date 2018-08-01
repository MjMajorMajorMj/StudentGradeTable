<?php
if(empty($_POST['id'])){
	$output['errors'][] = 'No ID given.';
};
if(empty($_POST['name'])){
	$output['errors'][] = 'No student name given.';
};
if(empty($_POST['course_name'])) {
	$output['errors'][] = 'No course name given.';
};
if(empty($_POST['grade'])) {
	$output['errors'][] = 'No grade given.';
};
//check if you have all the data you need from the client-side call.  This should include the fields being changed and the ID of the student to be changed
//if not, add an appropriate error to errors
$id = $_POST['id'];
$name = $_POST['name'];
$grade = $_POST['grade'];
$course_name = $_POST['course_name'];

//write a query that updates the data at the given student ID.  
$result = null;
$query = "UPDATE `student_data` SET `name` = '$name', `grade` = '$grade', `course_name` = '$course_name' WHERE `student_data`.`id` = $id";
//send the query to the database, store the result of the query into $result
$result = mysqli_query($conn, $query);

//check if $result is empty.  
	//if it is, add 'database error' to errors
//else: 
	//check if the number of affected rows is 1.  Please note that if the data updated is EXCACTLY the same as the original data, it will show a result of 0
		//if it did, change output success to true
	//if not, add to the errors: 'update error'
if (empty($result)) {
	$output['errors'][] = 'database error';
} else {
	if (mysqli_affected_rows($conn) > 0 ) {
		$output['success'] = true;
	} else {
		$output['errors'][] = 'update error';
	};
};
?>