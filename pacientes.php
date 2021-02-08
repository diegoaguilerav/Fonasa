<?php
    $mysqli = new mysqli('localhost', 'root', '', 'fonasa');
    $mysqli->set_charset("utf8");
    $datos = array();
    $query = $mysqli -> query ("SELECT * FROM paciente");

    while ($valores = mysqli_fetch_array($query)) {
        $nombre=$valores['nombre'];
        $edad = $valores['edad'];
        $noHistoriaClinica = $valores['noHistoriaClinica'];
        $fumador = $valores['fumador'];
        $annosfumador = $valores['annosfumador'];
        $dieta = $valores['dieta'];
        $relacionPesoEstatura = $valores['relacionPesoEstatura'];

        $datos[] = array('nombre'=> $nombre, 'edad'=> $edad, 'noHistoriaClinica'=> $noHistoriaClinica, 'fumador'=> $fumador,
                        'annosfumador'=> $annosfumador, 'dieta'=> $dieta, 'relacionPesoEstatura'=> $relacionPesoEstatura);
    }
    echo json_encode($datos);
?>