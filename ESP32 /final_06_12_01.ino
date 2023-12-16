#include <Wire.h>
#include <HardwareSerial.h>
#include <MPU6050_tockn.h>
#include <WiFi.h>
#include <SocketIoClient.h>
#include <ArduinoJson.h>
#include "MQ135.h"
#include <Ticker.h>
#include <WebServer.h>
#include <WiFiClient.h>
#include <DNSServer.h>
#include <EEPROM.h>
#include <HX711.h>

// HX711 settings
#define DOUT 26
#define CLK  27

HX711 scale;
float REFERENCE_WEIGHT = 500.0;

#define EEPROM_SIZE 512

// WebServer instance
WebServer server(80);

//UART credentials
HardwareSerial SerialPort(2);

String ssid_str;
String password_str;
String userHive_str;
String userEmail_str;


// Wi-Fi credentials

const char* ssid;
const char* password;
String userEmail = "";
String userHive = "";

// Reset button pin
const int resetButtonPin = 0; // GPIO 0 as reset button pin
// Reset button timer
unsigned long resetButtonTimer = 0;
const unsigned long resetButtonInterval = 5000; // 10 seconds


// Socket.IO server address
const char* serverAddress = "www.beehiliv.com.tr";
const int serverPort = 4001;

// MPU6050 instance and threshold
MPU6050 mpu(Wire);
const int threshold = 1750;

// Hayvan saldırısı durumu
bool animalattack = false;

// Socket.IO client instance and connection flag
SocketIoClient webSocket;
bool socketConnected = false;


// Gas MQ-135 Sensors
const int firstMQpin = 32;
const int secondMQpin = 35;

// Global variables for temperature and humidity
float tCelsius, tCelsius2, RH, RH2;
unsigned long lastConnectTime = 0; 
const unsigned long connectInterval = 2000; // 2 saniyede bir UART bağlantısı için kontrol
unsigned long lastUARTCheck = 0;
const unsigned long UARTCheckInterval = 100; // 100 ms
Ticker uartTicker; // Ticker nesnesi oluşturun

int connectionAttempts = 0;
const int maxConnectionAttempts = 25;
const byte DNS_PORT = 53;
DNSServer dnsServer;

void setup() {
  Serial.begin(9600);
  EEPROM.begin(EEPROM_SIZE);
  readFromEEPROM();
    Serial.println("Trying to connect with the following credentials:");
  Serial.println("SSID: " + String(ssid));
  Serial.println("Password: " + String(password));
  SerialPort.begin(115200,SERIAL_8N1,16,17);
  Wire.begin(); // SDA: GPIO 21, SCL: GPIO 22

  // Connect to Wi-Fi
WiFi.begin(ssid, password);
while (WiFi.status() != WL_CONNECTED) {
  delay(1000);
  connectionAttempts++;
  Serial.println("Connecting to Wi-Fi...");

  if (connectionAttempts >= maxConnectionAttempts) {
    Serial.println("Failed to connect to Wi-Fi, creating access point.");
    createAccessPointAndRedirect();
    break;
  }
}

if (WiFi.status() == WL_CONNECTED) {
  Serial.print("Connected to Wi-Fi with IP: ");
  Serial.println(WiFi.localIP());
}

  // Connect to Socket.IO server
  webSocket.begin(serverAddress, serverPort);
  webSocket.on("connect", [](const char* payload, size_t length) {
    Serial.println("Connected to Socket.IO server");
    socketConnected = true;
  });
  webSocket.on("disconnect", [](const char* payload, size_t length) {
    Serial.println("Disconnected from Socket.IO server");
    socketConnected = false;
  });


  // MQ-135 sensors setup
  pinMode(firstMQpin, INPUT);
  pinMode(secondMQpin, INPUT);

  mpu.begin();
  delay(500);
  uartTicker.attach_ms(100, connectUARTDHT);

    //HX711 begins
  scale.begin(DOUT, CLK);
  scale.set_scale(); // önceden belirlenmiş faktör
  scale.tare();

    // Setup reset button pin
  pinMode(resetButtonPin, INPUT_PULLUP);

  // Setup web server
  server.on("/", handleRoot);
  server.on("/submit", handleSubmit);
  server.begin();
  Serial.println("HTTP server started");
}

void connectUARTDHT() {
   if (SerialPort.available()) {
    String receivedData = SerialPort.readStringUntil('\n');
    sscanf(receivedData.c_str(), "tCelsius: %f, tCelsius2: %f, RH: %f, RH2: %f", &tCelsius, &tCelsius2, &RH, &RH2);
    tCelsius /= 100.0;
    tCelsius2 /= 100.0;
    RH /= 100.0;
    RH2 /= 1000.0;
    Serial.printf("tCelsius: %.2f, tCelsius2: %.2f, RH: %.2f, RH2: %.2f\n", tCelsius, tCelsius2, RH, RH2);
  }
}

void loop() {


  webSocket.loop();




//MPU6050 settings
  mpu.update();

  int toplamKuvvet = abs(mpu.getAccX() * 1000) + abs(mpu.getAccY() * 1000) + abs(mpu.getAccZ() * 1000);

  if (toplamKuvvet > threshold) {
    animalattack = true;
  } else {
    animalattack = false;
  }

if (animalattack) {
    Serial.println(F("Animal Attack Now!"));
  } else {
    Serial.println(F("No Animal Attack"));
  }


  // Read MQ-135 sensor values
  int firstMQSensor = analogRead(firstMQpin);
  int secondMQSensor = analogRead(secondMQpin);

  float new_factor = 0;

  float weight = scale.get_units(5);
  Serial.printf("Weight: %.2f\n", weight);

  // Send data to the server
  if (socketConnected) {
    StaticJsonDocument<256> jsondoc;
    jsondoc["email"] = userEmail;
    jsondoc["hive"] = userHive;
    JsonObject data = jsondoc.createNestedObject("data");
    data["sicaklik1"] = tCelsius;
    data["sicaklik2"] = tCelsius2;
    data["gaz1"] = firstMQSensor;
    data["gaz2"] = secondMQSensor;
    data["Hum1"] = RH;
    data["Hum2"] = RH2;
    data["hayvan"] = animalattack;
    data["agirlik"] = weight;
    String jsonString;
    serializeJson(jsondoc, jsonString);
    webSocket.emit("message", jsonString.c_str());
  }

  delay(200);

    // Handle web server
  server.handleClient();

  // Check reset button
  checkResetButton();
 dnsServer.processNextRequest();
}



void createAccessPointAndRedirect() {
  Serial.println("Creating Access Point...");

  // Disconnect from Wi-Fi
  WiFi.disconnect();

  // Create Access Point
  const char *apSSID = "beehiliv";
  const char *apPassword = ""; // No password for the AP
  WiFi.softAP(apSSID, apPassword);

  // Obtain IP address for AP
  IPAddress apIP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(apIP);

  // Set up DNS server
  dnsServer.start(DNS_PORT, "*", apIP);

  // Setup web server for AP mode
  server.on("/", handleRootAP);
  server.on("/submit", handleSubmitAP);
  server.begin();
}

void handleRootAP() {
  String html = "<html><body>"
                "<h1>Beehiliv Wi-Fi and Data Configuration</h1>"
                "<form action=\"/submit\" method=\"POST\">"
                "SSID: <input type=\"text\" name=\"ssid\"><br><br>"
                "Password: <input type=\"password\" name=\"password\"><br><br>"
                "Email: <input type=\"text\" name=\"email\"><br><br>"
                "Hive: <input type=\"text\" name=\"hive\"><br><br>"
                "<input type=\"submit\" value=\"Submit\">"
                "</form>"
                "</body></html>";

  server.send(200, "text/html", html);
}

void handleSubmitAP() {
  String newSSID;
  String newPassword;
  if (server.hasArg("ssid") && server.hasArg("password") && server.hasArg("email") && server.hasArg("hive")) {
    newSSID = server.arg("ssid");
    newPassword = server.arg("password");
    userEmail = server.arg("email");
    userHive = server.arg("hive");

    //writeToEEPROM(newSSID, newPassword, userEmail, userHive);

    // Connect to the new Wi-Fi network
    WiFi.begin(newSSID.c_str(), newPassword.c_str());
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    Serial.print("Connected to Wi-Fi with IP: ");
    Serial.println(WiFi.localIP());

    // Setup web server for normal mode
    server.on("/", handleRoot);
    server.on("/submit", handleSubmit);

    // Show a confirmation message on the same page
    String message = "<html><body><h1>Configuration saved!</h1><br><h2>Beehiliv is now connected to the new Wi-Fi network.</h2><br><h3>Please close this window and reconnect to your regular Wi-Fi network and go www.beehiliv.com.tr</h3></body></html>";
    server.send(200, "text/html", message);
  } else {
    server.send(400, "text/html", "Bad Request: missing arguments");
  }
  writeToEEPROM(newSSID, newPassword, userEmail, userHive);
}

void handleRoot() {
  String html = "<html><body>"
                "<h1>ESP32 Wi-Fi and Data Configuration</h1>"
                "<form action=\"/submit\" method=\"POST\">"
                "Email: <input type=\"text\" name=\"email\"><br><br>"
                "Hive: <input type=\"text\" name=\"hive\"><br><br>"
                "<input type=\"submit\" value=\"Submit\">"
                "</form>"
                "</body></html>";

  server.send(200, "text/html", html);
}

void handleSubmit() {
  if (server.hasArg("email") && server.hasArg("hive")) {
    userEmail = server.arg("email");
    userHive = server.arg("hive");

    writeToEEPROM(ssid_str, password_str, userEmail, userHive);

    String message = "<html><body><h1>Configuration saved!</h1><br><a href=\"/\">Go back</a></body></html>";
    server.send(200, "text/html", message);
  } else {
    server.send(400, "text/html", "Bad Request: missing arguments");
  }
}

void readFromEEPROM() {
  Serial.println("Reading from EEPROM...");

  ssid_str = "";
  for (int i = 0; i < 32; ++i) {
    ssid_str += char(EEPROM.read(i));
  }
  ssid_str.trim();  // trim whitespace characters from both ends
  ssid = ssid_str.c_str();
  
  password_str = "";
  for (int i = 32; i < 64; ++i) {
    password_str += char(EEPROM.read(i));
  }
  password_str.trim();  // trim whitespace characters from both ends
  password = password_str.c_str();

  userEmail_str = "";
  for (int i = 64; i < 96; ++i) {
    userEmail_str += char(EEPROM.read(i));
  }
  userEmail_str.trim();
  userEmail = userEmail_str.c_str();

  userHive_str = "";
  for (int i = 96; i < 128; ++i) {
    userHive_str += char(EEPROM.read(i));
  }
  userHive_str.trim();
  userHive = userHive_str.c_str();

  // Print out the read values
  Serial.println("SSID: " + ssid_str);
  Serial.println("Password: " + password_str);
  Serial.println("User Email: " + userEmail_str);
  Serial.println("User Hive: " + userHive_str);
}


void writeToEEPROM(String ssid_input, String password_input, String userEmail_input, String userHive_input) {
  Serial.println("Writing to EEPROM...");

  for (int i = 0; i < 32; ++i) {
    EEPROM.write(i, i < ssid_input.length() ? ssid_input[i] : 0);
  }

  for (int i = 32; i < 64; ++i) {
    EEPROM.write(i, i-32 < password_input.length() ? password_input[i-32] : 0);
  }

  for (int i = 64; i < 96; ++i) {
    EEPROM.write(i, i-64 < userEmail_input.length() ? userEmail_input[i-64] : 0);
  }

  for (int i = 96; i < 128; ++i) {
    EEPROM.write(i, i-96 < userHive_input.length() ? userHive_input[i-96] : 0);
  }

  EEPROM.commit();
  Serial.println("Done Writing to EEPROM.");
}


void checkResetButton() {
  if (digitalRead(resetButtonPin) == LOW) {
    if (resetButtonTimer == 0) {
      resetButtonTimer = millis();
    } else if (millis() - resetButtonTimer > resetButtonInterval) {
      clearEEPROM();
      createAccessPointAndRedirect();
    }
  } else {
    resetButtonTimer = 0;
  }
}

void clearEEPROM() {
  for (int i = 0; i < EEPROM_SIZE; i++) {
    EEPROM.write(i, 0);
  }
  EEPROM.commit();
  Serial.println("EEPROM cleared.");
}










