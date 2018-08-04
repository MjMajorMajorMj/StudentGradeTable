<?php
$query = "SELECT AVG(`grade`) FROM `student_data`";
$result = null;

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
        $output['errors'][] = 'no data';
    };
};
?>