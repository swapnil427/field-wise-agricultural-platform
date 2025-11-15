import os from 'os';
import { performance } from 'perf_hooks';

class NetworkMonitor {
  constructor(io) {
    this.io = io;
    this.connections = new Map();
    this.metrics = {
      activeConnections: 0,
      totalRequests: 0,
      averageResponseTime: 0,
      bandwidthUsage: 0,
      cpuUsage: 0,
      memoryUsage: 0,
      uptime: 0,
      networkLatency: 0,
      packetsTransmitted: 0,
      packetsReceived: 0,
      errorRate: 0
    };
    this.startTime = Date.now();
    this.requestTimes = [];
    this.networkHistory = [];
    
    this.startMonitoring();
  }

  startMonitoring() {
    // Real-time metrics every second
    setInterval(() => {
      this.updateRealTimeMetrics();
      this.broadcastRealTimeData();
    }, 1000);

    // Detailed metrics every 5 seconds
    setInterval(() => {
      this.updateDetailedMetrics();
      this.broadcastDetailedMetrics();
    }, 5000);

    // Network history cleanup every minute
    setInterval(() => {
      this.cleanupHistory();
    }, 60000);
  }

  updateRealTimeMetrics() {
    const cpus = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    
    // Simulate realistic network metrics
    const baseLatency = 15;
    const latencyVariation = Math.random() * 10;
    const networkLatency = baseLatency + latencyVariation;
    
    // Simulate bandwidth usage based on active connections
    const connectionMultiplier = Math.min(this.io.engine.clientsCount * 0.5, 10);
    const bandwidthUsage = Math.random() * 20 + connectionMultiplier;
    
    this.metrics = {
      ...this.metrics,
      activeConnections: this.io.engine.clientsCount,
      cpuUsage: this.getCpuUsage(),
      memoryUsage: ((totalMem - freeMem) / totalMem) * 100,
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      networkLatency: Math.round(networkLatency),
      bandwidthUsage: Math.round(bandwidthUsage),
      packetsTransmitted: this.metrics.packetsTransmitted + Math.floor(Math.random() * 50) + 10,
      packetsReceived: this.metrics.packetsReceived + Math.floor(Math.random() * 45) + 8
    };

    // Store history for graphs
    this.networkHistory.push({
      timestamp: Date.now(),
      connections: this.metrics.activeConnections,
      bandwidth: this.metrics.bandwidthUsage,
      latency: this.metrics.networkLatency,
      cpu: this.metrics.cpuUsage,
      memory: this.metrics.memoryUsage
    });
  }

  updateDetailedMetrics() {
    this.metrics.averageResponseTime = this.calculateAverageResponseTime();
    this.metrics.errorRate = this.calculateErrorRate();
  }

  getCpuUsage() {
    // Simulate CPU usage with some randomness
    return Math.min(Math.random() * 25 + this.io.engine.clientsCount * 2, 100);
  }

  recordRequest(startTime, success = true) {
    const responseTime = performance.now() - startTime;
    this.requestTimes.push({
      time: responseTime,
      success: success,
      timestamp: Date.now()
    });
    
    // Keep only last 100 requests
    if (this.requestTimes.length > 100) {
      this.requestTimes.shift();
    }
    
    this.metrics.totalRequests++;
  }

  calculateAverageResponseTime() {
    if (this.requestTimes.length === 0) return 0;
    const sum = this.requestTimes.reduce((a, b) => a + b.time, 0);
    return Math.round(sum / this.requestTimes.length);
  }

  calculateErrorRate() {
    if (this.requestTimes.length === 0) return 0;
    const errors = this.requestTimes.filter(req => !req.success).length;
    return Math.round((errors / this.requestTimes.length) * 100);
  }

  broadcastRealTimeData() {
    this.io.emit('network:realtime', {
      timestamp: Date.now(),
      connections: this.metrics.activeConnections,
      bandwidth: this.metrics.bandwidthUsage,
      latency: this.metrics.networkLatency,
      cpu: this.metrics.cpuUsage,
      memory: this.metrics.memoryUsage
    });
  }

  broadcastDetailedMetrics() {
    this.io.emit('network:metrics', {
      ...this.metrics,
      history: this.networkHistory.slice(-60) // Last 60 data points
    });
  }

  cleanupHistory() {
    // Keep only last hour of data (3600 seconds)
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    this.networkHistory = this.networkHistory.filter(
      entry => entry.timestamp > oneHourAgo
    );
  }

  trackConnection(socketId, userData) {
    this.connections.set(socketId, {
      ...userData,
      connectedAt: Date.now(),
      lastActivity: Date.now(),
      dataTransferred: 0
    });
  }

  updateConnectionActivity(socketId, dataSize = 0) {
    if (this.connections.has(socketId)) {
      const conn = this.connections.get(socketId);
      conn.lastActivity = Date.now();
      conn.dataTransferred += dataSize;
      this.connections.set(socketId, conn);
    }
  }

  removeConnection(socketId) {
    this.connections.delete(socketId);
  }

  getNetworkTopology() {
    const rooms = Array.from(this.io.sockets.adapter.rooms.keys());
    const roomConnections = {};
    
    rooms.forEach(room => {
      const clients = this.io.sockets.adapter.rooms.get(room);
      roomConnections[room] = {
        userCount: clients ? clients.size : 0,
        users: clients ? Array.from(clients) : []
      };
    });

    return {
      totalConnections: this.io.engine.clientsCount,
      rooms: roomConnections,
      namespaces: Object.keys(this.io._nsps || {}),
      serverUptime: this.metrics.uptime
    };
  }

  getMetrics() {
    return {
      ...this.metrics,
      topology: this.getNetworkTopology(),
      connectionDetails: Array.from(this.connections.values())
    };
  }
}

export default NetworkMonitor;
