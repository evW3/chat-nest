# Chat example
Данное приложение реализует регистрацию с помощью обычной формы, Facebook и Google, после чего вам доступен чат.

## Запуск в режиме "dev"
##### Для корректного запуска достаточно:
Создать БД, указать её название в <b>.development.env</b> файл, в <b>POSTGRES_DB</b> переменную
<br>Заполнить данные о приложении из Google console и Facebook developers в соответствующие env переменные
<br>Выполнить миграцию для заполнения БД: `npm run migrate-dev`
<br>Запустить сервер `npm run start:dev`
<br>Запустить Vue приложение, командой `cd client && npm run dev`

## Сборка docker
##### Для корректного запуска достаточно:
Выполнить команду `docker-compose build`
<br>Выполнить команду `docker-compose up`

## Config
<br>Описание используемых .env констант предоставлено в файле example.env
<br><b>Обязательно</b>  наличие .production.env с POSTGRES_HOST=postgres