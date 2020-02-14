#!/usr/bin/env bash

#INSTALL NGINGX
sudo apt update
sudo apt install nginx
sudo ufw app list
sudo ufw allow 'Nginx Full'
sudo ufw status

sudo systemctl start nginx
sudo systemctl enable nginx

sudo nano /etc/nginx/sites-available/app.themitpost.com
sudo cp -i ~/ThePostBackend/server-docs/api.themitpost.com /etc/nginx/sites-available/app.themitpost.com
sudo ln -s /etc/nginx/sites-available/app.themitpost.com /etc/nginx/sites-enabled/
sudo cp -i ~/ThePostBackend/server-docs/cert.pem /etc/ssl/certs/cert.pem
sudo cp -i ~/ThePostBackend/server-docs/key.pem /etc/ssl/private/key.pem

sudo systemctl restart nginx

