# docker

## 删除镜像

```
docker image rm imagename
```

## 删除容器

```
docker container rm containerid
```

## 列出所有容器

```shell
docker container list -a
```

## 列出所有镜像

```
docker images
```

## 重启容器

```
docker container restart containerid
```

## 启动镜像

```
# mysql
docker run --name mysql5.7 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root -d mysql:5.7
# php-fpm
docker run -d --name php:7.0-fpm -p 9000:9000 php:7.0-fpm
```
