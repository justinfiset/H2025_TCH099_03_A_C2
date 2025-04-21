# Utiliser l'image PHP 8.2 Apache comme base
FROM php:8.2-apache

# Installer les dépendances système pour GD avec WebP
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
        libwebp-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) gd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Installer Xdebug
RUN pecl install -o -f xdebug \
    && rm -rf /tmp/pear

# Configuration conditionnelle de Xdebug
COPY xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini.disabled

# Activer les réécritures Apache
RUN a2enmod rewrite

# Définir le répertoire de travail Apache
WORKDIR /var/www/html

# Copier les fichiers de l'application
COPY . /var/www/html/