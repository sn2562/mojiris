<?php
//echo "hello, php!!\n";


//時刻を出力する
// 使用するデフォルトのタイムゾーンを指定します。PHP 5.1 以降で使用可能です。
date_default_timezone_set('UTC');
echo date('l jS \of F Y h:i:s A');
echo "\n";


//実行が上手く言ったかどうかを確認します
echo '<script type="text/javascript">
          console.log("phpから実行中");
      </script>';

//ajaxで取得した値
//$score = $_POST["score"];
$score = $_POST["score"];
$name = $_POST["name"];
$day = $_POST["day"];

//書き込むログファイル名
$file =  __DIR__.'/log.txt';
//ファイルのパーミッションをかえる
// 所有者に読み込み、書き込みの権限を与え、その他には何も許可しない。
//echo chmod($file, 0666);
// ファイルをオープンして既存のコンテンツを取得します
$current = file_get_contents($file);
// 新しい人物をファイルに追加します


$current .= "\n";
//$current .= date('l jS \of F Y h:i:s A');
$current .=$score;
$current .=$name;
$current .=$day;

// 結果をファイルに書き出します
file_put_contents($file, $current);
//
//
//$id = $_POST['id'];
//$url = $_POST['url'];

$buff=join(@file($url));

$encode = mb_detect_encoding($buff, 'eucjp-win, UTF-8, sjis-win');
$buff = mb_convert_encoding($buff, 'UTF-8', $encode);

preg_match('/<title>(.*?)<\/title>/is',$buff,$title);

$json['id'] = print_r($id,true);
$json['title'] = print_r($title[1],true);
//echo json_encode($json);

exit;
?>