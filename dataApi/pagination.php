<?php
$query = "SELECT COUNT(`id`) FROM `student_data`";
$result = null;

$result = mysqli_query($conn, $query);

if (empty($result)) {
	$output['errors'][] = 'database error';
} else {
	if (mysqli_num_rows($result) > 0 ) {
		$output['success'] = true;
		$output['data']=[];
        while( $row = mysqli_fetch_assoc($result)){
            $output['data'][] = $row["COUNT(`id`)"];
            $rawPageNum = $output['data'][0]/10;
            $avgPageNum = ceil($rawPageNum);
            $output['data'][] = $avgPageNum;
        };
    } else {
        $output['errors'][] = 'no data';
    };
};
?>