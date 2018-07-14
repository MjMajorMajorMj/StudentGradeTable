<?php
if(empty($_GET['id'])){
	$output['errors'][] = 'No ID given.';
};
//check if you have all the data you need from the client-side call.  
//if not, add an appropriate error to errors

//write a query that deletes the student by the given student ID  
$result = null;
$id = $_GET['id'];
$query = "DELETE FROM `student_data` WHERE `student_data`.`id` = $id";
//send the query to the database, store the result of the query into $result
$result = mysqli_query($conn, $query);


//check if $result is empty.  
	//if it is, add 'database error' to errors
//else: 
	//check if the number of affected rows is 1
		//if it did, change output success to true
		
	//if not, add to the errors: 'delete error'
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