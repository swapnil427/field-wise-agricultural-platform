class IoTSensorNetwork {
  constructor(io) {
    this.io = io;
    this.sensors = new Map();
    this.sensorData = new Map();
    this.alertThresholds = {
      soilMoisture: { min: 30, max: 80 },
      temperature: { min: 15, max: 35 },
      humidity: { min: 40, max: 90 },
      ph: { min: 6.0, max: 7.5 },
      nitrogen: { min: 20, max: 100 },
      phosphorus: { min: 15, max: 60 },
      potassium: { min: 20, max: 80 }
    };
    
    this.initializeSensors();
    this.startSensorSimulation();
  }

  initializeSensors() {
    const farmZones = [
      { id: 'field_a', name: 'Field A - Wheat', crop: 'wheat', area: 5.2 },
      { id: 'field_b', name: 'Field B - Rice', crop: 'rice', area: 3.8 },
      { id: 'greenhouse_1', name: 'Greenhouse 1 - Tomatoes', crop: 'tomato', area: 0.5 }
    ];

    farmZones.forEach(zone => {
      const sensorTypes = ['soil_moisture', 'temperature', 'humidity', 'ph_level'];

      sensorTypes.forEach(type => {
        const sensorId = `${zone.id}_${type}`;
        this.sensors.set(sensorId, {
          id: sensorId,
          type: type,
          zone: zone.id,
          zoneName: zone.name,
          crop: zone.crop,
          status: 'active',
          battery: Math.floor(Math.random() * 40) + 60,
          lastUpdate: Date.now(),
          protocol: 'WiFi'
        });

        this.sensorData.set(sensorId, []);
      });
    });
  }

  startSensorSimulation() {
    setInterval(() => {
      this.updateAllSensors();
    }, 10000);
  }

  updateAllSensors() {
    const timestamp = Date.now();
    
    this.sensors.forEach((sensor, sensorId) => {
      if (sensor.status === 'active') {
        const value = this.generateSensorValue(sensor.type, sensor.crop);
        const dataPoint = {
          timestamp,
          value,
          unit: this.getSensorUnit(sensor.type),
          quality: 'good'
        };

        const sensorHistory = this.sensorData.get(sensorId) || [];
        sensorHistory.push(dataPoint);
        
        if (sensorHistory.length > 100) {
          sensorHistory.shift();
        }
        this.sensorData.set(sensorId, sensorHistory);

        sensor.lastUpdate = timestamp;
      }
    });

    this.broadcastSensorData();
  }

  generateSensorValue(type, crop) {
    const baseValues = {
      soil_moisture: { wheat: 45, rice: 75, tomato: 60 },
      temperature: { wheat: 22, rice: 28, tomato: 24 },
      humidity: { wheat: 65, rice: 80, tomato: 70 },
      ph_level: { wheat: 6.8, rice: 6.2, tomato: 6.5 }
    };

    const base = baseValues[type][crop] || 50;
    const variation = base * 0.15;
    return Math.round((base + (Math.random() - 0.5) * 2 * variation) * 100) / 100;
  }

  getSensorUnit(type) {
    const units = {
      soil_moisture: '%',
      temperature: '°C',
      humidity: '%',
      ph_level: 'pH'
    };
    return units[type] || '';
  }

  broadcastSensorData() {
    const allSensorData = {};
    
    this.sensors.forEach((sensor, sensorId) => {
      const history = this.sensorData.get(sensorId) || [];
      const latestReading = history[history.length - 1];
      
      allSensorData[sensorId] = {
        sensor: sensor,
        latestReading: latestReading,
        history: history.slice(-20)
      };
    });

    this.io.emit('sensors:data', allSensorData);
  }

  getSensorNetworkStatus() {
    const zones = {};
    const protocols = {};
    
    this.sensors.forEach(sensor => {
      if (!zones[sensor.zone]) {
        zones[sensor.zone] = {
          name: sensor.zoneName,
          crop: sensor.crop,
          sensors: [],
          activeSensors: 0,
          avgBattery: 0
        };
      }
      
      zones[sensor.zone].sensors.push(sensor);
      if (sensor.status === 'active') {
        zones[sensor.zone].activeSensors++;
      }
    });

    Object.values(zones).forEach(zone => {
      const totalBattery = zone.sensors.reduce((sum, sensor) => sum + sensor.battery, 0);
      zone.avgBattery = Math.round(totalBattery / zone.sensors.length);
    });

    return {
      zones,
      protocols,
      totalSensors: this.sensors.size,
      activeSensors: Array.from(this.sensors.values()).filter(s => s.status === 'active').length,
      lastUpdate: Date.now()
    };
  }

  toggleSensor(sensorId) {
    const sensor = this.sensors.get(sensorId);
    if (sensor) {
      sensor.status = sensor.status === 'active' ? 'offline' : 'active';
      return true;
    }
    return false;
  }

  calibrateSensor(sensorId) {
    const sensor = this.sensors.get(sensorId);
    if (sensor) {
      sensor.battery = 100;
      sensor.lastUpdate = Date.now();
      return true;
    }
    return false;
  }
}

export default IoTSensorNetwork;
