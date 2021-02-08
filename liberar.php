<?php
    //conexion con la base de datos
    $mysqli = new mysqli('localhost', 'root', '', 'fonasa');
    $mysqli->set_charset("utf8");

    $mysqli->query("UPDATE consulta SET estado = 1") or die("<h2>Error guardando los datos</h2>");
    echo'
        <script>
            location.href="index.html";
        </script>
    '
?>