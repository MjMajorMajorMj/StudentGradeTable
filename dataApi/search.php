<?php
$result = null;
$searchInput = htmlspecialchars($_POST['search']);

$query = "SELECT * FROM `student_data` WHERE `name` LIKE '%$searchInput%' OR `course_name` LIKE '%$searchInput%'";
$result = mysqli_query($conn, $query);

if (empty($result)) {
	$output['errors'][] = 'database error';
} else {
	if (mysqli_num_rows($result) > 0 ) {
		$output['success'] = true;
		$output['data']=[];
        while( $row = mysqli_fetch_assoc($result)){
            $output['data'][] = $row;
        };
    } else {
        $output['errors'][] = 'no search data';
    };
};
?>