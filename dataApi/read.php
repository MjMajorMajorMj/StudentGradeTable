<?php
$sqlOffset = intval($_POST['sqlOffset']);
$sqlLimit = intval($_POST['sqlLimit']);

$query = "SELECT * FROM `student_data` LIMIT $sqlOffset, $sqlLimit";
$result = null;

$result = mysqli_query($conn, $query);
if (empty($result)) {
	$output['errors'][] = 'database error';
} else {
	if (mysqli_num_rows($result) > 0 ) {
		$output['success'] = true;
        $output['data']=[];
        $rowNum = 0;
        while( $row = mysqli_fetch_assoc($result)){
            $output['data'][] = $row;
        };
    } else {
        $output['errors'][] = 'no data';
    };
};
?>