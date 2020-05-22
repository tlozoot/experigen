<?php
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-methods');
// Comment out the line below right after data collection
header("Access-Control-Allow-Origin: https://sdb.phonologist.org");


print_r($_FILES); //this will print out the received name, temp name, type, size, etc.
$size = $_FILES['audio_data']['size']; //the size in bytes
$input = $_FILES['audio_data']['tmp_name']; //temporary name that PHP gave to the uploaded file
$output = "files/".$_FILES['audio_data']['name']; //letting the client control the filename is a rather bad idea

//move the file from temp name to local folder using $output name
move_uploaded_file($input, $output)
?>
