# Youtube Trailer

[![Youtube Trailer](https://img.youtube.com/vi/yixFW5ibKW4/maxresdefault.jpg)](https://www.youtube.com/watch?v=yixFW5ibKW4)

Description: Click on the image above or [this link](https://www.youtube.com/watch?v=yixFW5ibKW4) to watch the introduction video of our project.

# Description 

Project Purpose: The main goal is to bring beehives into the digital age. The project aims to enable real-time monitoring of beehives by connecting them to the internet, regardless of distance. Through the web interface, users can track real-time and historical data such as internal and external temperature and humidity, internal and external air quality, instantaneous and past weight, and data on wildlife attacks. In abnormal situations, such as a wildlife attack, the beehive sends an SMS notification to the user. The project aims to increase efficiency and comfort in beekeeping.

Users need to register on the web interface at www.beehiliv.com.tr and, after activating the beehive, connect to it and input their registration information. This way, the beehive will be associated with that specific user.

Backend is built with ExpressJS.
Frontend is built with ReactJS.
MongoDB is used as the database.
SocketIO is used.

Hardware includes Stm32 and Esp32.
Sensors are operated with Stm32, and data is sent to Esp32 via UART for internet access via Wi-Fi.

Esp32 communicates with the backend server using the WebSocket protocol. SocketIO library is utilized.

Sensors used: DHT11, MQ-135, MPU6050, HX711, Load Cell, Sparkfun Sound Detector (Not activated).

The web interface includes screens for registration, email activation, password reset, login, viewing and monitoring beehives, and viewing and modifying profile information.

Data from the beehive in the backend is sent to the web interface via WebSocket, allowing real-time monitoring.

The project is deployed on an Ubuntu 20.04 server using Docker and Nginx. MongoDB version 4.2.3 is run using Docker.

I developed the project between March 1, 2023, and May 30, 2023.

The domain I used and the Ubuntu hosting have expired.

# Description Turkish 

Projenin Amacı: Arı kovanlarını dijital çağa taşımak ana hedefidir. Arı kovanı internete bağlanarak real-time takibini mesafe fark etmeksizin takip etmeyi sağlamayı amaçlamaktadır. Web arayüzü üzerinden arı kovanlarına ait iç-dış sıcaklık ve nem, İç-dış hava kalitesi , anlık ve geçmiş ağırlık , vahşi hayvan saldırısı verileri real time olarak takip edilebilmektedir. Arı kovanı anormal durumlarda kullanıcısına sms göndererek bilgilendirme yapmaktadır(örn: vahşi hayvan saldırısı). Arıcılıkta verimliliği ve konforu arttırması hedeflenmektedir.

Kullanıcı web arayüzüne www.beehiliv.com.tr üzerinden kayıt olmalı ve daha sonra arı kovanını etkinleştirdiği zaman arı kovanına bağlanıp kayıt olduğu bilgilerini içine işlemelidir. Böylelikle arı kovanı o kişiye ait olacaktır.

Backend ExpressJS ile oluşturulmuştur.
Frontend ReactJS ile oluşturulmuştur.
Database MongoDB kullanılmıştır.
SocketIO kullanılmıştır.

Donanım olarak Stm32 ve Esp32 Kullanılmıştır.
Stm32 ile bazı sensörler çalıştırılmış uart ile  esp32 'ye gönderilip Wi-Fi üzerinden internete çıkış yapılmıştır.

Esp32 ile backend sunucusu websocket protokolü ile haberleşmektedir. SocketIO kütüphanesi kullanılmıştır.

Kullanılan sensörler. DHT11 , MQ-135, MPU6050 , HX711 , Yük Hücresi ,Sparkfun Ses Dedektörü(Aktif edilmedi).

Web arayüzü kayıt olma, mail aktivasyonu, şifreyi sıfırlama, giriş yapma , arı kovanlarını görüntüleme ve izleme , profil bilgilerini görüntüleme ve değiştirme ekranlarına sahiptir.

Backend'deki arı kovanına ait veriler web arayüzüne websocket ile gelmekte böylelikle real-time izlenebilmektedir.

Proje ubuntu 20.04 sunucuya docker, nginx kullanılarak deploy edilmiştir. MongoDB'nin mongo:4.2.3 sürümü docker üzerinden çalıştırılarak kullanılmaktadır.

Projeyi 01.03.2023 - 30.05.2023 arasında geliştirdim. 

Kullandığım alan adı ve ubuntu hosting zaman aşımına uğradı. 
