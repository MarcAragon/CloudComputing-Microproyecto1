const express = require("express");
const os = require("os");
const Consul = require('consul');

const HOST='192.168.56.3'
const app = express();
const consul = new Consul(
  {host: HOST,
  port: 8500}
);


// Port is provided when running the app:
// node server.js 8080
const port = process.argv[2] || 3000;
const ip = getMachineIp();
const id = Math.random();

function getMachineIp() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (
        iface.family === "IPv4" &&
        !iface.internal &&
        iface.address.startsWith("192.168.56.")
      ) {
        return iface.address;
      }
    }
  }

  return "127.0.0.1";
}

app.get("/", (req, res) => {
  res.send(`Hello this is ${ip} running in port ${port}`);
});

app.get('/health', function (req, res) {
    console.log('Health check!');
    res.end( "Ok." );
    });

app.listen(port, '0.0.0.0', () => {
  console.log(`REST API running at http://localhost:${port}`);
});

/* Registro del servicio */
var check = {
  id: String(id),
  name: 'my-service_' + id,
  address: ip,
  port: Number(port),
  check: {
    http: `http://${ip}:${port}/health`,
    interval: '30s',
    timeout: '5s',
    deregistercriticalserviceafter: '1m'
  }
};

 
consul.agent.service.register(check, function(err) {
  	if (err) throw err;
  	});
