## 查看k8s的域名配置：

opscli app -n quotation -p distribute-information k8s-resource -k ingress -c test

## 查找pod

kubectl -n server get pod | grep core

## 登录pod
kubectl -n server exec -it core-5f47f66cb6-7ttbc bash

## 调试修改pod配置

kubectl edit -n server deployment/php

kubectl delete -n  server  deployment/push  --force

kubectl -n server get ingress

