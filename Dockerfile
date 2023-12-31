FROM php:8.2-fpm

RUN docker-php-ext-install pdo pdo_mysql sockets

RUN apt-get update && apt-get install -y --no-install-recommends \
    zip \
    unzip && apt-get clean

RUN curl -sS https://getcomposer.org/installer | php -- \
     --install-dir=/usr/local/bin --filename=composer

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN mkdir -p /var/www/html/storage/