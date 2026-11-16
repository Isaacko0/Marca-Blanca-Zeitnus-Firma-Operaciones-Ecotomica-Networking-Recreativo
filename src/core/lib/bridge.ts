// src/core/lib/bridge.ts
// Bridge TypeScript ↔ Python/Hardware — GPIO, I2C, SPI, UART, ADC
// Comunicación con microcontroladores (ESP32, Arduino, Raspberry Pi)
// EBD: ESP-D3, ESP-D4, ESP-D6, ESP-D10

import { EventEmitter } from 'events';

/** Tipos de conexión hardware */
export type HardwareInterface = 'GPIO' | 'I2C' | 'SPI' | 'UART' | 'ADC' | 'PWM' | 'USB' | 'BLE' | 'WIFI';

/** Comando para hardware */
export interface HardwareCommand {
  target: string;                    // Device ID: "mfc_1", "bio_1", "pump_N", "sensor_ph_1"
  command: string;                   // "read", "write", "configure", "calibrate", "execute"
  parameters: Record<string, unknown>;
  timestamp: number;
  id: string;
  priority: number;                  // 1-10
  timeout_ms: number;
}

/** Respuesta de hardware */
export interface HardwareResponse {
  commandId: string;
  success: boolean;
  data?: Record<string, unknown>;
  value?: number;
  error?: string;
  timestamp: number;
  executionTime_ms: number;
}

/** Configuración de pin GPIO */
export interface GPIOPinConfig {
  pin: number;
  mode: 'input' | 'output' | 'input_pullup' | 'input_pulldown' | 'analog' | 'pwm';
  initialValue?: boolean | number;
  debounce_ms?: number;
}

/** Configuración I2C */
export interface I2CConfig {
  bus: number;                       // 0, 1, etc.
  address: number;                   // 0x48, 0x23, etc.
  frequency: number;                 // 100000, 400000 Hz
}

/** Configuración SPI */
export interface SPIConfig {
  bus: number;
  chipSelect: number;
  mode: 0 | 1 | 2 | 3;
  frequency: number;
  bitOrder: 'msb' | 'lsb';
}

/** Configuración UART */
export interface UARTConfig {
  port: string;                      // "/dev/ttyUSB0", "COM3"
  baudRate: number;                  // 9600, 115200, etc.
  dataBits: 5 | 6 | 7 | 8;
  stopBits: 1 | 2;
  parity: 'none' | 'even' | 'odd';
  flowControl: boolean;
}

/** Configuración ADC */
export interface ADCConfig {
  channel: number;
  resolution: 8 | 10 | 12 | 16;     // bits
  referenceVoltage: number;          // 3.3, 5.0 V
  gain?: number;                     // 1, 2, 4, 8 (para ADS1115)
}

/** Dispositivo hardware registrado */
export interface HardwareDevice {
  id: string;
  name: string;
  type: 'MFC' | 'Bioreactor' | 'Sensor' | 'Actuator' | 'Microcontroller' | 'Custom';
  interface: HardwareInterface;
  config: GPIOPinConfig | I2CConfig | SPIConfig | UARTConfig | ADCConfig | Record<string, unknown>;
  firmware?: {
    version: string;
    capabilities: string[];
    lastUpdate: number;
  };
  status: 'disconnected' | 'connecting' | 'connected' | 'error' | 'updating';
  lastSeen: number;
  metadata: Record<string, unknown>;
}

/** Evento de hardware */
export interface HardwareEvent {
  type: 'device_connected' | 'device_disconnected' | 'data' | 'error' | 'firmware_update' | 'calibration_complete';
  deviceId: string;
  timestamp: number;
  data?: Record<string, unknown>;
  error?: string;
}

/** Clase principal Bridge */
export class HardwareBridge extends EventEmitter {
  private devices: Map<string, HardwareDevice> = new Map();
  private commandQueue: HardwareCommand[] = [];
  private processing = false;
  private pythonProcess: any = null; // child_process para Python
  private websocketServer: any = null; // WebSocket para microcontroladores
  private commandHistory: HardwareCommand[] = [];
  private maxHistory = 1000;
  private reconnectTimers: Map<string, NodeJS.Timeout> = new Map();
  private config: BridgeConfig;

  constructor(config: Partial<BridgeConfig> = {}) {
    super();
    this.config = {
      pythonBridge: true,
      pythonScript: './bridge_hardware.py',
      websocketPort: 8080,
      commandTimeout_ms: 5000,
      maxRetries: 3,
      retryDelay_ms: 1000,
      autoReconnect: true,
      logLevel: 'info',
      ...config
    };
  }

  /** Inicializa bridge */
  public async initialize(): Promise<void> {
    // Iniciar proceso Python para GPIO/I2C/SPI real
    if (this.config.pythonBridge) {
      await this.startPythonBridge();
    }
    
    // Iniciar WebSocket server para microcontroladores
    await this.startWebSocketServer();
    
    this.emit('initialized', { 
      pythonBridge: this.config.pythonBridge, 
      websocketPort: this.config.websocketPort 
    });
  }

  /** Inicia bridge Python (RPi.GPIO, smbus2, spidev, pyserial) */
  private async startPythonBridge(): Promise<void> {
    try {
      // En producción: spawn child_process con script Python
      // const { spawn } = require('child_process');
      // this.pythonProcess = spawn('python3', [this.config.pythonScript]);
      // this.pythonProcess.stdout.on('data', this.handlePythonOutput.bind(this));
      // this.pythonProcess.stderr.on('data', this.handlePythonError.bind(this));
      
      this.log('info', 'Python bridge simulado iniciado');
    } catch (error) {
      this.log('error', `Error iniciando Python bridge: ${error}`);
    }
  }

  /** Inicia WebSocket server para ESP32/Arduino */
  private async startWebSocketServer(): Promise<void> {
    try {
      // En producción: WebSocket server (ws library)
      // this.websocketServer = new WebSocket.Server({ port: this.config.websocketPort });
      // this.websocketServer.on('connection', this.handleWSConnection.bind(this));
      
      this.log('info', `WebSocket server simulado en puerto ${this.config.websocketPort}`);
    } catch (error) {
      this.log('error', `Error iniciando WebSocket: ${error}`);
    }
  }

  /** Registra dispositivo hardware */
  public registerDevice(device: HardwareDevice): void {
    this.devices.set(device.id, {
      ...device,
      status: 'disconnected',
      lastSeen: Date.now()
    });
    this.emit('device:registered', device);
    this.log('info', `Dispositivo registrado: ${device.id} (${device.type})`);
  }

  /** Desregistra dispositivo */
  public unregisterDevice(deviceId: string): boolean {
    const device = this.devices.get(deviceId);
    if (device) {
      this.disconnectDevice(deviceId);
      this.devices.delete(deviceId);
      this.emit('device:unregistered', { deviceId });
      return true;
    }
    return false;
  }

  /** Conecta dispositivo */
  public async connectDevice(deviceId: string): Promise<boolean> {
    const device = this.devices.get(deviceId);
    if (!device) return false;
    
    device.status = 'connecting';
    
    try {
      // En producción: conexión real según interface
      switch (device.interface) {
        case 'GPIO':
          await this.setupGPIO(device);
          break;
        case 'I2C':
          await this.setupI2C(device);
          break;
        case 'SPI':
          await this.setupSPI(device);
          break;
        case 'UART':
          await this.setupUART(device);
          break;
        case 'ADC':
          await this.setupADC(device);
          break;
        case 'WIFI':
        case 'BLE':
          await this.connectWireless(device);
          break;
      }
      
      device.status = 'connected';
      device.lastSeen = Date.now();
      this.emit('device:connected', device);
      this.log('info', `Dispositivo conectado: ${deviceId}`);
      return true;
      
    } catch (error) {
      device.status = 'error';
      this.emit('device:error', { deviceId, error: String(error) });
      this.log('error', `Error conectando ${deviceId}: ${error}`);
      
      if (this.config.autoReconnect) {
        this.scheduleReconnect(deviceId);
      }
      return false;
    }
  }

  /** Desconecta dispositivo */
  public async disconnectDevice(deviceId: string): Promise<void> {
    const device = this.devices.get(deviceId);
    if (!device) return;
    
    // Limpiar timers de reconexión
    const timer = this.reconnectTimers.get(deviceId);
    if (timer) {
      clearTimeout(timer);
      this.reconnectTimers.delete(deviceId);
    }
    
    device.status = 'disconnected';
    this.emit('device:disconnected', { deviceId });
  }

  /** Ejecuta comando en hardware */
  public async executeCommand(command: Omit<HardwareCommand, 'id' | 'timestamp'>): Promise<HardwareResponse> {
    const fullCommand: HardwareCommand = {
      ...command,
      id: `cmd_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now()
    };
    
    this.commandHistory.push(fullCommand);
    if (this.commandHistory.length > this.maxHistory) {
      this.commandHistory.shift();
    }
    
    // Enviar comando via Python bridge o WebSocket
    return this.sendCommand(fullCommand);
  }

  /** Lee sensor */
  public async readSensor(sensorId: string): Promise<{ value: number; units: string; quality: string } | null> {
    const device = this.devices.get(sensorId);
    if (!device || device.type !== 'Sensor') {
      // Buscar sensor dentro de dispositivo compuesto
      for (const [, d] of this.devices) {
        if (d.metadata.sensors?.includes(sensorId)) {
          return this.readSensorFromDevice(d, sensorId);
        }
      }
      return null;
    }
    
    return this.readSensorFromDevice(device, sensorId);
  }

  /** Lee sensor desde dispositivo */
  private async readSensorFromDevice(device: HardwareDevice, sensorId: string): Promise<{ value: number; units: string; quality: string } | null> {
    const response = await this.executeCommand({
      target: device.id,
      command: 'read',
      parameters: { sensor: sensorId },
      priority: 5,
      timeout_ms: this.config.commandTimeout_ms
    });
    
    if (response.success && response.value !== undefined) {
      return {
        value: response.value,
        units: (response.data?.units as string) || '',
        quality: (response.data?.quality as string) || 'good'
      };
    }
    
    return null;
  }

  /** Escribe actuador */
  public async writeActuator(actuatorId: string, value: number | boolean, parameters?: Record<string, unknown>): Promise<boolean> {
    const device = this.devices.get(actuatorId);
    if (!device || device.type !== 'Actuator') {
      // Buscar en dispositivos compuestos
      for (const [, d] of this.devices) {
        if (d.metadata.actuators?.includes(actuatorId)) {
          return this.writeActuatorToDevice(d, actuatorId, value, parameters);
        }
      }
      return false;
    }
    
    return this.writeActuatorToDevice(device, actuatorId, value, parameters);
  }

  private async writeActuatorToDevice(device: HardwareDevice, actuatorId: string, value: number | boolean, parameters?: Record<string, unknown>): Promise<boolean> {
    const response = await this.executeCommand({
      target: device.id,
      command: 'write',
      parameters: { actuator: actuatorId, value, ...parameters },
      priority: 7,
      timeout_ms: this.config.commandTimeout_ms
    });
    
    return response.success;
  }

  /** Envía comando (Python bridge o WebSocket) */
  private async sendCommand(command: HardwareCommand): Promise<HardwareResponse> {
    const startTime = Date.now();
    
    // Simulación para desarrollo
    if (this.config.pythonBridge && this.pythonProcess) {
      // En producción: this.pythonProcess.stdin.write(JSON.stringify(command) + '\n');
      // return this.waitForPythonResponse(command.id);
    }
    
    if (this.websocketServer) {
      // En producción: broadcast a dispositivo específico via WebSocket
      // return this.waitForWSResponse(command.id);
    }
    
    // Simulación realista
    return this.simulateHardwareResponse(command, startTime);
  }

  /** Simula respuesta hardware */
  private async simulateHardwareResponse(command: HardwareCommand, startTime: number): Promise<HardwareResponse> {
    // Simular latencia
    await new Promise(r => setTimeout(r, 10 + Math.random() * 50));
    
    const device = this.devices.get(command.target);
    const executionTime = Date.now() - startTime;
    
    // Comandos conocidos
    switch (command.command) {
      case 'read':
        return this.simulateSensorRead(command, device, executionTime);
      case 'write':
        return this.simulateActuatorWrite(command, device, executionTime);
      case 'configure':
        return this.simulateConfigure(command, device, executionTime);
      case 'calibrate':
        return this.simulateCalibrate(command, device, executionTime);
      case 'execute':
        return this.simulateExecute(command, device, executionTime);
      default:
        return {
          commandId: command.id,
          success: false,
          error: `Comando desconocido: ${command.command}`,
          timestamp: Date.now(),
          executionTime_ms: executionTime
        };
    }
  }

  private simulateSensorRead(command: HardwareCommand, device: HardwareDevice | undefined, executionTime: number): HardwareResponse {
    const sensor = command.parameters.sensor as string;
    let value = 0;
    let units = '';
    let quality = 'good';
    
    // Simular según tipo de sensor
    if (sensor.includes('voltage') || sensor.includes('mfc')) {
      value = 0.3 + Math.random() * 0.3; // 0.3-0.6V
      units = 'V';
    } else if (sensor.includes('ph')) {
      value = 7 + (Math.random() - 0.5) * 1; // 6.5-7.5
      units = 'pH';
    } else if (sensor.includes('temp') || sensor.includes('temperature')) {
      value = 25 + (Math.random() - 0.5) * 10; // 20-30°C
      units = '°C';
    } else if (sensor.includes('od') || sensor.includes('optical')) {
      value = 0.5 + Math.random() * 1.0; // 0.5-1.5
      units = 'OD750';
    } else if (sensor.includes('do') || sensor.includes('oxygen')) {
      value = 5 + Math.random() * 10; // 5-15 mg/L
      units = 'mg/L';
    } else if (sensor.includes('orp') || sensor.includes('redox')) {
      value = -100 + Math.random() * 200; // -100 a +100 mV
      units = 'mV';
    } else if (sensor.includes('cond') || sensor.includes('conductivity')) {
      value = 10000 + Math.random() * 5000; // 10-15 mS/cm
      units = 'µS/cm';
    } else if (sensor.includes('flow')) {
      value = 50 + Math.random() * 50; // 50-100 mL/min
      units = 'mL/min';
    } else if (sensor.includes('light') || sensor.includes('lux')) {
      value = Math.random() * 100000;
      units = 'lux';
    } else if (sensor.includes('humidity')) {
      value = 40 + Math.random() * 40; // 40-80%
      units = '%';
    } else if (sensor.includes('pressure')) {
      value = 1013 + (Math.random() - 0.5) * 20;
      units = 'hPa';
    } else if (sensor.includes('gps')) {
      value = 0; // Objeto complejo
      units = 'deg';
    } else if (sensor.includes('imu')) {
      value = 0; // Objeto complejo
      units = 'deg';
    } else {
      value = Math.random() * 100;
      units = 'units';
    }
    
    return {
      commandId: command.id,
      success: true,
      value,
      data: { units, quality, sensor },
      timestamp: Date.now(),
      executionTime_ms: executionTime
    };
  }

  private simulateActuatorWrite(command: HardwareCommand, device: HardwareDevice | undefined, executionTime: number): HardwareResponse {
    return {
      commandId: command.id,
      success: true,
      data: { actuated: true, value: command.parameters.value },
      timestamp: Date.now(),
      executionTime_ms: executionTime
    };
  }

  private simulateConfigure(command: HardwareCommand, device: HardwareDevice | undefined, executionTime: number): HardwareResponse {
    return {
      commandId: command.id,
      success: true,
      data: { configured: true },
      timestamp: Date.now(),
      executionTime_ms: executionTime
    };
  }

  private simulateCalibrate(command: HardwareCommand, device: HardwareDevice | undefined, executionTime: number): HardwareResponse {
    return {
      commandId: command.id,
      success: true,
      data: { calibrated: true, parameters: command.parameters },
      timestamp: Date.now(),
      executionTime_ms: executionTime
    };
  }

  private simulateExecute(command: HardwareCommand, device: HardwareDevice | undefined, executionTime: number): HardwareResponse {
    // Comandos complejos: feed, reinoculate, harvest, dose, etc.
    const action = command.parameters.action as string;
    let data: Record<string, unknown> = { executed: true, action };
    
    if (action === 'feed') {
      data = { fed: true, substrate: command.parameters.substrate, volume_ml: command.parameters.volume_ml };
    } else if (action === 'reinoculate') {
      data = { reinoculated: true, source: command.parameters.source, volume_ml: command.parameters.volume_ml };
    } else if (action === 'harvest') {
      data = { harvested: true, volume_L: command.parameters.volume_L, destination: command.parameters.destination };
    } else if (action === 'dose') {
      data = { dosed: true, nutrient: command.parameters.nutrient, amount: command.parameters.amount };
    }
    
    return {
      commandId: command.id,
      success: true,
      data,
      timestamp: Date.now(),
      executionTime_ms: executionTime
    };
  }

  // ==================== SETUP HARDWARE ESPECÍFICO ====================

  private async setupGPIO(device: HardwareDevice): Promise<void> {
    const config = device.config as GPIOPinConfig;
    // En producción: Python RPi.GPIO / gpiozero
    this.log('debug', `GPIO setup: pin ${config.pin}, mode ${config.mode}`);
  }

  private async setupI2C(device: HardwareDevice): Promise<void> {
    const config = device.config as I2CConfig;
    // En producción: Python smbus2
    this.log('debug', `I2C setup: bus ${config.bus}, addr 0x${config.address.toString(16)}`);
  }

  private async setupSPI(device: HardwareDevice): Promise<void> {
    const config = device.config as SPIConfig;
    // En producción: Python spidev
    this.log('debug', `SPI setup: bus ${config.bus}, CS ${config.chipSelect}, mode ${config.mode}`);
  }

  private async setupUART(device: HardwareDevice): Promise<void> {
    const config = device.config as UARTConfig;
    // En producción: Python pyserial
    this.log('debug', `UART setup: ${config.port} @ ${config.baudRate} baud`);
  }

  private async setupADC(device: HardwareDevice): Promise<void> {
    const config = device.config as ADCConfig;
    // En producción: ADS1115 via I2C
    this.log('debug', `ADC setup: ch ${config.channel}, ${config.resolution}bit, ${config.referenceVoltage}V`);
  }

  private async connectWireless(device: HardwareDevice): Promise<void> {
    // WiFi/BLE para ESP32
    this.log('debug', `Wireless connect: ${device.id}`);
  }

  /** Programa reconexión */
  private scheduleReconnect(deviceId: string): void {
    if (this.reconnectTimers.has(deviceId)) return;
    
    const timer = setTimeout(() => {
      this.reconnectTimers.delete(deviceId);
      this.connectDevice(deviceId);
    }, this.config.retryDelay_ms * this.config.maxRetries);
    
    this.reconnectTimers.set(deviceId, timer);
  }

  // ==================== API PÚBLICA ====================

  /** Obtiene dispositivo */
  public getDevice(deviceId: string): HardwareDevice | undefined {
    return this.devices.get(deviceId);
  }

  /** Lista todos los dispositivos */
  public getAllDevices(): HardwareDevice[] {
    return Array.from(this.devices.values());
  }

  /** Obtiene dispositivos por tipo */
  public getDevicesByType(type: HardwareDevice['type']): HardwareDevice[] {
    return Array.from(this.devices.values()).filter(d => d.type === type);
  }

  /** Obtiene historial comandos */
  public getCommandHistory(limit?: number): HardwareCommand[] {
    return limit ? this.commandHistory.slice(-limit) : [...this.commandHistory];
  }

  /** Obtiene estadísticas bridge */
  public getStats(): object {
    const devices = Array.from(this.devices.values());
    return {
      totalDevices: devices.length,
      connected: devices.filter(d => d.status === 'connected').length,
      disconnected: devices.filter(d => d.status === 'disconnected').length,
      error: devices.filter(d => d.status === 'error').length,
      byType: devices.reduce((acc, d) => {
        acc[d.type] = (acc[d.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      commandHistoryLength: this.commandHistory.length,
      pythonBridge: this.config.pythonBridge,
      websocketPort: this.config.websocketPort
    };
  }

  /** Configura logging */
  public setLogLevel(level: 'debug' | 'info' | 'warn' | 'error'): void {
    this.config.logLevel = level;
  }

  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string): void {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    if (levels[level] >= levels[this.config.logLevel]) {
      console[level](`[HardwareBridge] ${message}`);
    }
  }

  /** Limpieza */
  public async destroy(): Promise<void> {
    // Desconectar todos los dispositivos
    for (const deviceId of this.devices.keys()) {
      await this.disconnectDevice(deviceId);
    }
    
    // Detener Python bridge
    if (this.pythonProcess) {
      this.pythonProcess.kill();
      this.pythonProcess = null;
    }
    
    // Detener WebSocket
    if (this.websocketServer) {
      this.websocketServer.close();
      this.websocketServer = null;
    }
    
    // Limpiar timers
    for (const timer of this.reconnectTimers.values()) {
      clearTimeout(timer);
    }
    this.reconnectTimers.clear();
    
    this.removeAllListeners();
  }
}

/** Configuración del Bridge */
export interface BridgeConfig {
  pythonBridge: boolean;
  pythonScript: string;
  websocketPort: number;
  commandTimeout_ms: number;
  maxRetries: number;
  retryDelay_ms: number;
  autoReconnect: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

/** Factory: Dispositivos estándar Kit 72H */
export function createKit72HDevices(): HardwareDevice[] {
  return [
    // MFC Principal
    {
      id: 'kit72h_mfc_1',
      name: 'Kit 72H MFC Principal',
      type: 'MFC',
      interface: 'ADC',
      config: {
        channel: 0,
        resolution: 16,
        referenceVoltage: 3.3,
        gain: 1
      } as ADCConfig,
      status: 'disconnected',
      lastSeen: 0,
      metadata: {
        sensors: ['mfc_voltage_1', 'mfc_current_1'],
        actuators: ['mfc_feed_pump', 'mfc_reinoculate_pump']
      }
    },
    // Biorreactor Spirulina
    {
      id: 'kit72h_bio_1',
      name: 'Kit 72H Biorreactor Spirulina',
      type: 'Bioreactor',
      interface: 'UART',
      config: {
        port: '/dev/ttyUSB0',
        baudRate: 115200,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        flowControl: false
      } as UARTConfig,
      status: 'disconnected',
      lastSeen: 0,
      metadata: {
        sensors: ['bio_od_1', 'bio_temp_1', 'bio_do_1', 'bio_ph_1'],
        actuators: ['bio_light', 'bio_air_pump', 'bio_nutrient_pumps', 'bio_harvest_pump']
      }
    },
    // SVD Array
    {
      id: 'kit72h_svd',
      name: 'Kit 72H SVD Sensor Array',
      type: 'Sensor',
      interface: 'I2C',
      config: {
        bus: 1,
        address: 0x48, // ADS1115
        frequency: 400000
      } as I2CConfig,
      status: 'disconnected',
      lastSeen: 0,
      metadata: {
        sensors: [
          'mfc_voltage_1', 'mfc_ph_1', 'mfc_temp_1',
          'bio_od_1', 'bio_temp_1', 'bio_do_1', 'bio_ph_1', 'bio_cond_1',
          'amb_light_1', 'gps_1'
        ]
      }
    },
    // Microcontrolador ESP32
    {
      id: 'esp32_1',
      name: 'ESP32 Microcontrolador Principal',
      type: 'Microcontroller',
      interface: 'WIFI',
      config: {
        ssid: 'HSCSG_Kit72H',
        password: 'auto-generated',
        port: 8080
      },
      status: 'disconnected',
      lastSeen: 0,
      metadata: {
        firmware: { version: '2.0.0', capabilities: ['GPIO', 'ADC', 'PWM', 'I2C', 'UART', 'WiFi', 'BLE'], lastUpdate: Date.now() },
        pins: {
          2: 'LED_BUILTIN',
          4: 'DS18B20_MFC',
          5: 'DS18B20_BIO',
          13: 'PUMP_MFC_FEED',
          14: 'PUMP_MFC_REINOCULATE',
          15: 'PUMP_BIO_HARVEST',
          16: 'LED_BIO_RED',
          17: 'LED_BIO_BLUE',
          18: 'PUMP_BIO_NUTRIENT_N',
          19: 'PUMP_BIO_NUTRIENT_P',
          21: 'I2C_SDA',
          22: 'I2C_SCL',
          23: 'RELAY_COOLING',
          25: 'RELAY_HEATING',
          32: 'ADS1115_ALERT',
          33: 'PH_SENSOR',
          34: 'OD_SENSOR',
          35: 'DO_SENSOR',
          36: 'ORP_SENSOR',
          39: 'COND_SENSOR'
        }
      }
    }
  ];
}

/** Instancia singleton global */
let globalBridge: HardwareBridge | null = null;

export function getBridge(config?: Partial<BridgeConfig>): HardwareBridge {
  if (!globalBridge) {
    globalBridge = new HardwareBridge(config);
  }
  return globalBridge;
}

export function setBridge(bridge: HardwareBridge): void {
  globalBridge = bridge;
}