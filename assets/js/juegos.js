let baraja = [];
const tipos = ["C", "D", "H", "S"];
const especiales = ["A", "J", "Q", "K"]; 

// Manejo del DOM
const btnPedir = document.querySelector("#btnPedir");
const btnDetener = document.querySelector("#btnDetener");
const btnNuevo = document.querySelector("#btnNuevo");

// small html 
const puntosHTML = document.querySelectorAll("small");

// inicializar div de jugador y computadora
const divCartasJugador = document.querySelector("#jugador-cartas");
const divCartasComputadora = document.querySelector("#computadora-cartas");

// puntajes
let puntosJugador = 0, puntosComputadora = 0;

// Funcion nueva baraja
const crearBaraja = () => {
    // Limpiamos la baraja vieja por si acaso
    baraja = [];
    
    // crea una baraja con las cartas del 2 al 10, de todos los tipos
    for (let i = 2; i <= 10; i++) {
        for (let tipo of tipos) {
            baraja.push(i + tipo);
        }
    }

    // Agregamos las cartas especiales
    for (let especial of especiales) {
        for (let tipo of tipos) {
            baraja.push(especial + tipo);
        }
    }

    // aleatoriamente mezclamos las cartas (Requiere librería Underscore JS)
    baraja = _.shuffle(baraja);
    return baraja;
};

// Inicializamos la primera baraja
crearBaraja();

// funcion de pedir carta
const pedirCarta = () => {
    if (baraja.length === 0) {
        console.warn("No hay cartas en la baraja");
        throw "No hay cartas en la baraja";
    }
    return baraja.pop();
};

// funcion de valor carta
const valorCarta = (carta) => {
    const valor = carta.substring(0, carta.length - 1);
    let puntos = 0;

    if (isNaN(valor)) {
        // J, Q, K = 10, A = 11
        puntos = valor === "A" ? 11 : 10;
    } else {
        puntos = valor * 1;
    }

    return puntos;
};

// funcion de la computadora
const turnoComputadora = (puntosMinimos) => {
    do {
        const carta = pedirCarta();

        puntosComputadora = puntosComputadora + valorCarta(carta);
        puntosHTML[1].innerText = puntosComputadora;

        const imgCarta = document.createElement("img");
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add("carta");
        divCartasComputadora.append(imgCarta);

        if (puntosMinimos > 21) {
            break;
        }
    } while (puntosComputadora < puntosMinimos && puntosMinimos <= 21);

    // mensaje
    setTimeout(() => {
        if (puntosComputadora === puntosMinimos) {
            alert("Nadie gana, es un empate!");
        } else if (puntosMinimos > 21) {
            alert("La computadora gana. ¡Perdiste!");
        } else if (puntosComputadora > 21) {
            alert("¡Felicidades! Ganaste, la computadora se pasó.");
        } else {
            alert("La computadora gana.");
        }
    }, 150);
};


// pedir carta desde el boton
btnPedir.addEventListener("click", () => {
    const carta = pedirCarta();
    
    puntosJugador = puntosJugador + valorCarta(carta);
    puntosHTML[0].innerText = puntosJugador; 

    // crear y mostrar las cartas
    const imgCarta = document.createElement("img");
    imgCarta.src = `assets/cartas/${carta}.png`;
    imgCarta.classList.add("carta");
    divCartasJugador.append(imgCarta);

    if (puntosJugador > 21) {
        console.warn("perdiste");
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnoComputadora(puntosJugador);
    } else if (puntosJugador === 21) {
        console.warn("21, ganaste");
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        // Si el jugador saca 21 exactos, salta el turno a la computadora para ver si empata
        turnoComputadora(puntosJugador); 
    }
});

btnDetener.addEventListener('click', () => {
    btnPedir.disabled = true;
    btnDetener.disabled = true;
    turnoComputadora(puntosJugador);
});

btnNuevo.addEventListener("click", () => {
    crearBaraja(); 

    puntosJugador = 0;
    puntosComputadora = 0;

    puntosHTML[0].innerText = 0; 
    puntosHTML[1].innerText = 0; 

    divCartasJugador.innerHTML = "";
    divCartasComputadora.innerHTML = "";
    
    btnPedir.disabled = false;
    btnDetener.disabled = false;
});
