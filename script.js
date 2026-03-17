let listaPedidos = [];
let idGerador = 1;

function mudarTela(id) {
    let telas = document.querySelectorAll('.tela');
    for(let i = 0; i < telas.length; i++) {
        telas[i].classList.remove('ativa');
    }
    document.getElementById(id).classList.add('ativa');
}

function montarSalas() {
    let predio = document.getElementById('predio').value;
    let selectSala = document.getElementById('sala');
    
    selectSala.innerHTML = '<option value="">Escolha a sala...</option>';
    
    if (predio != "") {
        selectSala.disabled = false;
        for (let i = 1; i <= 10; i++) {
            selectSala.innerHTML += '<option value="Sala ' + i + '">Sala ' + i + '</option>';
        }
    } else {
        selectSala.disabled = true;
    }
}

function mandarPedido(e) {
    e.preventDefault();

    let pedido = {
        id: idGerador,
        nome: document.getElementById('nome').value,
        curso: document.getElementById('curso').value,
        predio: document.getElementById('predio').value,
        sala: document.getElementById('sala').value,
        data: document.getElementById('data').value,
        inicio: document.getElementById('hora-inicio').value,
        fim: document.getElementById('hora-fim').value,
        recorrente: document.getElementById('recorrente').checked,
        estado: 'espera'
    };

    listaPedidos.push(pedido);
    idGerador++;
    
    alert('Pedido mandado pro Admin!');
    document.getElementById('form-sala').reset();
    document.getElementById('sala').disabled = true;
    mudarTela('tela-inicial');
}

function atualizarAdmin() {
    let divEspera = document.getElementById('lista-espera');
    let divProntas = document.getElementById('lista-prontas');
    
    divEspera.innerHTML = '';
    divProntas.innerHTML = '';

    for (let i = 0; i < listaPedidos.length; i++) {
        let p = listaPedidos[i];
        let textoRecorrente = "";
        if(p.recorrente == true) {
            textoRecorrente = " (Toda semana)";
        }
        
        let htmlCard = '<div class="card">' +
            '<h4>' + p.predio + ' - ' + p.sala + '</h4>' +
            '<p>Aluno: ' + p.nome + ' (' + p.curso + ')</p>' +
            '<p>Dia: ' + p.data + textoRecorrente + '</p>' +
            '<p>Horário: ' + p.inicio + ' até ' + p.fim + '</p>';

        if (p.estado == 'espera') {
            htmlCard += '<div class="acoes">' +
                '<button class="btn-verde" onclick="mudarEstado(' + p.id + ', \'aprovada\')">Aceitar</button> ' +
                '<button class="btn-vermelho" onclick="mudarEstado(' + p.id + ', \'recusada\')">Recusar</button>' +
                '</div></div>';
            divEspera.innerHTML += htmlCard;
        } else if (p.estado == 'aprovada') {
            htmlCard += '</div>';
            divProntas.innerHTML += htmlCard;
        }
    }
}

function mudarEstado(id, novoEstado) {
    let posicao = -1;
    for (let i = 0; i < listaPedidos.length; i++) {
        if (listaPedidos[i].id == id) {
            posicao = i;
            break;
        }
    }

    if (novoEstado == 'aprovada') {
        let p = listaPedidos[posicao];
        let deuChoque = false;

        for (let i = 0; i < listaPedidos.length; i++) {
            let outro = listaPedidos[i];
            
            if (outro.estado == 'aprovada' && outro.predio == p.predio && outro.sala == p.sala && outro.data == p.data) {
                if (p.inicio < outro.fim && p.fim > outro.inicio) {
                    deuChoque = true;
                    break;
                }
            }
        }

        if (deuChoque == true) {
            alert('Não dá pra aceitar! Já tem alguém nessa sala nesse horário.');
            return;
        }
    }

    listaPedidos[posicao].estado = novoEstado;
    atualizarAdmin();
}
