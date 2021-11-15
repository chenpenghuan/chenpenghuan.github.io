# k8s

## 查看k8s的域名配置：

```shell
opscli app -n quotation -p distribute-information k8s-resource -k ingress -c test
```

## 查找pod

```shell
kubectl -n server get pod | grep core
```

## 登录pod

```shell
kubectl -n server exec -it core-5f47f66cb6-7ttbc bash
```

## 调试修改pod配置

```shell
kubectl edit -n server deployment/php

kubectl delete -n server deployment/push --force

kubectl -n server get ingress

#卸载release
helm uninstall -n server praise
```

## 查找内部调用域名

```shell
kubectl -n quotation get ingress
```

### 切换namespace

```shell
aws eks update-kubeconfig --region ap-east-1  --name hk-test-1
```

