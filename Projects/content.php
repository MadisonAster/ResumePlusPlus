<?php
/*
$content = file("./Projects/content.html");
foreach ($content as &$value) {
    if(strpos($value,"{contentArea1}") !== false){
    }else{
        echo $value;
    };
};
*/

$blacklist = array('.', '..');
$Projectdirs = array_filter(glob('./_Assets/Projects/*'), 'is_dir');
$Projectdirs = array_reverse($Projectdirs, true);

foreach($Projectdirs as &$Projectdir){
    if(!in_array($Projectdir, $blacklist)){
        $dirArray = explode("/", $Projectdir);
        $folderName = current(array_slice($dirArray, -1));
        $ProjectTitle = substr($folderName, 3);
        //$ProjectDescription = file_get_contents($Projectdir."/Description.txt");
        $ProjectContent = file($Projectdir."/content.html");
        $ProjectDescription = file($Projectdir."/Description.txt");
        if(substr($folderName, 0, 1) !== '_'){
            echo "<div class='ContentDiv'>\n";
            echo "<h2 style='text-align:left;'>".$ProjectTitle."</h2>\n";
            include $Projectdir."/info.php";
            echo "</div>\n";
            echo "<br/><br/>";
    
        };
    };
};


?>