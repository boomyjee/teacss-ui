<?
    require $_SERVER['DOCUMENT_ROOT']."/apps/boomyjee/bingo/trunk/bingo.php";
    \Cloud::setup(array('db' => false,'run' => false, 'applicationMode' => 'development'));
?>
<html>
    <head>
        <title>teacss-ui</title>
    </head>
    <body>
        <script tea="../src/teacss-ui.tea"></script>
        <?=\Cloud::owner_panel() ?>
        Build page for teacss-ui in uxCandy platform.<br>
        You'll see and extra ui if you're the project owner.<br>
        <br>
        
        <? if (\Cloud::$owner==\Cloud::$user): ?>
            <script>
                function build() {
                    var ui = teacss.build("../src/teacss-ui.tea",
                                          "../src/teacss-ui/style/teacss-ui",false);
                    FileApi.root = "<?= \Cloud::$user.'/'.\Cloud::$app ?>";
                    var r1 = parent.FileApi.save("/trunk/lib/teacss-ui.js",ui.js);
                    var r2 = parent.FileApi.save("/trunk/lib/teacss-ui.css",ui.css);
                    alert(r1+' '+r2);
                }
            </script>
            <button onclick='build();'>Build <b>teacss-ui</b></button>
        
        <? endif ?>
    </body>
</html>