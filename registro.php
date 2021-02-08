<?php
    //conexion con la base de datos
    $mysqli = new mysqli('localhost', 'root', '', 'fonasa');
    $mysqli->set_charset("utf8");

    /*if(!$mysqli){
        echo "<h3>No se ha podido conectar PHP - MySQL, verifique sus datos.</h3><hr><br>";
    }else{
        echo "<h3>Conexion Exitosa PHP - MySQL</h3><hr><br>";
    }*/

    $edad = $_POST['edad'];
    $relacionPesoEstatura = 0;

    if($edad > 0 && $edad < 6){
        $relacionPesoEstatura = 3;
    }else if ($edad > 5 && $edad < 13){
        $relacionPesoEstatura = 2;
    } else if ($edad > 12 && $edad <16){
        $relacionPesoEstatura = 1;
    }

    //Formulario de Registro
        $nombre = $_POST['nombre'];
        $edad = $_POST['edad'];
        $fumador = isset($_POST['fumador']) == 'fumador' ? 1 : 0;
        $annosfumador = $_POST['annosFumador'];
        $dieta = isset($_POST['dieta']) == 'dieta' ? 1 : 0;
        
        $req = (strlen($nombre)*strlen($edad)) or die("No se han llenado los campos");

        //inserta la informacion a la base de datos
        $mysqli->query("INSERT INTO paciente VALUES('$nombre','$edad','','$fumador', '$annosfumador', '$dieta', '$relacionPesoEstatura')") or die("<h2>Error guardando los datos</h2>");
        echo'
            <script>
                location.href="index.html";
            </script>
	    '
?>