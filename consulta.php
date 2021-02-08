<?php
    $mysqli = new mysqli('localhost', 'root', '', 'fonasa');
    $mysqli->set_charset("utf8");
    $datos = array();
    $query = $mysqli -> query ("SELECT * FROM consulta");
    while ($valores = mysqli_fetch_array($query)) {
        $id=$valores['ID'];
        $cantPacientes = $valores['cantPacientes'];
        $nombreEspecialista = $valores['nombreEspecialista'];
        $tipoConsulta = $valores['tipoConsulta'];
        $estado = $valores['estado'];

        $datos[] = array('id'=> $id, 'cantPacientes'=> $cantPacientes, 'nombreEspecialista'=> $nombreEspecialista,
                        'tipoConsulta'=> $tipoConsulta, 'estado'=> $estado);
    }
    echo json_encode($datos);
?>