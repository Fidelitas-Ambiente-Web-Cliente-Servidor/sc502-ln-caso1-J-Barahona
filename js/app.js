/**
 * js/app.js — Restaurante Solo Bueno JC
 *
 * Funciones JavaScript:
 *   renderMenu()         → mostrar cards del menu 
 *   filtrarCategoria()   → filtra el menu por categoria
 *   agregarReserva()     → agregar reserva
 *   validarFormulario()  → valida el formulario
 *   actualizarResumen()  → actualiza el resumen 
 */


// DATOS DEL MENÚ — Array de objetos:

const menu = [
    { nombre: 'Bruschetta Clásica',     descripcion: 'Pan tostado con tomate y albahaca fresca',    precio: 4500,  categoria: 'Entrada'      },
    { nombre: 'Tabla de Quesos',         descripcion: 'Selección de quesos importados con mermelada', precio: 7800,  categoria: 'Entrada'      },
    { nombre: 'Lomo al Vino Tinto',      descripcion: 'Lomo de res en reducción de vino tinto',       precio: 15500, categoria: 'Plato Fuerte' },
    { nombre: 'Pasta Carbonara',         descripcion: 'Pasta con tocino, huevo y queso parmesano',    precio: 10200, categoria: 'Plato Fuerte' },
    { nombre: 'Salmón a la Plancha',     descripcion: 'Filete de salmón con vegetales al vapor',      precio: 13800, categoria: 'Plato Fuerte' },
    { nombre: 'Tiramisú',               descripcion: 'Postre italiano con café y mascarpone',          precio: 5200,  categoria: 'Postre'       },
    { nombre: 'Cheesecake de Maracuyá', descripcion: 'Cheesecake cremoso con coulis de maracuyá',    precio: 4800,  categoria: 'Postre'       },
];

// Arreglo para almacenar las reservas agregadas por el usuario
const reservas = [];


// Funcion: renderMenu
//
function renderMenu(filtro = 'Todos') {

    // Seleccionamos el contenedor donde se insertarán las cards
    const contenedor = document.getElementById('contenedor-menu');

    // Limpiamos el contenedor antes de volver a renderizar
    contenedor.innerHTML = '';

    // Filtramos el arreglo según la categoría elegida
    const platosFiltrados = (filtro === 'Todos')
        ? menu
        : menu.filter(plato => plato.categoria === filtro);

    // Recorremos cada plato y creamos su card con createElement
    platosFiltrados.forEach(plato => {

        // Columna Bootstrap para responsive
        const columna = document.createElement('div');
        columna.classList.add('col-sm-6', 'col-lg-4');

        // Card principal — clase obligatoria: .card-plato
        const card = document.createElement('div');
        card.classList.add('card-plato');

        // Nombre del plato
        const nombre = document.createElement('h3');
        nombre.classList.add('card-nombre');
        nombre.textContent = plato.nombre;

        // Descripción del plato
        const descripcion = document.createElement('p');
        descripcion.classList.add('card-descripcion');
        descripcion.textContent = plato.descripcion;

        // Pie de la card: precio y categoría
        const pie = document.createElement('div');
        pie.classList.add('card-pie');

        // Precio formateado en colones costarricenses 
        const precio = document.createElement('span');
        precio.classList.add('card-precio');
        precio.textContent = formatearPrecio(plato.precio);

        // Etiqueta de categoría
        const categoria = document.createElement('span');
        categoria.classList.add('card-categoria');
        categoria.textContent = plato.categoria;

        // Ensamblamos la card
        pie.appendChild(precio);
        pie.appendChild(categoria);
        card.appendChild(nombre);
        card.appendChild(descripcion);
        card.appendChild(pie);
        columna.appendChild(card);

        // Insertar la columna en el contenedor del menú
        contenedor.appendChild(columna);
    });

    // Si no hay resultados se mostrara un mensaje
    if (platosFiltrados.length === 0) {
        const mensaje = document.createElement('p');
        mensaje.textContent = 'No hay platillos en esta categoría.';
        mensaje.style.color = '#777';
        contenedor.appendChild(mensaje);
    }
}


// Funcion: filtrarCategoria(categoria)
// 
function filtrarCategoria(categoria) {

    // Renderizamos el menú con el filtro recibido
    renderMenu(categoria);

    // Actualizamos la clase "activo" en los botones de filtro
    const botones = document.querySelectorAll('.btn-filtro');
    botones.forEach(boton => {

        // Quitamos la clase activo de todos
        boton.classList.remove('activo');

        // Determinar el texto esperado del botón para comparar
        const textoBotones = {
            'Todos':        'Todos',
            'Entrada':      'Entradas',
            'Plato Fuerte': 'Platos Fuertes',
            'Postre':       'Postres'
        };

        // Marcamos como activo el botón que corresponde a la categoría
        if (boton.textContent === textoBotones[categoria] || boton.textContent === categoria) {
            boton.classList.add('activo');
        }
    });
}


// Funcion: validarFormulario()
// 
function validarFormulario() {

    // Obtenemos los valores de cada campo
    const nombre    = document.getElementById('nombre').value.trim();
    const correo    = document.getElementById('correo').value.trim();
    const fecha     = document.getElementById('fecha').value;
    const hora      = document.getElementById('hora').value;
    const personas  = document.getElementById('personas').value;

    // Variable para rastrear si el formulario es valido 
    let esValido = true;

    // --- Validación: Nombre completo ---
    // Regla: obligatorio, mínimo 5 caracteres, solo letras y espacios
    const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
    if (nombre === '') {
        mostrarError('nombre', 'El nombre completo es obligatorio.');
        esValido = false;
    } else if (nombre.length < 5) {
        mostrarError('nombre', 'El nombre debe tener al menos 5 caracteres.');
        esValido = false;
    } else if (!regexNombre.test(nombre)) {
        mostrarError('nombre', 'El nombre solo puede contener letras y espacios.');
        esValido = false;
    } else {
        limpiarError('nombre');
    }

    // --- Validación: Correo electrónico ---
    // Regla: obligatorio, debe tener formato válido (regex)
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (correo === '') {
        mostrarError('correo', 'El correo electrónico es obligatorio.');
        esValido = false;
    } else if (!regexCorreo.test(correo)) {
        mostrarError('correo', 'Ingrese un correo electrónico válido.');
        esValido = false;
    } else {
        limpiarError('correo');
    }

    // --- Validación: Fecha de reserva ---
    // Regla: obligatoria, no puede ser una fecha pasada
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Comparar solo la fecha, sin hora

    if (fecha === '') {
        mostrarError('fecha', 'La fecha de reserva es obligatoria.');
        esValido = false;
    } else {
        // Parseamos la fecha ingresada (formato YYYY-MM-DD)
        const fechaIngresada = new Date(fecha + 'T00:00:00');
        if (fechaIngresada < hoy) {
            mostrarError('fecha', 'La fecha no puede ser una fecha pasada.');
            esValido = false;
        } else {
            limpiarError('fecha');
        }
    }

    // --- Validación: Hora ---
    // Regla: obligatoria, debe seleccionar una opción
    if (hora === '') {
        mostrarError('hora', 'Debe seleccionar una hora.');
        esValido = false;
    } else {
        limpiarError('hora');
    }

    // --- Validación: Número de personas ---
    // Regla: obligatorio, entre 1 y 20
    if (personas === '') {
        mostrarError('personas', 'El número de personas es obligatorio.');
        esValido = false;
    } else if (parseInt(personas) < 1 || parseInt(personas) > 20) {
        mostrarError('personas', 'Debe ingresar un número entre 1 y 20.');
        esValido = false;
    } else {
        limpiarError('personas');
    }

    // Habilitamos o deshabilitamos el botón según el resultado
    document.getElementById('btn-enviar').disabled = !esValido;

    return esValido;
}


// FUNCIÓN: agregarReserva()
// 
function agregarReserva() {

    //  validamos el formulario antes de procesar
    if (!validarFormulario()) {
        return; 
    }

    // Leemos los datos del formulario:
    const nombre    = document.getElementById('nombre').value.trim();
    const correo    = document.getElementById('correo').value.trim();
    const fecha     = document.getElementById('fecha').value;
    const hora      = document.getElementById('hora').value;
    const personas  = parseInt(document.getElementById('personas').value);
    const comentarios = document.getElementById('comentarios').value.trim();

    // Guardamos la reserva en el arreglo de reservas:
    const nuevaReserva = { nombre, correo, fecha, hora, personas, comentarios };
    reservas.push(nuevaReserva);

    // obeter el cuerpo de la tabla para insertar la fila:
    const cuerpoTabla = document.getElementById('cuerpo-tabla');

    // Creamos la nueva fila — clase obligatoria: .fila-reserva
    const fila = document.createElement('tr');
    fila.classList.add('fila-reserva');

    // Resaltado visual: 6 o más personas reciben la clase grupo-grande
    if (personas >= 6) {
        fila.classList.add('grupo-grande');
    }

    // Creamos cada celda con los datos de la reserva
    const celdas = [nombre, correo, formatearFecha(fecha), hora, personas];
    celdas.forEach(dato => {
        const celda = document.createElement('td');
        celda.textContent = dato;
        fila.appendChild(celda);
    });

    // Agregamos la fila a la tabla
    cuerpoTabla.appendChild(fila);

    // Limpiamos el formulario después de registrar la reserva
    limpiarFormulario();

    // Actualizamos el bloque de resumen
    actualizarResumen();
}


// FUNCIÓN: actualizarResumen()
// 
function actualizarResumen() {

    const contenedorResumen = document.getElementById('resumen');

    // Si no hay reservas, mostramos el mensaje vacío
    if (reservas.length === 0) {
        contenedorResumen.innerHTML = '<p class="resumen-vacio">Aún no hay reservas registradas.</p>';
        return;
    }

    let totalPersonas = 0;
reservas.forEach(reserva => {
    totalPersonas = totalPersonas + reserva.personas;
});

// Encontramos la reserva con mayor número de personas con forEach
let reservaMayor = reservas[0];
reservas.forEach(reserva => {
    if (reserva.personas > reservaMayor.personas) {
        reservaMayor = reserva;
    }
});

    //  HTML del resumen dinámicamente
    contenedorResumen.innerHTML = `
        <p class="resumen-titulo">📊 Resumen de Reservas</p>
        <p class="resumen-dato">Total de reservas: <span>${reservas.length}</span></p>
        <p class="resumen-dato">Total de personas esperadas: <span>${totalPersonas}</span></p>
        <p class="resumen-dato">Reserva con más personas: <span>${reservaMayor.nombre} (${reservaMayor.personas} personas)</span></p>
    `;
}

// ============================================================
// FUNCIONES AUXILIARES
// ============================================================


 //* mostrarError(campo, mensaje)
 //* Muestra el mensaje de error debajo del campo indicado

function mostrarError(campo, mensaje) {
    const spanError = document.getElementById('error-' + campo);
    const inputCampo = document.getElementById(campo);

    if (spanError) spanError.textContent = mensaje;
    if (inputCampo) inputCampo.classList.add('invalido');
}


 //* limpiarError(campo)
 //* Borra el mensaje de error y quita la clase de invlaido del campo
 
function limpiarError(campo) {
    const spanError = document.getElementById('error-' + campo);
    const inputCampo = document.getElementById(campo);

    if (spanError) spanError.textContent = '';
    if (inputCampo) inputCampo.classList.remove('invalido');
}


 //* limpiarFormulario()
 //* Limpia todos los campos del formulario y lo resetea 
 
function limpiarFormulario() {

    // Limpiamos los valores de cada campo
    document.getElementById('nombre').value = '';
    document.getElementById('correo').value = '';
    document.getElementById('fecha').value = '';
    document.getElementById('hora').value = '';
    document.getElementById('personas').value = '';
    document.getElementById('comentarios').value = '';

    // Limpiamos todos los errores visibles
    ['nombre', 'correo', 'fecha', 'hora', 'personas'].forEach(campo => {
        limpiarError(campo);
    });

    // Volvemos a deshabilitar el botón de envío
    document.getElementById('btn-enviar').disabled = true;
}


 //* formatearPrecio
 //* Formatea un número como precio en colones

function formatearPrecio(precio) {
    return '₡' + precio.toLocaleString('es-CR');
}


 //* formatearFecha 
 //* Convierte una fecha en formato YYYY-MM-DD a DD/MM/YYYY.

function formatearFecha(fechaISO) {
    const [anio, mes, dia] = fechaISO.split('-');
    return `${dia}/${mes}/${anio}`;
}


// inicialización — Espera a que el DOM esté completamente cargado

document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('form-reserva').addEventListener('submit', function (e) {
    e.preventDefault();
    agregarReserva();
});

    // Renderizamos el menú completo al cargar la página
    renderMenu();

    // Agregamos listener a cada campo para validar en tiempo real, para que el botón se habilite tan pronto como los campos sean correctos
    const camposObligatorios = ['nombre', 'correo', 'fecha', 'hora', 'personas'];
    camposObligatorios.forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener('input', validarFormulario);
            campo.addEventListener('change', validarFormulario);
        }
    });
});
