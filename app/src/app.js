(function () {

    var mosq = new Mosquitto();

    var recept = 'MQTTTesteRecebe';
    var enviaVazao = 'MQTTTesteRecebeVazao';
    var enviaLuz = 'MQTTTesteRecebeLuz';
    var enviaPresenca = 'MQTTTesteRecebePresenca';
    var url = "wss://iot.eclipse.org:443/ws";
    // var url = 'ws://iot.eclipse.org:80/ws';

    var lastValueLuz = null;
    var lastValuePresenca = null;

    $('#connect').click(function () {
        return connect();
    });
    $('#disconnect').click(function () {
        return disconnect();
    });

    $('#light').click(function () {
        changeLightImage();
        changeOcupado(1);
    });

    function setTimeoutVazao() {
        setInterval(function () {
            var payload = "33";
            mosq.publish(enviaVazao, payload, 0);
        }, 10000);
    }

    mosq.onconnect = function (rc) {
        console.log('conectado');
        $('#log').html('Conectado ao Broker!');

        mosq.subscribe(recept, 0);
        mosq.subscribe(enviaVazao, 0);
        mosq.subscribe(enviaLuz, 0);
        mosq.subscribe(enviaPresenca, 0);

        setTimeoutVazao();

        showPainel();
    };

    function showPainel() {
        $('#info').show();
        $('#historico').show();
    }

    mosq.ondisconnect = function (rc) {
        console.log('on desconect...');
        $('#log').html('Desconectado!');
        $('#historico').hide();
        $('#info').hide();
    };

    mosq.onmessage = function (topic, payload, qos) {
        console.log('on message...');
        console.log(payload);

        if (topic === enviaVazao) {
            $('#vazaoAtual').html(payload);
            adicionaHistoricoVazao(payload);
        }

        if (topic === enviaLuz) {
            if (lastValueLuz === payload) {
                return;
            }
            lastValueLuz = payload;
            changeLightImage();
        }

        if(topic === enviaPresenca) {
            if(lastValuePresenca === payload) {
                return;
            }
            lastValuePresenca = payload;
            changeOcupado(payload);
        }
    };

    function adicionaHistoricoVazao(payload) {
        var now = new Date();

        lastValue = payload;

        $('#tableVazao > tbody > tr:first-child').before('<tr><td>' + now
            + '</td><td>' + payload + '</td></tr>');
    }

    function changeLightImage() {
        var lightOn = './img/light1.png';
        var lightOff = './img/light2.ico';
        var img = $('#img-light');

        if (img.attr('src') === lightOn) {
            img.attr('src', lightOff);
        } else {
            img.attr('src', lightOn);
        }
    }

    function changeOcupado(valor) {
        var ocupado = $('#ocupado');
        var str = 'DISPONÍVEL';

        if(valor === 1) {
            str = 'OCUPADO';
        }

        ocupado.html('<h2>' + str + '</h2>');
    }

    //Faz a conexão com servidor MQTT
    function connect() {
        console.log('conectando...');
        mosq.connect(url);
        showPainel();
    }

    function disconnect() {
        mosq.disconnect();
    }
})();
