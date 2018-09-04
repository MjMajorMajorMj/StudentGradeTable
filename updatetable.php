<?php
ini_set('display_errors', 1);
require('mysql_connect.php');

$filename = 'studentdataupdate.sql';
$tempvar = '';
$lines = file($filename, FILE_USE_INCLUDE_PATH);
foreach ($lines as $line) {
    if (substr($line, 0, 2) == '--' || $line == '') {
        continue;
    };
    $tempvar .= $line;
    if (substr(trim($line), -1, 1) === ';') {
        mysqli_query($conn, $tempvar);
        $tempvar = '';
    };
};
