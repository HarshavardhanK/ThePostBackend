#!/usr/bin/env bash

#FIREWALL
sudo ufw app list
sudo ufw allow OpenSSH
sudo ufw allow ssh
sudo ufw enable

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

sudo nano /etc/nginx/sites-available/app.themitpost.com
sudo cp -i ~/ThePostBackend/server-docs/api.themitpost.com /etc/nginx/sites-available/api.themitpost.com
sudo ln -s /etc/nginx/sites-available/api.themitpost.com /etc/nginx/sites-enabled/
sudo cp -i ~/ThePostBackend/server-docs/cert.pem /etc/ssl/certs/cert.pem
sudo cp -i ~/ThePostBackend/server-docs/key.pem /etc/ssl/private/key.pem


