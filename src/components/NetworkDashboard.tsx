import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

interface NetworkMetrics {
  activeConnections: number;
  totalRequests: number;
  averageResponseTime: number;
  bandwidthUsage: number;
  cpuUsage: number;
  memoryUsage: number;
  uptime: number;
  networkLatency: number;
  packetsTransmitted: number;
  packetsReceived: number;
  errorRate: number;
  history?: Array<{
    timestamp: number;
    connections: number;
    bandwidth: number;
    latency: number;
    cpu: number;
    memory: number;
  }>;
}

interface SensorData {
  [sensorId: string]: {
    sensor: {
      id: string;
      type: string;
      zone: string;
      zoneName: string;
      crop: string;
      status: string;
      battery: number;
      protocol: string;
    };
    latestReading?: {
      value: number;
      unit: string;
      timestamp: number;
      quality: string;
    };
    history: Array<{
      timestamp: number;
      value: number;
      unit: string;
    }>;
  };
}

const NetworkDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<NetworkMetrics | null>(null);
  const [sensorData, setSensorData] = useState<SensorData>({});
  const [alerts, setAlerts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('network');
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io('http://localhost:8081', { withCredentials: true });
    setSocket(socketInstance);

    // Network monitoring events
    socketInstance.on('network:metrics', (data: NetworkMetrics) => {
      setMetrics(data);
    });

    socketInstance.on('network:realtime', (data) => {
      // Update real-time charts
      console.log('Real-time network data:', data);
    });

    // IoT sensor events
    socketInstance.on('sensors:data', (data: SensorData) => {
      setSensorData(data);
    });

    socketInstance.on('sensor:alert', (alert) => {
      setAlerts(prev => [alert, ...prev.slice(0, 9)]); // Keep last 10 alerts
    });

    socketInstance.on('sensor:heartbeat', (data) => {
      console.log('Sensor network heartbeat:', data);
    });

    // Request initial data
    socketInstance.emit('request:network:status');
    socketInstance.emit('request:sensors:data');

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (value: number, type: string) => {
    switch (type) {
      case 'cpu':
      case 'memory':
        return value > 80 ? '#e74c3c' : value > 60 ? '#f39c12' : '#27ae60';
      case 'latency':
        return value > 100 ? '#e74c3c' : value > 50 ? '#f39c12' : '#27ae60';
      default:
        return '#3498db';
    }
  };

  const getSensorsByZone = () => {
    const zones: { [key: string]: any } = {};
    
    Object.entries(sensorData).forEach(([sensorId, data]) => {
      const zone = data.sensor.zone;
      if (!zones[zone]) {
        zones[zone] = {
          name: data.sensor.zoneName,
          crop: data.sensor.crop,
          sensors: []
        };
      }
      zones[zone].sensors.push({ id: sensorId, ...data });
    });
    
    return zones;
  };

  const handleSensorControl = (sensorId: string, action: string) => {
    if (socket) {
      socket.emit('sensor:control', { sensorId, action });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: 'white'
        }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700',
            margin: '0 0 0.5rem 0'
          }}>
            🌐 Network & IoT Dashboard
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
            Real-time network monitoring and farm sensor management
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2rem',
          gap: '1rem'
        }}>
          {[
            { id: 'network', label: '🖥️ Network Monitor', icon: '📊' },
            { id: 'sensors', label: '🌾 IoT Sensors', icon: '📡' },
            { id: 'alerts', label: '⚠️ Alerts', icon: '🚨' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem 2rem',
                border: 'none',
                borderRadius: '25px',
                background: activeTab === tab.id ? 'white' : 'rgba(255,255,255,0.2)',
                color: activeTab === tab.id ? '#667eea' : 'white',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Network Monitor Tab */}
        {activeTab === 'network' && metrics && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Key Metrics Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              {[
                { label: 'Active Connections', value: metrics.activeConnections, icon: '👥', color: '#3498db' },
                { label: 'Network Latency', value: `${metrics.networkLatency}ms`, icon: '⚡', color: getStatusColor(metrics.networkLatency, 'latency') },
                { label: 'CPU Usage', value: `${Math.round(metrics.cpuUsage)}%`, icon: '🖥️', color: getStatusColor(metrics.cpuUsage, 'cpu') },
                { label: 'Memory Usage', value: `${Math.round(metrics.memoryUsage)}%`, icon: '💾', color: getStatusColor(metrics.memoryUsage, 'memory') },
                { label: 'Bandwidth', value: `${Math.round(metrics.bandwidthUsage)} Mbps`, icon: '📶', color: '#9b59b6' },
                { label: 'Uptime', value: formatUptime(metrics.uptime), icon: '⏱️', color: '#27ae60' }
              ].map((metric, idx) => (
                <div key={idx} style={{
                  background: 'white',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    {metric.icon}
                  </div>
                  <div style={{
                    fontSize: '1.8rem',
                    fontWeight: '700',
                    color: metric.color,
                    marginBottom: '0.25rem'
                  }}>
                    {metric.value}
                  </div>
                  <div style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Network Details */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '1.5rem'
            }}>
              {/* Performance Stats */}
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '1.5rem'
              }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>
                  📈 Performance Statistics
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total Requests:</span>
                    <strong>{metrics.totalRequests.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Avg Response Time:</span>
                    <strong>{Math.round(metrics.averageResponseTime)}ms</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Error Rate:</span>
                    <strong style={{ color: metrics.errorRate > 5 ? '#e74c3c' : '#27ae60' }}>
                      {metrics.errorRate}%
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Packets Sent:</span>
                    <strong>{metrics.packetsTransmitted.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Packets Received:</span>
                    <strong>{metrics.packetsReceived.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              {/* Protocol Testing */}
              <div style={{
                background: 'white',
                borderRadius: '15px',
                padding: '1.5rem'
              }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>
                  🔬 Protocol Testing
                </h3>
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {['HTTP', 'HTTPS', 'WebSocket', 'UDP', 'TCP'].map((protocol) => (
                    <button
                      key={protocol}
                      onClick={() => {
                        // Test protocol latency
                        fetch(`http://localhost:8081/api/network/test/${protocol.toLowerCase()}`)
                          .then(res => res.json())
                          .then(data => console.log(`${protocol} test:`, data));
                      }}
                      style={{
                        padding: '0.75rem',
                        border: '2px solid #3498db',
                        borderRadius: '8px',
                        background: 'white',
                        color: '#3498db',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#3498db';
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.color = '#3498db';
                      }}
                    >
                      Test {protocol} Latency
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* IoT Sensors Tab */}
        {activeTab === 'sensors' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {Object.entries(getSensorsByZone()).map(([zoneId, zone]) => (
              <div key={zoneId} style={{
                background: 'white',
                borderRadius: '15px',
                padding: '1.5rem',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  margin: '0 0 1rem 0',
                  color: '#2c3e50',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  🌾 {zone.name} - {zone.crop}
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1rem'
                }}>
                  {zone.sensors.map((sensorData: any) => (
                    <div key={sensorData.id} style={{
                      border: `2px solid ${sensorData.sensor.status === 'active' ? '#27ae60' : '#e74c3c'}`,
                      borderRadius: '10px',
                      padding: '1rem',
                      background: '#f8f9fa'
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0.5rem'
                      }}>
                        <strong style={{ color: '#2c3e50' }}>
                          {sensorData.sensor.type.replace('_', ' ').toUpperCase()}
                        </strong>
                        <span style={{
                          background: sensorData.sensor.status === 'active' ? '#27ae60' : '#e74c3c',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.8rem'
                        }}>
                          {sensorData.sensor.status}
                        </span>
                      </div>
                      
                      {sensorData.latestReading && (
                        <div style={{ marginBottom: '0.75rem' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#3498db' }}>
                            {sensorData.latestReading.value} {sensorData.latestReading.unit}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>
                            Quality: {sensorData.latestReading.quality}
                          </div>
                        </div>
                      )}

                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.85rem',
                        marginBottom: '0.75rem'
                      }}>
                        <span>Protocol: {sensorData.sensor.protocol}</span>
                        <span>Battery: {sensorData.sensor.battery}%</span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleSensorControl(sensorData.id, 'toggle')}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            border: 'none',
                            borderRadius: '6px',
                            background: '#3498db',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          Toggle
                        </button>
                        <button
                          onClick={() => handleSensorControl(sensorData.id, 'calibrate')}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            border: 'none',
                            borderRadius: '6px',
                            background: '#f39c12',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          Calibrate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '1.5rem',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>
              🚨 Recent Alerts
            </h3>
            
            {alerts.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#7f8c8d', padding: '2rem' }}>
                No alerts at the moment. All systems running smoothly! 🟢
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {alerts.map((alert, idx) => (
                  <div key={idx} style={{
                    border: `2px solid ${alert.severity === 'critical' ? '#e74c3c' : alert.severity === 'warning' ? '#f39c12' : '#3498db'}`,
                    borderRadius: '10px',
                    padding: '1rem',
                    background: '#f8f9fa'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <strong style={{ color: '#2c3e50' }}>
                        {alert.zoneName}
                      </strong>
                      <span style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>{alert.message}</div>
                    <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                      💡 {alert.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkDashboard;
