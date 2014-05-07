Title: Установка ElasticSearch как Windows-сервиса
Date: 2014-05-07
Slug: elasticsearch-as-a-windows-service
Author: tkirill
Summary: В этой короткой заметке рассказывается, как запустить ElasticSearch в виде Windows-сервиса с сохранением данных вне Program files, прямо как в Linux.

В этой короткой заметке рассказывается, как запустить ElasticSearch в виде Windows-сервиса с сохранением данных вне Program files, прямо как в Linux.

1. Скачиваем архив с ElasticSearch и распаковываем его в Program files.  Дальше будем называть это место *каталогом установки*.

2. Создаём где-нибудь в другом месте каталог для данных, логов и конфигов.  Дальше будем называть это место *рабочим каталогом*.

3. Копируем каталог config из каталога установки в рабочий каталог.

4. Настраиваем в файле config/elasticsearch.yml пути ([документация](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/setup-dir-layout.html)).  Нам нужно настроить четыре каталога: path.conf, path.data, path.logs и path.work, остальные каталоги правильно настроит service.bat из каталога установки.  Например, если рабочий каталог -- E:\elasticsearch, то в elasticsearch.yml нужно прописать такие настройки:

        :::yaml
        path.conf: E:\elasticsearch\config
        path.data: E:\elasticsearch\data
        path.work: E:\elasticsearch\work
        path.logs: E:\elasticsearch\logs

5. Можно настроить название кластера, чтобы вы случайно не пересеклись с другим интересующимся ElasticSearch человеком в своей локальной сети.  Это не обязательно, но может пригодится, как и настройка сетевого интерфейса:

        :::yaml
        cluster.name: boogie-woogie
        network.host: 127.0.0.1

6. Для установки сервиса мы будем использовать скрипт service.bat из каталога установки (подкаталог bin).  Запускаем консоль с правами администратора.
7. В переменную CONF_FILE сохраняем полный путь до файла конфигурации:

        :::bat
        set CONF_FILE=E:\elasticsearch\config\elasticsearch.yml
    
    Это работает благодаря следующей строке в service.bat:
    
        :::bat
        if "%CONF_FILE%" == "" set CONF_FILE=%ES_HOME%\config\elasticsearch.yml

8. Устанавливаем сервис вызывая service.bat, сервис будет называться ElasticSearch:

        :::bat
        \Program Files\elasticsearch-1.1.1\bin\service.bat install ElasticSearch
    
    Мы указываем название явно, иначе сервис получит неудобное название по-умолчанию -- elasticsearch-service-x64.

9. Запускаем сервис:

        :::bat
        net start ElasticSearch

Настройки из файла конфигурации перезатрут настройки, устанавливаемые service.bat благодаря тому, что service.bat указывает только настройки по-умолчанию, используя префикс es.default:

    :::bat
    set ES_PARAMS=-Delasticsearch;-Des.path.home="%ES_HOME%";-Des.default.config="%CONF_FILE%";-Des.default.path.home="%ES_HOME%";-Des.default.path.logs="%LOG_DIR%"; etc...