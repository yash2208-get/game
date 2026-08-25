FROM php:8.3-cli
WORKDIR /var/www/html
RUN apt-get update && apt-get install -y git unzip libzip-dev libicu-dev && docker-php-ext-install pdo_mysql intl zip && pecl install redis && docker-php-ext-enable redis && rm -rf /var/lib/apt/lists/*
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY . .
RUN composer install --no-interaction --prefer-dist --no-progress --optimize-autoloader
RUN php artisan storage:link || true
EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
