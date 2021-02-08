document.getElementById('copyright').innerHTML= '&copy;' + new Date().getFullYear();

//Muestra u oculta los checkbox de adolescentes y ancianos dependiendo del rango de edad
var pacienteInput = document.getElementById('edad_input');
pacienteInput.addEventListener("keyup", cambiar_formulario);
pacienteInput.addEventListener("change", cambiar_formulario);
function cambiar_formulario(){
    let adolescente = document.getElementById('adolescente_id');
    let anciano = document.getElementById('anciano_id');
    document.getElementById('fumador_check').checked = false;
    document.getElementById('dieta_check').checked = false;
    document.getElementById('fumando_id').value = '';
    adolescente.style.display = 'none';
    anciano.style.display = 'none';
    if ((pacienteInput.value > 15) && (pacienteInput.value < 41)){
        adolescente.style.display = 'block';
    } else if (pacienteInput.value > 40){
        anciano.style.display = 'block';
    }    
}

//Muestra u oculta el input para ingresar los datos del paciente fumador
var fumadorInput = document.getElementById('fumador_input');
var checkboxFumador = document.getElementById('fumador_check');
checkboxFumador.addEventListener("change", validaCheckboxFumador, false);
function validaCheckboxFumador(){
    if(checkboxFumador.checked){
            console.log(checkboxFumador.value)
            fumadorInput.style.display = 'block';
    }else{
            fumadorInput.style.display = 'none';
    }
}

//Calcular la prioridad de los pacientes
function calcular_prioridad(paciente){
    let prioridad = parseInt(paciente.relacionPesoEstatura);
    if (paciente.edad > 15 && paciente.edad < 41){
        if (paciente.fumador == 1){
            //Joven fumador
            prioridad = (paciente.annosfumador / 4) + 2;
        }else{
            //Joven no fumador
            prioridad = 2;
        }
    } else if (paciente.edad > 40){
        if (paciente.dieta == 1){
            if ((paciente.edad > 59) && (paciente.edad < 101)){
                //Anciano con dieta y edad entre 60 y 100 años
                prioridad = (paciente.edad/ 20) + 4;
            }else {
                //Anciano con dieta y edad fuera del rango
                prioridad = (paciente.edad/ 30) + 3;
            }
        }else{
            //Anciano sin dieta
            prioridad = (paciente.edad/ 30) + 3;
        }
    }
    return prioridad.toFixed(2);
}

function calcular_riesgo(paciente){
    let prioridad = calcular_prioridad(paciente);
    if (paciente.edad > 0 && paciente.edad <41){
        let riesgo = (paciente.edad * prioridad) / 100;
        riesgo = riesgo.toFixed(2);
        return riesgo;
    }else {
        let riesgo = ((paciente.edad * prioridad) / 100) + 5.3;
        riesgo = riesgo.toFixed(2);
        return riesgo;
    }
}

function atender_paciente(arreglo){
    let pacientesPrioridades = []
    for (paciente of arreglo){
        let tipoConsulta = '';
        if (paciente.prioridad > 4){
            tipoConsulta = 2;
        }else{
            if (paciente.edad > 0 && paciente.edad < 16){
                tipoConsulta = 1;
            }else{
                tipoConsulta = 3;
            }
        }
        paciente['tipoConsulta'] = tipoConsulta;
        pacientesPrioridades.push(paciente);
    }
    let numeroConsulta = 0;
    let ingreso = 0;
    for (pacientePrioritario of pacientesPrioridades){
        if (ingreso == 1){
            break;
        }
        for (consulta of consultas){
            if (consulta.tipoConsulta == 'Pediatría'){
                numeroConsulta = 1;
            }else if(consulta.tipoConsulta == 'Urgencia'){
                numeroConsulta = 2;
            }else{
                numeroConsulta = 3;
            }
            if((numeroConsulta == pacientePrioritario.tipoConsulta) && (consulta.estado == 'en espera') && (ingreso == 0)){
                ingreso++;
                pacientePrioritario['idConsulta'] = consulta.id;
                console.log(pacientePrioritario.idConsulta)
                let json = JSON.stringify(pacientePrioritario);
                //Envia datos desde JS a PHP
                const xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() 
                {
                    if (xhttp.readyState == 4 && xhttp.status == 200) 
                    {
                        var response = xhttp.responseText;
                        console.log(response);
                    }
                };
                xhttp.open("POST", "atender.php", true);
                xhttp.send(json);
                alert('Paciente '+ pacientePrioritario.nombre +' atendido en la consulta '+ consulta.tipoConsulta +' ID '+ consulta.id +' del doctor '+ consulta.nombreEspecialista);
            }
        }
    }
    if (ingreso == 0){
        alert('Consultas Ocupadas, libere las consultas para atender mas pacientes');
    }
    location.reload();
}

function paciente_mas_anciano(arreglo){
    arreglo.sort(((a, b) => b.edad - a.edad));
    let pacienteMasAnciano = [];
    let templatePacienteAnciano = ``
    for (paciente of arreglo){
        if (paciente.edad == arreglo[0].edad){
            pacienteMasAnciano.push(paciente);
        }
    }
    for (paciente of pacienteMasAnciano){
        templatePacienteAnciano += `
                            <div class="titulo-lista">${paciente.nombre}</div>
                            <div class="titulo-lista">${paciente.edad}</div>
                            <div class="titulo-lista">${paciente.noHistoriaClinica}</div>
                            <div class="titulo-lista">${calcular_prioridad(paciente)}</div>
                            `
    }
    document.getElementById('listaPacienteAnciano').innerHTML = templatePacienteAnciano;
    document.getElementById('listaPA').style.visibility = 'visible';
}

function consulta_mas_pacientes_atendidos(arreglo){
    arreglo.sort(((a, b) => b.cantPacientes - a.cantPacientes));
    let consultasMasAtendidas = [];
    let templateConsultaMasAtendidos = ``
    for (consulta of arreglo){
        if (consulta.cantPacientes == arreglo[0].cantPacientes){
            consultasMasAtendidas.push(consulta);
        }
    }
    for (consulta of consultasMasAtendidas){
        templateConsultaMasAtendidos += `
                            <div class="titulo-lista">${consulta.id}</div>
                            <div class="titulo-lista">${consulta.cantPacientes}</div>
                            <div class="titulo-lista">${consulta.nombreEspecialista}</div>
                            <div class="titulo-lista">${consulta.tipoConsulta}</div>
                            `
    }
    document.getElementById('consultaMasAtendidos').innerHTML = templateConsultaMasAtendidos;
    document.getElementById('consultaMA').style.visibility = 'visible';
}

//Petición AJAX

//Lista de pacientes
const xhr = new XMLHttpRequest();
xhr.open('GET', 'pacientes.php');
xhr.onload = function(){
    if (xhr.status == 200){
        var json = JSON.parse(xhr.responseText);
        var templateListaPacientes = ``;
        let listaCompleta = [];
        json.map(function(data){
            listaCompleta.push(data)
            templateListaPacientes += `
                <div class="titulo-lista">${data.nombre}</div>
                <div class="titulo-lista">${data.edad}</div>
                <div class="titulo-lista">${data.noHistoriaClinica}</div>
                <div class="titulo-lista">${calcular_prioridad(data)}</div>
                <div class="titulo-lista">${calcular_riesgo(data)}</div>
            `;
            return templateListaPacientes;
        });
        document.getElementById('lista').innerHTML = templateListaPacientes;

        //Paciente mas anciano
        document.getElementById('pacienteAnciano').addEventListener('click', function(){paciente_mas_anciano(listaCompleta)})

        //Lista de Pacientes ordenados por prioridad
        var templateListaPacientesEspera = ``;
        var templateListaPacientesEsperaUrgencia = ``;
        var arr = []; //Arreglo para la lista de pacientes en espera
        var arrUrgencia = []; //Arreglo para la lista de pacientes CGI en espera
        json.map(function(data){
                data['prioridad'] = calcular_prioridad(data);
                if (data.prioridad > 4){
                    arrUrgencia.push(data);
                }else{
                    arr.push(data);
                }
        });
        arr.sort(((a, b) => b.prioridad - a.prioridad)); //Ordena el arreglo por prioridad
        arrUrgencia.sort(((a, b) => b.prioridad - a.prioridad)); //Ordena el arreglo por prioridad

        document.getElementById('atenderPaciente').addEventListener('click', function(){atender_paciente(arr)});
        document.getElementById('atenderPacienteUrgencia').addEventListener('click', function(){atender_paciente(arrUrgencia)});

        for (pacienteFumador of arr){
            templateListaPacientesEspera += `
                        <div class="titulo-lista">${pacienteFumador.nombre}</div>
                        <div class="titulo-lista">${pacienteFumador.edad}</div>
                        <div class="titulo-lista">${calcular_prioridad(pacienteFumador)}</div>
                    `;
        }
        for (pacienteFumador of arrUrgencia){
            templateListaPacientesEsperaUrgencia += `
                        <div class="titulo-lista">${pacienteFumador.nombre}</div>
                        <div class="titulo-lista">${pacienteFumador.edad}</div>
                        <div class="titulo-lista">${calcular_prioridad(pacienteFumador)}</div>
                    `;
        }
        document.getElementById('listaPE').innerHTML = templateListaPacientesEspera;
        document.getElementById('listaPEUrgencia').innerHTML = templateListaPacientesEsperaUrgencia;
    }else{
        console("Error código:" + xhr.status);
    }

    //Listar Pacientes mayor riesgo
    let noHistoriaRiesgo;
    document.getElementById('LPMR').addEventListener('click', listar_pacientes_mayor_riesgo);
    function listar_pacientes_mayor_riesgo(){        
        let numeroHistoria = document.getElementById('numeroHistoria').value
        var templateListaPacientesMR = ``
        json.map(function(data){
            if (data.noHistoriaClinica == parseInt(numeroHistoria)){
                noHistoriaRiesgo = calcular_riesgo(data);
                console.log('El riesgo del paciente es: ', calcular_riesgo(data));
            }
        });
        json.map(function(data){
            if (calcular_riesgo(data) > noHistoriaRiesgo){
                templateListaPacientesMR += `
                        <div class="titulo-lista">${data.nombre}</div>
                        <div class="titulo-lista">${data.edad}</div>
                        <div class="titulo-lista">${data.noHistoriaClinica}</div>
                        <div class="titulo-lista">${calcular_riesgo(data)}</div>
                    `;
                return templateListaPacientesMR;
            } 
        });
        document.getElementById('listaPMR').innerHTML = templateListaPacientesMR;
        document.getElementById('listaMR').style.visibility = 'visible';               
    }

    //Pacientes fumadores de mayor riesgo
    document.getElementById('LPFMR').addEventListener("click", listar_pacientes_fumadores_mr);
    function listar_pacientes_fumadores_mr(){
        var templateListaPacientesFumadoresMR = ``;
        var arr = []
        json.map(function(data){
            if(data.fumador == 1){
                data['riesgo'] = calcular_riesgo(data);
                arr.push(data);
                console.log(arr);
            }
        });
        arr.sort(((a, b) => b.riesgo - a.riesgo)); //Ordena el arreglo por riesgo de los fumadores
        for (pacienteFumador of arr){
            templateListaPacientesFumadoresMR += `
                        <div class="titulo-lista">${pacienteFumador.nombre}</div>
                        <div class="titulo-lista">${pacienteFumador.edad}</div>
                        <div class="titulo-lista">${pacienteFumador.noHistoriaClinica}</div>
                        <div class="titulo-lista">${calcular_riesgo(pacienteFumador)}</div>
                    `;
        }
        document.getElementById('listaPFMR').innerHTML = templateListaPacientesFumadoresMR;
        document.getElementById('listaF').style.visibility = 'visible';
    }
    
    //Optimizar atencion
    document.getElementById('optimizarAtencion').addEventListener('click', optimizar_atencion);
    function optimizar_atencion(){
        var arrRiesgo = [];
        var arrPrioridad = [];
        var arrAdoslencente = [];
        var templateListaOptimizada = ``;
        json.map(function(data){
            data['riesgo'] = calcular_riesgo(data);
            if (data.riesgo > 4){
                arrRiesgo.push(data);
            }else if((data.edad < 16 && data.edad > 0) || (data.edad > 40 && data.edad < 100)){
                arrPrioridad.push(data);
            }else{
                arrAdoslencente.push(data);
            }
        });
        arrRiesgo.sort(((a, b) => b.riesgo - a.riesgo)); //Ordena los pacientes de mayor riesgo
        arrPrioridad.sort(((a, b) => b.prioridad - a.prioridad)); //Ordena los niños y ancianos por prioridad
        arrAdoslencente.sort(((a, b) => b.prioridad - a.prioridad)); //Ordena los adolescentes por prioridad
        let arrOptimizado = arrRiesgo.concat(arrPrioridad, arrAdoslencente); //Junta todas las lista para entregar la lista optimizada
        for (paciente of arrOptimizado){
            templateListaOptimizada += `
                        <div class="titulo-lista">${paciente.nombre}</div>
                        <div class="titulo-optimizado">${paciente.edad}</div>
                        <div class="titulo-optimizado">${paciente.noHistoriaClinica}</div>
                        <div class="titulo-optimizado">${calcular_prioridad(paciente)}</div>
                        <div class="titulo-optimizado">${calcular_riesgo(paciente)}</div>
                    `;
        }
        document.getElementById('listaOptimizada').innerHTML = templateListaOptimizada;
        document.getElementById('listaOp').style.visibility = 'visible';
        document.getElementById('atenderPacienteOp').addEventListener('click', function(){atender_paciente(arrOptimizado)});
    }
}
xhr.send()


var consultas = [];
//Lista de Consultas
const httpConsulta = new XMLHttpRequest();
httpConsulta.open('GET', 'consulta.php');
httpConsulta.onload = function(){
    if (httpConsulta.status == 200){
        var json = JSON.parse(httpConsulta.responseText);
        var templateListaConsulta = ``;
        json.map(function(data){
            consultas.push(data);
            templateListaConsulta += `
                <div class="titulo-lista">${data.id}</div>
                <div class="titulo-lista">${data.cantPacientes}</div>
                <div class="titulo-lista">${data.nombreEspecialista}</div>
                <div class="titulo-consulta">${data.tipoConsulta}</div>
                <div class="titulo-lista">${data.estado}</div>
            `;
            return templateListaConsulta;
        });
        document.getElementById('consulta').innerHTML = templateListaConsulta;
        document.getElementById('consultaPAtendidos').addEventListener('click', function(){consulta_mas_pacientes_atendidos(consultas)});
    }else{
        console("Error código:" + httpConsulta.status);
    }
}
httpConsulta.send()