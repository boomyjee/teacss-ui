<?
if (isset($_POST['css'])) {
    file_put_contents(realpath(__DIR__."/../lib")."/teacss-ui.js",$_POST['js']);
    file_put_contents(realpath(__DIR__."/../lib")."/teacss-ui.css",$_POST['css']);
    echo 'ok';
    die();
}
?>
<html>
    <head>
        <title>teacss-ui</title>
        <script tea="../src/teacss-ui.tea"></script>
        <script src="http://code.jquery.com/jquery-1.7.2.js"></script>
        <script src="../teacss/lib/teacss.js"></script>
    </head>
    <body>
        Build page for teacss-ui<br>
        <br>
        <script>
            teacss.buildCallback = function (files) {
                var dir = teacss.path.absolute("../src/teacss-ui/style")+"/";
                var css = files['/default.css'];
                while (css.indexOf(dir)!=-1) css = css.replace(dir,"");
                $.post(location.href,{css:css,js:files['/default.js']},function(data){
                    alert(data);
                });
            }
        </script>
    </body>
</html>