<?php
$result = null;
$searchArray = $_POST['search'];

$queryString = "SELECT * FROM `student_data` WHERE";

for ($i=0; $i < count($searchArray); ++$i) {
    $queryString .= " `name` LIKE '%$searchArray[$i]%' OR `course_name` LIKE '%$searchArray[$i]%'";
    if ($i !== count($searchArray)-1) {
        $queryString .= " OR";
    };
};

$query = $queryString;
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
        $output['searchCount'] = count($output['data']);
    } else {
        $output['errors'][] = 'no search data';
    };
};
?>