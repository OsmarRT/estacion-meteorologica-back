const mqtt = require('mqtt');
require('dotenv').config();

const brokerUrl = process.env.MQTT_BROKER_URL;
const options = {
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    connectTimeout: 4000,
    reconnectPeriod: 1000,
};

// Esta función inicializa la conexión
const initMqtt = () => {
    console.log(`[MQTT] Intentando conectar a ${brokerUrl}...`);
    const client = mqtt.connect(brokerUrl, options);

    // Evento: Conexión exitosa
    client.on('connect', () => {
        console.log('[MQTT] Conectado exitosamente al bróker de HiveMQ.');
        
        // Aquí te suscribes al tópico para escuchar los datos de tus dispositivos
        const topic = process.env.MQTT_TOPIC || 'dispositivos/telemetria';
        client.subscribe(topic, (err) => {
            if (!err) {
                console.log(`[MQTT] Suscrito con éxito al tópico: ${topic}`);
            } else {
                console.error(`[MQTT] Error al suscribirse al tópico ${topic}:`, err);
            }
        });
    });

    // Evento: Recepción de mensajes (Aquí llega la telemetría)
    client.on('message', (topic, message) => {
        try {
            // Convertimos el buffer a string y luego a objeto JSON
            const data = JSON.parse(message.toString());
            console.log(`[MQTT] Mensaje recibido en [${topic}]:`, data);

            // TODO: Aquí puedes procesar los datos o guardarlos en Supabase
            // ejemplo: guardarEnBaseDeDatos(data);

        } catch (error) {
            console.error('[MQTT] Error al parsear el mensaje (¿No es un JSON válido?):', message.toString());
        }
    });

    // Evento: Manejo de errores de conexión
    client.on('error', (err) => {
        console.error('[MQTT] Error en el cliente:', err);
    });

    client.on('reconnect', () => {
        console.log('[MQTT] Intentando reconectar...');
    });

    return client;
};

module.exports = { initMqtt };