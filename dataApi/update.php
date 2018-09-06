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

$id = $_POST['id'];
$name = filter_var($_POST['name']);
$grade = $_POST['grade'];
$course_name = filter_var($_POST['course_name']);

$result = null;
$query = "UPDATE `student_data` SET `name` = '$name', `grade` = '$grade', `course_name` = '$course_name' WHERE `student_data`.`id` = $id";
$result = mysqli_query($conn, $query);

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