<?
    require $_SERVER['DOCUMENT_ROOT']."/apps/boomyjee/uxcandy_api/trunk/php/uxcandy.php";
?>
<html>
    <head>
        <title>teacss-ui</title>
        <script tea="../src/teacss-ui.tea"></script>
        <script src="/apps/boomyjee/teacss/contexts/lib/teacss.js"></script>
    </head>
    <body>
        <?
            $uxcandy = new \UXCandyAPI();
            echo $uxcandy->owner_panel(false);
        ?>
        Build page for teacss-ui in uxCandy platform.<br>
        <br>
        <script>
            teacss.buildCallback = function (files) {
                console.debug(files);
                FileApi.root = uxcandy.owner+'/'+uxcandy.app;
                var r1 = FileApi.save("/"+uxcandy.version+"/lib/teacss-ui.js",files['/default.js']);
                var r2 = FileApi.save("/"+uxcandy.version+"/lib/teacss-ui.css",files['/default.css']);
                alert(r1+' '+r2);
            }
        </script>
    </body>
</html>