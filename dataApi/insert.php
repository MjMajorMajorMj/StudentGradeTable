<?php
if(empty($_GET['name'])){
	$output['errors'][] = 'No student name given.';
};
if(empty($_GET['course_name'])) {
	$output['errors'][] = 'No course name given.';
};
if(empty($_GET['grade'])) {
	$output['errors'][] = 'No grade given.';
};

$result = null;

$name = $_GET['name'];
$grade = $_GET['grade'];
$course_name = $_GET['course_name'];

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