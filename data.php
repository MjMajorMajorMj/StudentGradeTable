<?php
define('fromData',true);

if(empty($_POST['action'])){
	exit('no action specified');
};
require('mysql_connect.php');

$output = [
	'success'=> false,
	'errors'=>[]
];

switch($_POST['action']){
	case 'readAll':
		include 'dataApi/read.php';
		break;
	case 'insert':
		include 'dataApi/insert.php';
		break;
	case 'delete':
		include 'dataApi/delete.php';
		break;
	case 'update':
		include 'dataApi/update.php';
		break;
	case 'average':
		include 'dataApi/averagegrade.php';
		break;
	case 'pagination':
		include 'dataApi/pagination.php';
		break;
	case 'search':
		include 'dataApi/search.php';
		break;
};

$outputJSON = json_encode($output);
print($outputJSON);
?>