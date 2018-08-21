<?php
if(empty($_POST['name'])){
	$output['errors'][] = 'No student name given.';
};
if(empty($_POST['course_name'])) {
	$output['errors'][] = 'No course name given.';
};
if(empty($_POST['grade'])) {
	$output['errors'][] = 'No grade given.';
};

$result = null;

$name = filter_var($_POST['name'], FILTER_SANITIZE_EMAIL);
$grade = $_POST['grade'];
$course_name = filter_var($_POST['course_name'], FILTER_SANITIZE_EMAIL);

$query = "INSERT INTO `student_data` (`name`, `grade`, `course_name`) VALUES ('$name', '$grade', '$course_name')";

$result = mysqli_query($conn, $query);

if (empty($result)) {
	$output['errors'][] = 'database error';
} else {
	if (mysqli_affected_rows($conn) > 0 ) {
		$output['success'] = true;
		$insertID = mysqli_insert_id($conn);
		$output['insertID'] = $insertID;
	} else {
		$output['errors'][] = 'no data';
	};
};

?>