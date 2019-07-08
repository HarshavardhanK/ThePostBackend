#!/usr/bin/env bash

#INSTALL NGINGX
sudo apt update
sudo apt install nginx
sudo ufw app list
sudo ufw allow 'Nginx Full'
sudo ufw status

sudo systemctl start nginx
sudo systemctl enable nginx

sudo nano /etc/nginx/sites-available/api.themitpost.com
cp -i /root/ThePostBackend/api.themitpost.com /etc/nginx/sites-available/api.themitpost.com
sudo ln -s /etc/nginx/sites-available/api.themitpost.com /etc/nginx/sites-enabled/

cp -i ~/ThePostBackend/cert.pem /etc/ssl/certs/cert.pem
cp -i ~/ThePostBackend/key.pem /etc/ssl/private/key.pem
