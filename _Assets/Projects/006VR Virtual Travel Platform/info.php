<?php
echo "<h3 style='text-align:left;'>Aug 13, 2016</h3>\n";
echo "<br/>\n";
$ProjectContent = file("./_Assets/Projects/006VR Virtual Travel Platform/content.html");
$ShortDescription = file("./_Assets/Projects/006VR Virtual Travel Platform/Description.txt");
foreach ($ProjectContent as &$ProjectValue) {
    if(strpos($ProjectValue,"{ShortDescription}") !== false){
        foreach ($ShortDescription as &$ShortDescriptionLine) {
            echo $ShortDescriptionLine;
            echo '<br/><br/>';
        };
    }else{
        echo $ProjectValue;
    };
};
?>