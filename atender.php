<?php
    //conexion con la base de datos
    $mysqli = new mysqli('localhost', 'root', '', 'fonasa');
    $mysqli->set_charset("utf8");
    
    $payload = file_get_contents('php://input');
    $json = json_decode($payload, true);
    var_dump($payload);
    $numeroHC = $json["noHistoriaClinica"];
    $consulta = $json["tipoConsulta"];
    $idConsulta = $json["idConsulta"];
    
    $mysqli->query("UPDATE consulta SET cantPacientes = cantPacientes + 1, estado = 2 WHERE (tipoConsulta = $consulta AND estado = 1 AND ID = $idConsulta)") or die("<h2>Error guardando los datos</h2>");
    $mysqli->query("DELETE FROM paciente WHERE noHistoriaClinica = $numeroHC") or die("<h2>Error eliminando paciente</h2>");
?>