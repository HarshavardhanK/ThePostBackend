#!/usr/bin/env bash

#INSTALL NODEJS

sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm

#INSTALL MONGODB
sudo apt update
sudo apt install -y mongodb

#check the service and database
mongo --eval 'db.runCommand({ connectionStatus: 1 })'
#if not working ABORT

sudo systemctl enable mongodb
sudo systemctl start mongodb

#INSTALL NGINGX
sudo apt update
sodu apt install nginx
sudo ufw app list
sudo ufw allow 'Nginx Full'
sudo ufw status

sudo systemctl start nginx
sudo systemctl enable nginx

sudo nano /etc/nginx/sites-available/api.themitpost.com
cp -i /root/ThePostBackend/api.themitpost.com /etc/nginx/sites-available/api.themitpost.com
sudo ln -s /etc/nginx/sites-available/api.themitpost.com /etc/nginx/sites-enabled/

#FIREWALL
ufw app list
ufw allow OpenSSH
