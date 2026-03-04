
let datos = [];

window.onload = function() {
    // Agregar valores de ejemplo
    document.getElementById('entradaDatos').value = '15,22,18,25,30,22,18,15,22,25,30,35,22,18,20,25,22,28,32,35';
    document.getElementById('permN').value = '5';
    document.getElementById('permR').value = '3';
    document.getElementById('etapasArbol').value = '2';
    document.getElementById('probabilidadesArbol').value = '0.5,0.3,0.7,0.4';
    document.getElementById('conjuntoA').value = '1,2,3,4,5';
    document.getElementById('conjuntoB').value = '4,5,6,7,8';
    document.getElementById('espacioMuestral').value = '1,2,3,4,5,6';
    document.getElementById('eventoA').value = '1,3,5';
    document.getElementById('eventoB').value = '2,4,6';
    
    // Asignar eventos a los botones
    document.querySelectorAll('.botones button').forEach(btn => {
        if(btn.textContent.includes('Aleatorios')) btn.onclick = generarAleatorios;
        if(btn.textContent.includes('Limpiar')) btn.onclick = limpiarDatos;
        if(btn.textContent.includes('Calcular')) btn.onclick = cargarDatos;
        if(btn.textContent.includes('Permutaciones')) btn.onclick = calcularPermutacion;
        if(btn.textContent.includes('Combinaciones')) btn.onclick = calcularCombinacion;
        if(btn.textContent.includes('Generar Diagrama')) btn.onclick = generarArbol;
        if(btn.textContent.includes('Unión')) btn.onclick = operacionUnion;
        if(btn.textContent.includes('Intersección')) btn.onclick = operacionInterseccion;
        if(btn.textContent.includes('Diferencia')) btn.onclick = operacionDiferencia;
        if(btn.textContent.includes('Calcular Probabilidades')) btn.onclick = calcularProbabilidades;
    });
    
    // Cargar datos iniciales
    cargarDatos();
};

function cargarDatos() {
    let texto = document.getElementById('entradaDatos').value;
    if(texto.trim() === '') {
        datos = [];
    } else {
        datos = texto.split(',').map(n => {
            let num = Number(n.trim());
            return isNaN(num) ? null : num;
        }).filter(n => n !== null);
    }
    actualizarTodo();
}

function generarAleatorios() {
    datos = [];
    let cantidad = 20 + Math.floor(Math.random() * 10);
    for(let i = 0; i < cantidad; i++) {
        datos.push(Math.floor(Math.random() * 40) + 10);
    }
    document.getElementById('entradaDatos').value = datos.join(', ');
    actualizarTodo();
}

function limpiarDatos() {
    datos = [];
    document.getElementById('entradaDatos').value = '';
    actualizarTodo();
}

function calcularMedia() {
    if(datos.length === 0) return 0;
    let suma = 0;
    for(let i = 0; i < datos.length; i++) suma += datos[i];
    return suma / datos.length;
}

function calcularMediana() {
    if(datos.length === 0) return 0;
    let ordenados = [...datos].sort((a,b) => a - b);
    let mitad = Math.floor(ordenados.length / 2);
    if(ordenados.length % 2 === 0) {
        return (ordenados[mitad-1] + ordenados[mitad]) / 2;
    } else {
        return ordenados[mitad];
    }
}

function calcularModa() {
    if(datos.length === 0) return '-';
    let frecuencia = {};
    for(let i = 0; i < datos.length; i++) {
        frecuencia[datos[i]] = (frecuencia[datos[i]] || 0) + 1;
    }
    let max = 0;
    let moda = [];
    for(let valor in frecuencia) {
        if(frecuencia[valor] > max) {
            max = frecuencia[valor];
            moda = [valor];
        } else if(frecuencia[valor] === max) {
            moda.push(valor);
        }
    }
    return max === 1 ? 'No hay' : moda.join(', ');
}

function actualizarEstadisticas() {
    if(datos.length === 0) {
        document.getElementById('media').textContent = '-';
        document.getElementById('mediana').textContent = '-';
        document.getElementById('moda').textContent = '-';
        document.getElementById('minimo').textContent = '-';
        document.getElementById('maximo').textContent = '-';
        document.getElementById('rango').textContent = '-';
        return;
    }
    
    document.getElementById('media').textContent = calcularMedia().toFixed(2);
    document.getElementById('mediana').textContent = calcularMediana().toFixed(2);
    document.getElementById('moda').textContent = calcularModa();
    
    let min = Math.min(...datos);
    let max = Math.max(...datos);
    document.getElementById('minimo').textContent = min;
    document.getElementById('maximo').textContent = max;
    document.getElementById('rango').textContent = (max - min).toFixed(2);
}

function actualizarTabla() {
    let tbody = document.getElementById('cuerpoTabla');
    
    if(datos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No hay datos disponibles</td></tr>';
        return;
    }
    
    // Calcular frecuencias
    let frecuencias = {};
    for(let i = 0; i < datos.length; i++) {
        frecuencias[datos[i]] = (frecuencias[datos[i]] || 0) + 1;
    }
    
    // Ordenar valores
    let valores = Object.keys(frecuencias).map(Number).sort((a,b) => a - b);
    let total = datos.length;
    
    let tabla = '';
    let faa = 0;
    
    for(let i = 0; i < valores.length; i++) {
        let valor = valores[i];
        let fa = frecuencias[valor];
        let fr = ((fa / total) * 100).toFixed(1) + '%';
        faa += fa;
        let fra = ((faa / total) * 100).toFixed(1) + '%';
        
        tabla += '<tr>';
        tabla += '<td>' + valor + '</td>';
        tabla += '<td>' + fa + '</td>';
        tabla += '<td>' + fr + '</td>';
        tabla += '<td>' + faa + '</td>';
        tabla += '<td>' + fra + '</td>';
        tabla += '</tr>';
    }
    
    tbody.innerHTML = tabla;
}

function dibujarHistograma() {
    let canvas = document.getElementById('canvasHistograma');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if(datos.length === 0) return;
    
    let frecuencias = {};
    for(let i = 0; i < datos.length; i++) {
        frecuencias[datos[i]] = (frecuencias[datos[i]] || 0) + 1;
    }
    
    let valores = Object.keys(frecuencias).map(Number).sort((a,b) => a - b);
    let frecs = valores.map(v => frecuencias[v]);
    let maxFrec = Math.max(...frecs);
    
    let anchoBarra = (canvas.width - 80) / valores.length;
    
    // Dibujar ejes
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.moveTo(40, 20);
    ctx.lineTo(40, canvas.height - 30);
    ctx.lineTo(canvas.width - 20, canvas.height - 30);
    ctx.stroke();
    
    // Dibujar barras
    for(let i = 0; i < valores.length; i++) {
        let x = 45 + i * anchoBarra;
        let altura = (frecs[i] / maxFrec) * (canvas.height - 70);
        
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(x, canvas.height - 30 - altura, anchoBarra - 5, altura);
        
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.fillText(valores[i], x + 2, canvas.height - 10);
    }
}

function dibujarPoligono() {
    let canvas = document.getElementById('canvasPoligono');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if(datos.length === 0) return;
    
    let frecuencias = {};
    for(let i = 0; i < datos.length; i++) {
        frecuencias[datos[i]] = (frecuencias[datos[i]] || 0) + 1;
    }
    
    let valores = Object.keys(frecuencias).map(Number).sort((a,b) => a - b);
    let frecs = valores.map(v => frecuencias[v]);
    let maxFrec = Math.max(...frecs);
    
    let anchoPunto = (canvas.width - 80) / (valores.length - 1 || 1);
    
    // Dibujar ejes
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.moveTo(40, 20);
    ctx.lineTo(40, canvas.height - 30);
    ctx.lineTo(canvas.width - 20, canvas.height - 30);
    ctx.stroke();
    
    // Dibujar polígono
    ctx.beginPath();
    ctx.strokeStyle = '#f5576c';
    ctx.lineWidth = 2;
    
    for(let i = 0; i < valores.length; i++) {
        let x = 45 + i * anchoPunto;
        let y = canvas.height - 30 - (frecs[i] / maxFrec) * (canvas.height - 70);
        
        if(i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        ctx.fillStyle = '#f5576c';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.stroke();
}

function dibujarOjiva() {
    let canvas = document.getElementById('canvasOjiva');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if(datos.length === 0) return;
    
    let frecuencias = {};
    for(let i = 0; i < datos.length; i++) {
        frecuencias[datos[i]] = (frecuencias[datos[i]] || 0) + 1;
    }
    
    let valores = Object.keys(frecuencias).map(Number).sort((a,b) => a - b);
    let acumulado = 0;
    let acumulados = [];
    
    for(let i = 0; i < valores.length; i++) {
        acumulado += frecuencias[valores[i]];
        acumulados.push(acumulado);
    }
    
    let maxAcum = Math.max(...acumulados);
    let anchoPunto = (canvas.width - 80) / (valores.length - 1 || 1);
    
    // Dibujar ejes
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.moveTo(40, 20);
    ctx.lineTo(40, canvas.height - 30);
    ctx.lineTo(canvas.width - 20, canvas.height - 30);
    ctx.stroke();
    
    // Dibujar ojiva
    ctx.beginPath();
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;
    
    for(let i = 0; i < valores.length; i++) {
        let x = 45 + i * anchoPunto;
        let y = canvas.height - 30 - (acumulados[i] / maxAcum) * (canvas.height - 70);
        
        if(i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        ctx.fillStyle = '#4CAF50';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
    }
    ctx.stroke();
}

function dibujarPareto() {
    let canvas = document.getElementById('canvasPareto');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if(datos.length === 0) return;
    
    let frecuencias = {};
    for(let i = 0; i < datos.length; i++) {
        frecuencias[datos[i]] = (frecuencias[datos[i]] || 0) + 1;
    }
    
    let pares = Object.entries(frecuencias);
    pares.sort((a, b) => b[1] - a[1]);
    
    let valores = pares.map(p => p[0]);
    let frecs = pares.map(p => p[1]);
    let total = datos.length;
    let maxFrec = Math.max(...frecs);
    
    let anchoBarra = (canvas.width - 100) / valores.length;
    
    // Dibujar ejes
    ctx.beginPath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.moveTo(40, 20);
    ctx.lineTo(40, canvas.height - 30);
    ctx.lineTo(canvas.width - 20, canvas.height - 30);
    ctx.moveTo(canvas.width - 20, canvas.height - 30);
    ctx.lineTo(canvas.width - 20, 20);
    ctx.stroke();
    
    // Dibujar barras
    let acumulado = 0;
    
    for(let i = 0; i < valores.length; i++) {
        let x = 45 + i * anchoBarra;
        let altura = (frecs[i] / maxFrec) * (canvas.height - 70);
        
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(x, canvas.height - 30 - altura, anchoBarra - 5, altura);
        
        ctx.fillStyle = '#333';
        ctx.font = '9px Arial';
        ctx.fillText(valores[i], x + 2, canvas.height - 10);
        
        acumulado += frecs[i];
        let porcentaje = (acumulado / total * 100).toFixed(1);
        
        let xPunto = x + (anchoBarra - 5) / 2;
        let yPunto = canvas.height - 30 - (porcentaje / 100) * (canvas.height - 70);
        
        ctx.fillStyle = '#f5576c';
        ctx.beginPath();
        ctx.arc(xPunto, yPunto, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = '#f5576c';
        ctx.font = '8px Arial';
        ctx.fillText(porcentaje + '%', xPunto + 5, yPunto - 5);
    }
}

function factorial(n) {
    if(n <= 1) return 1;
    let resultado = 1;
    for(let i = 2; i <= n; i++) {
        resultado *= i;
    }
    return resultado;
}

function calcularPermutacion() {
    let n = parseInt(document.getElementById('permN').value) || 0;
    let r = parseInt(document.getElementById('permR').value) || 0;
    
    if(r > n) {
        document.getElementById('resultadoPermutacion').innerHTML = 'Error: r no puede ser mayor que n';
        return;
    }
    
    let perm = factorial(n) / factorial(n - r);
    document.getElementById('resultadoPermutacion').innerHTML = `P(${n},${r}) = ${perm}`;
}

function calcularCombinacion() {
    let n = parseInt(document.getElementById('permN').value) || 0;
    let r = parseInt(document.getElementById('permR').value) || 0;
    
    if(r > n) {
        document.getElementById('resultadoCombinacion').innerHTML = 'Error: r no puede ser mayor que n';
        return;
    }
    
    let comb = factorial(n) / (factorial(r) * factorial(n - r));
    document.getElementById('resultadoCombinacion').innerHTML = `C(${n},${r}) = ${comb}`;
}

function generarArbol() {
    let etapas = parseInt(document.getElementById('etapasArbol').value) || 0;
    let probsTexto = document.getElementById('probabilidadesArbol').value;
    
    if(etapas === 0 || probsTexto.trim() === '') {
        document.getElementById('arbolTexto').textContent = 'Ingrese valores válidos';
        return;
    }
    
    let probs = probsTexto.split(',').map(p => parseFloat(p.trim()));
    
    let total = 1;
    let arbol = 'Diagrama de Árbol:\n';
    arbol += '================\n\n';
    
    for(let i = 0; i < Math.min(etapas, probs.length); i++) {
        total *= probs[i];
        arbol += 'Etapa ' + (i+1) + ': ' + (probs[i]*100).toFixed(1) + '%\n';
        
        for(let j = 0; j < i; j++) arbol += '  ';
        arbol += '  └── Probabilidad: ' + (probs[i]*100).toFixed(1) + '%\n';
    }
    
    arbol += '\nProbabilidad total: ' + (total*100).toFixed(2) + '%';
    
    document.getElementById('arbolTexto').textContent = arbol;
}

function operacionUnion() {
    let aTexto = document.getElementById('conjuntoA').value;
    let bTexto = document.getElementById('conjuntoB').value;
    
    if(aTexto.trim() === '' || bTexto.trim() === '') {
        document.getElementById('resultadoConjuntos').innerHTML = 'Ingrese ambos conjuntos';
        return;
    }
    
    let a = new Set(aTexto.split(',').map(x => x.trim()).filter(x => x !== ''));
    let b = new Set(bTexto.split(',').map(x => x.trim()).filter(x => x !== ''));
    
    let union = new Set([...a, ...b]);
    document.getElementById('resultadoConjuntos').innerHTML = 'Unión: ' + [...union].join(', ');
}

function operacionInterseccion() {
    let aTexto = document.getElementById('conjuntoA').value;
    let bTexto = document.getElementById('conjuntoB').value;
    
    if(aTexto.trim() === '' || bTexto.trim() === '') {
        document.getElementById('resultadoConjuntos').innerHTML = 'Ingrese ambos conjuntos';
        return;
    }
    
    let a = new Set(aTexto.split(',').map(x => x.trim()).filter(x => x !== ''));
    let b = new Set(bTexto.split(',').map(x => x.trim()).filter(x => x !== ''));
    
    let inter = new Set([...a].filter(x => b.has(x)));
    document.getElementById('resultadoConjuntos').innerHTML = 'Intersección: ' + [...inter].join(', ');
}

function operacionDiferencia() {
    let aTexto = document.getElementById('conjuntoA').value;
    let bTexto = document.getElementById('conjuntoB').value;
    
    if(aTexto.trim() === '' || bTexto.trim() === '') {
        document.getElementById('resultadoConjuntos').innerHTML = 'Ingrese ambos conjuntos';
        return;
    }
    
    let a = new Set(aTexto.split(',').map(x => x.trim()).filter(x => x !== ''));
    let b = new Set(bTexto.split(',').map(x => x.trim()).filter(x => x !== ''));
    
    let dif = new Set([...a].filter(x => !b.has(x)));
    document.getElementById('resultadoConjuntos').innerHTML = 'Diferencia (A-B): ' + [...dif].join(', ');
}

function calcularProbabilidades() {
    let espacioTexto = document.getElementById('espacioMuestral').value;
    let aTexto = document.getElementById('eventoA').value;
    let bTexto = document.getElementById('eventoB').value;
    
    if(espacioTexto.trim() === '') {
        document.getElementById('probabilidadResultado').innerHTML = '<h3>Resultados:</h3><div>Ingrese el espacio muestral</div>';
        return;
    }
    
    let espacio = espacioTexto.split(',').map(x => x.trim()).filter(x => x !== '');
    let eventoA = aTexto.split(',').map(x => x.trim()).filter(x => x !== '');
    let eventoB = bTexto.split(',').map(x => x.trim()).filter(x => x !== '');
    
    let total = espacio.length;
    let a = eventoA.filter(x => espacio.includes(x)).length;
    let b = eventoB.filter(x => espacio.includes(x)).length;
    let ab = eventoA.filter(x => eventoB.includes(x) && espacio.includes(x)).length;
    
    let pA = total > 0 ? ((a / total) * 100).toFixed(1) + '%' : '0%';
    let pB = total > 0 ? ((b / total) * 100).toFixed(1) + '%' : '0%';
    let pAB = total > 0 ? ((ab / total) * 100).toFixed(1) + '%' : '0%';
    let pAUB = total > 0 ? (((a + b - ab) / total) * 100).toFixed(1) + '%' : '0%';
    let pAgivenB = b > 0 ? ((ab / b) * 100).toFixed(1) + '%' : '0%';
    
    let resultados = document.getElementById('probabilidadResultado');
    resultados.innerHTML = `
        <h3>Resultados:</h3>
        <div>P(A) = ${pA}</div>
        <div>P(B) = ${pB}</div>
        <div>P(A∩B) = ${pAB}</div>
        <div>P(A∪B) = ${pAUB}</div>
        <div>P(A|B) = ${pAgivenB}</div>
    `;
}

function actualizarTodo() {
    actualizarEstadisticas();
    actualizarTabla();
    dibujarHistograma();
    dibujarPoligono();
    dibujarOjiva();
    dibujarPareto();
}