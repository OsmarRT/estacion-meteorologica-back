const mqtt = require('mqtt');

// Cambio: el broker ahora se configura con las variables del .env que pediste.
require('dotenv').config();

const brokerUrl = process.env.MQTT_BROKER_URL;

const options = {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
};

function isExampleValue(value) {
  return !value || value.includes('tu-cluster-id.hivemq.cloud') || value.includes('tu_usuario_de_hivemq') || value.includes('tu_contraseña_de_hivemq');
}

function initMqtt() {
  // Cambio: si el .env sigue con valores de ejemplo, no intentamos conectar.
  if (isExampleValue(brokerUrl) || isExampleValue(options.username) || isExampleValue(options.password)) {
    console.log('[MQTT] Configuración de ejemplo detectada. MQTT no se inicializa hasta poner credenciales reales.');
    return null;
  }

  if (!brokerUrl) {
    console.error('[MQTT] Error: MQTT_BROKER_URL no está definido en el archivo .env');
    return null;
  }

  console.log(`[MQTT] Intentando conectar a ${brokerUrl}...`);
  const client = mqtt.connect(brokerUrl, options);

  client.on('connect', () => {
    console.log('[MQTT] ¡Conectado exitosamente a HiveMQ!');

    // Cambio: al conectar, nos suscribimos al tópico de telemetría.
    const topic = process.env.MQTT_TOPIC || 'dispositivos/telemetria';
    client.subscribe(topic, (err) => {
      if (!err) {
        console.log(`[MQTT] Suscrito al tópico: "${topic}". Escuchando mensajes...`);
      } else {
        console.error(`[MQTT] Error al suscribirse al tópico ${topic}:`, err);
      }
    });
  });

  // Cambio: aquí quedan los mensajes que llegan desde el broker.
  client.on('message', (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log(`\n[MQTT] 📥 Nuevo mensaje en [${topic}]:`, data);
      // En el futuro aquí puedes guardar data en Supabase.
    } catch (error) {
      console.error('[MQTT] Mensaje recibido no es un JSON válido:', message.toString());
    }
  });

  client.on('error', (err) => {
    console.error('[MQTT] ❌ Error en el cliente:', err.message);
  });

  client.on('reconnect', () => {
    console.log('[MQTT] Reintentando conexión con el bróker...');
  });

  return client;
}

module.exports = {
  initMqtt,
};