<?php
$blacklist = array('.', '..');
$dirs = array_filter(glob('./_Assets/Projects/*'), 'is_dir');

foreach ($dirs as &$dir){
    if(!in_array($dir, $blacklist)){
        echo"<div class='ContentDiv'>\n";
        include $dir.'/info.php';
        echo "</div>\n";
    };
};
?>