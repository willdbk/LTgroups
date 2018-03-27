<?php
    $txt_file = $_POST['txtfile']
    $file = fopen(,"w");
    fwrite($file, $_POST['data'][1]);
    fclose($myfile);
?>
