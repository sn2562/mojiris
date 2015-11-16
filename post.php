<?php

//実行が上手く言ったかどうかを確認します
//echo '<script type="text/javascript">
//          console.log("phpから実行中");
//      </script>';

//ajaxでjavascriptから取得した値
$score = $_POST["score"];
$name = $_POST["name"];
$day = $_POST["day"];

//書き込むログファイル名
$file =  __DIR__.'/log.txt';

//ファイルのパーミッションをかえる
// 所有者に読み込み、書き込みの権限を与え、その他には何も許可しない。
//echo chmod($file, 0666);
// ファイルをオープンして既存のコンテンツを取得します
//$current = file_get_contents($file);

$current .= "\n";
//$current .= date('l jS \of F Y h:i:s A');
$current .=$score;
$current .=$name;
$current .=$day;

// 結果をファイルに書き出します
file_put_contents($file, $current,FILE_APPEND | LOCK_EX);
exit;
?>