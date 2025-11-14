FROM php:8.4
WORKDIR /back
COPY --from=composer:2.8 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

RUN apt-get update && \
    apt-get install -y zip unzip git rsync && \
    rm -rf /var/lib/apt/lists/* && \
    docker-php-ext-install pdo_mysql

COPY composer.json composer.lock ./
RUN composer install --no-scripts
RUN mv vendor /opt/vendor
COPY . .

RUN printf '#!/bin/bash\n\
set -e\n\
[ ! -d /back/vendor ] || [ -z "$(ls -A /back/vendor 2>/dev/null)" ] && \
cp -r /opt/vendor /back/vendor || \
rsync -au --quiet /opt/vendor/ /back/vendor/\n\
exec "$@"\n' > /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD php artisan serve --host=0.0.0.0 --port=$PORT
