<?php
if(empty($_POST['id'])){
	$output['errors'][] = 'No ID given.';
};

$result = null;
$id = $_POST['id'];
$query = "DELETE FROM `student_data` WHERE `student_data`.`id` = $id";
$result = mysqli_query($conn, $query);

if (empty($result)) {
	$output['errors'][] = 'database error';
} else {
	if (mysqli_affected_rows($conn) > 0 ) {
		$output['success'] = true;
	} else {
		$output['errors'][] = 'delete error';
	};
};
?>