var vaiMudar = false, cont, valor, historico = Array(), memoria = Array(), fe = false, hyp=false; deg="deg";

function atualiza() {
    $(this).css('background-color', 'rgb(192,192,192)');
    valor = $('#valor').text();
    valor = valor.replace(',','.');
    setTimeout(function(){
        $('.col').css('background-color', 'rgb(240, 240, 240)');
        $('.numeros').css('background-color', 'rgb(250, 250, 250)');
    },100);
    $('.col').hover(function(){
        $(this).css('background-color', 'rgb(216,216,216)');
    }, function(){
        $(this).css('background-color', 'rgb(240,240,240)');
    });
    $('.numeros').hover(function(){
        $(this).css('background-color', 'rgb(216,216,216)');
    }, function(){
        $(this).css('background-color', 'rgb(250,250,250)');
    });
}

$(document).on('click', '.numeros', function() {
    atualiza();
    if(valor.length < 15)
        $('#valor').html(valor=="0"||vaiMudar ? $(this).text().trim() : (valor+$(this).text().trim()).replace('.',','));
    vaiMudar = false;
});

$(document).on('click', '.opp', function() {
    atualiza();
    if($(this).text() == "(")
        $('#valor2').html($('#valor2').text()+" "+$(this).text()+" ");
    else
        $('#valor2').html($('#valor2').text()+$('#valor').text() + " "+$(this).text()+" ");
    vaiMudar = true;
});

$(document).on('click', '#c', function() {
    atualiza();
    $('#valor').html('0');
    $('#valor2').html('');
});

$(document).on('click', '#backspace', function() {
    atualiza();
    if(valor != "0" && valor.length != 1)
        $('#valor').html(valor.substring(0, valor.length-1).replace('.',','));
    else if($('#valor').text() == "" || $('#valor').text() == "-" || valor.length == 1)
        $('#valor').html("0");
});

$(document).on('click', '#virgula', function() {
    atualiza();
    if(!valor.includes('.'))
        $('#valor').html(valor+",");
});

$(document).on('click', '#igual', function() {
    atualiza();
    valor2 = $('#valor2').text();
    valor2 = valor2.replace('×','*');
    valor2 = valor2.replace('÷', '/');
    conta = "";
    if(valor2.substring(valor2.length-2, valor2.length-1) == ")")
        conta = valor2;
    else
        conta = valor2 + $('#valor').text();
    resultado = 0;
    conta = conta.replace(',','.');
    historico.push(conta);
    if(conta.includes('^')) {
        conta = conta.split('^');
        aux = 0;
        for(i=0;i<conta.length; i++) {
            if(i==0)
                resultado = eval(conta[0]);
            else 
                resultado = Math.pow(resultado, eval(conta[i]));
        }
    }
    else if(conta.includes('Mod')) {
        conta = conta.split('Mod');
        aux = 0;
        for(i=0;i<conta.length; i++) {
            if(i==0)
                resultado = eval(conta[0]);
            else 
                resultado = resultado%eval(conta[i]);
        }
    }
    else if(conta.includes('yroot')) {
        conta = conta.split('yroot');
        aux = 0;
        for(i=0;i<conta.length; i++) {
            if(i==0)
                resultado = eval(conta[0]);
            else 
                resultado = Math.pow(resultado, 1/eval(conta[i]));
        }
    }
    else 
        resultado = eval(conta);
    $('#valor2').html("");
    vaiMudar = true;
    if(fe) {
        $('#valor').html(resultado.toExponential().toString().replace('.',','));
    }
    else {
        $('#valor').html(resultado.toString().replace('.',','));
    }
    historico.push("<h3>"+resultado+"</h3>");
    localStorage.setItem("historico", historico);
    var historicoLocal = localStorage.getItem("historico");
    while(historicoLocal.includes(','))
        historicoLocal = historicoLocal.replace(',','<br>');
    $('#div-historico').html(historicoLocal);
});
$(document).on('click', '#deg2', function() {
    if(deg == "deg") {
        deg = "rad";
        this.innerHTML = "RAD";
    }
    else if(deg == "rad") {
        deg = "grad";
        this.innerHTML = "GRAD";
    }
    else {
        deg = "deg";
        this.innerHTML = "DEG";
    }
});

document.addEventListener('keydown', function(evt) {
    atualiza();
    evt = evt || window.event;
    var key = evt.keyCode || evt.which;
    if(key>=96 && key<=105) {
        val = key-96;
        $('#'+val).click();
    }
    switch(key) {
        case 8:
            $('#backspace').click();
            break;
        case 27:
            $('#c').click();
            break;
        case 188: case 110:
            $('#virgula').click();
            break;
        case 111: case 193:
            $('#dividir').click();
            break;
        case 106:
            $('#multiplicar').click();
            break;
        case 107: case 187:
            $('#somar').click();
            break;
        case 109: case 189:
            $('#subtrair').click();
            break;
        case 13:
            $('#igual').click();
            break;
    }
});

$(document).on('click', '#memoria', function(){
    $('.tab').html("<div id='div-memoria'>Não há nada salvo na memória</div>");
    var memoriaLocal =localStorage.getItem("memoria");
    while(memoriaLocal.includes(','))
        memoriaLocal = memoriaLocal.replace(',','<br>')
    document.getElementById("div-memoria").innerHTML = memoriaLocal;
    document.getElementById('mem').style.borderBottom = "3px solid red";
    document.getElementById('his').style.borderBottom = "none";
});

$(document).on('click', '#historico', function() {
    $('.tab').html("<div id='div-historico'>Ainda não há histórico</div>");
    var historicoLocal = localStorage.getItem("historico");
    while(historicoLocal.includes(','))
        historicoLocal = historicoLocal.replace(',','<br>');
    $('#div-historico').html(historicoLocal);
    $('#his').css('borderBottom', '3px solid red');
    $('#mem').css('borderBottom', 'none');
});