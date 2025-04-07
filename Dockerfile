# Utiliser l'image PHP 8.2 CLI comme base
FROM php:8.2-cli

# Copier les fichiers de l'application dans le conteneur
COPY . /usr/src/myapp

# Définir le répertoire de travail
WORKDIR /usr/src/myapp

# Installer les dépendances système nécessaires pour GD
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Configurer Xdebug
ENV XDEBUG_ENABLE=0
RUN pecl config-set preferred_state beta \
    && pecl install -o -f xdebug \
    && docker-php-ext-enable xdebug \
    && pecl config-set preferred_state stable \
    && rm -rf /tmp/pear

# Copier le fichier de configuration Xdebug désactivé
COPY ./99-xdebug.ini.disabled /usr/local/etc/php/conf.d/99-xdebug.ini.disabled

# Copier le script de démarrage
COPY ./start /usr/local/bin/start
RUN chmod +x /usr/local/bin/start

# Définir la commande par défaut
CMD ["start"]