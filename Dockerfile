FROM php:8.2-fpm

RUN docker-php-ext-install pdo pdo_mysql

RUN mkdir -p /var/www/html/storage/