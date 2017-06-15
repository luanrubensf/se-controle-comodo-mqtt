(function () {

    var mosq = new Mosquitto();

    var recept = 'MQTTLeandroGabrielRecebe';
    var envia = 'MQTTLeandroGabrielEnvia';
    var url = "wss://iot.eclipse.org:443/ws";
    var index = 0;
    var lastValue = null;

    $('#connect').click(function () {
        return connect();
    });
    $('#disconnect').click(function () {
        return disconnect();
    });

    $('#liga-output').click(function () {
        var payload = "L";//valor a ser enviado

        mosq.publish(envia, payload, 0);
    });

    $('#desliga-output').click(function () {
        var payload = "D";//valor a ser enviado

        mosq.publish(envia, payload, 0);
    });

    mosq.onconnect = function (rc) {
        console.log('conectado');
        $('#log').html('Conectado ao Broker!');

        mosq.subscribe(recept, 0);

        $('#info').show();
        $('#historico').show();
    };$

    mosq.ondisconnect = function (rc) {
        console.log('on desconect...');
        $('#log').html('Desconectado!');
    };

    mosq.onmessage = function (topic, payload, qos) {
        console.log('on message...');
        console.log(payload);

        $('#valorPeso').html(payload);
        adicionaHistorico(payload);
    };

    function adicionaHistorico(payload){
        var now = new Date();

        if(payload == lastValue){
            //return;
        }

        lastValue = payload;

        $('#table > tbody > tr:first-child').before('<tr><td>' + ++index + '</td><td>' + now 
            + '</td><td>' + payload + '</td></tr>');
    }

    //Faz a conexão com servidor MQTT
    function connect() {
        console.log('conectando...');
        mosq.connect(url);
    }

    function disconnect() {
        mosq.disconnect();
    }
})();
