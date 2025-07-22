@echo off
:: Set Wi-Fi Hotspot (Ad-Hoc)
netsh wlan set hostednetwork mode=allow ssid=ClassNetwork key=StudentPass123
netsh wlan start hostednetwork

:: Get Local IP Address
for /f "tokens=14 delims= " %%i in ('ipconfig ^| findstr "IPv4"') do set LOCAL_IP=%%i

:: Allow Firewall for Port 3001
netsh advfirewall firewall add rule name="ClassServer Port 3001" dir=in action=allow protocol=TCP localport=3001

:: Display Server URL
echo Wi-Fi Hotspot Started: SSID="ClassNetwork", Password="StudentPass123"
echo Students should connect to this Wi-Fi and visit:
echo http://%LOCAL_IP%:3001
echo.
pause