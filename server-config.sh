#!/usr/bin/env bash

#FIREWALL
ufw app list
ufw allow OpenSSH

#INSTALL NODEJS

sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
sudo npm install -g pm2

#INSTALL ALL NECESSARY MODULES BY NPM INSTALL.
#Here I am assuming you are in the directory cloned from GitHub for this project. PLEASE BE IN THAT DIRECTORY FOR THE NEXT COMMAND TO WORK
npm install

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
sudo apt install nginx
sudo ufw app list
sudo ufw allow 'Nginx Full'
sudo ufw status

sudo systemctl start nginx
sudo systemctl enable nginx

sudo nano /etc/nginx/sites-available/api.themitpost.com
cp -i ~/ThePostBackend/api.themitpost.com /etc/nginx/sites-available/api.themitpost.com
sudo ln -s /etc/nginx/sites-available/api.themitpost.com /etc/nginx/sites-enabled/
cp -i ~/ThePostBackend/cert.pem /etc/ssl/certs/cert.pem
cp -i ~/ThePostBackend/key.pem /etc/ssl/private/key.pem
