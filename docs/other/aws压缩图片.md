# aws压缩图片

本文介绍两种方式，网关压缩图片，和上传时压缩图片

[代码附件](https://listener.oss-cn-beijing.aliyuncs.com/blog/CreateThumbnail.zip)

## aws网关压缩图片

使用AWS Lambda，API Gateway和S3实现简单的图像大小调整任务

aws网关压缩图片工作流程

1. 用户将使用图像大小参数（宽度/高度）向API网关发送请求，以便接收已调整大小的图像的s3 URL，
2. API网关请求将触发lambda函数，
3. lambda函数检查具有给定大小的图像是否存在，存在直接返回，不存在创建后返回

下面是aws网关压缩图片配置实践

#### lambda函数配置

这里主要参考https://github.com/obytes/resize_s3_images

需要注意的是，aws的python运行环境没有[PIL](https://pillow.readthedocs.io/en/stable/)库，这里我们需要下载对应版本，本文使用python3.6版本的依赖库

```shell
$ ls
Pillow-6.1.0-cp36-cp36m-manylinux1_x86_64.whl GatewayResize.py
$ unzip Pillow-6.1.0-cp36-cp36m-manylinux1_x86_64.whl && rm Pillow-6.1.0-cp36-cp36m-manylinux1_x86_64.whl
$ zip -r GatewayResize.zip .
```

##### 在AWS Lambda仪表板上载压缩文件

![image-20210821154616916](https://listener.oss-cn-beijing.aliyuncs.com/blog/image-20210821154616916.png)

![image-20210821155706927](https://listener.oss-cn-beijing.aliyuncs.com/blog/image-20210821155706927.png)

##### 设置处理程序地址

本文网关压缩使用的方法是GatewayResize.lambda_handler

##### 添加环境变量

本文脚本使用到的配置BUCKET_DOMAIN和BUCKET_NAME（这里的BUCKET_NAME应该不必写死，本文代码库中上传时压缩脚本CreateThumbnail.py中有获取方式，只是大多生产环境只使用一个bucket并使用自己的域名，因此本文使用固定bucket）

![image-20210821155749285](https://listener.oss-cn-beijing.aliyuncs.com/blog/image-20210821155749285.png)

#### 网关配置

控制台搜索api gateway并点击进入

![loading-ag-850](https://listener.oss-cn-beijing.aliyuncs.com/blog/image-20210821154916379.png)

创建api

![image-20210821155315308](https://listener.oss-cn-beijing.aliyuncs.com/blog/image-20210821155315308.png)

![API网关配置](https://listener.oss-cn-beijing.aliyuncs.com/blog/api-gateway-configuration.png)

#### 网关测试

![image-20210821160500352](https://listener.oss-cn-beijing.aliyuncs.com/blog/image-20210821160500352.png)

查询字符串写入get参数，key=xxx.png&size=200x200，返回code码为301，正文为图片压缩后的访问地址，下次访问即可直接访问返回的地址，不用经过网关

#### 发布api到公网

![image-20210821174350316](https://listener.oss-cn-beijing.aliyuncs.com/blog/image-20210821174350316.png)

发布后即可得到公网地址![image-20210821174457313](https://listener.oss-cn-beijing.aliyuncs.com/blog/image-20210821174457313.png)

## aws上传时压缩图片

这里用到的Python脚本如是本文代码中的CreateThumbnail.py

#### lambda函数配置

与aws网关压缩图片配置一致，**运行时设置**中的**处理程序**需要改成CreateThumbnail.handler

#### 添加触发器

点击添加触发器

![image-20210821162147899](https://listener.oss-cn-beijing.aliyuncs.com/blog/image-20210821162147899.png)

![image-20210821162447130](https://listener.oss-cn-beijing.aliyuncs.com/blog/image-20210821162447130.png)

#### 测试触发器

![image-20210821162728532](https://listener.oss-cn-beijing.aliyuncs.com/blog/image-20210821162728532.png)

将json中的example-bucket换成目标bucket，将test/key换成s3中存在的文件路径，点击测试，

如果失败，有可能是python环境配置错误，或者是权限问题，请google解决

> 本文参考：
> 
> [使用AWS Lambda，API Gateway和S3 Storage快速调整图片大小](https://www.cnblogs.com/rxbook/p/11377872.html)
> 
> [AWS上如何实现S3桶上传图片自动缩放](https://zhuanlan.zhihu.com/p/141707867)
