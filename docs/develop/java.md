# java基础

## url特殊字符处理

```java
            imageUrl = UrlEscapers.urlFragmentEscaper().escape(imageUrl);
```

## stream

### map累加

```java
        Map<String,Integer> map = new HashMap<>();
        List<Integer> list = new ArrayList<>(map.values());
        System.out.print(list.stream().collect(Collectors.summarizingInt(value -> value)).getSum());
        //或者
        map.entrySet().stream().mapToInt(x ->x.getValue()).sum()
```

### map求最小值

```java
                map.entrySet().stream().sorted(
                    Comparator.comparingInt(
                        x -> x.getValue()
                    )
                ).findFirst().get().getValue()
                //或者
                map.entrySet().stream().max(Comparator.comparingInt(x -> x.getValue())).get().getValue()
```

### list转map

```java
        Map<Long, HitLog> hitLogMap = hitLogList.stream().collect(Collectors.toMap(HitLog::getId, hitLog -> hitLog));
```

### list排序

```java
        List<Student> students = new ArrayList<Student>() {
            {
                add(new Student(20160002, "伯约", 21, 2, "信息安全", "武汉大学"));
                add(new Student(20160003, "玄德", 22, 3, "经济管理", "武汉大学"));
                add(new Student(20160004, "云长", 21, 2, "信息安全", "武汉大学"));
                add(new Student(20161001, "翼德", 21, 2, "机械与自动化", "华中科技大学"));
                add(new Student(20161002, "元直", 23, 4, "土木工程", "华中科技大学"));
                add(new Student(20161003, "奉孝", 23, 4, "计算机科学", "华中科技大学"));
                add(new Student(20162001, "仲谋", 22, 3, "土木工程", "浙江大学"));
                add(new Student(20162002, "鲁肃", 23, 4, "计算机科学", "浙江大学"));
                add(new Student(20163001, "丁奉", 24, 5, "土木工程", "南京大学"));
                add(new Student(20160001, "孔明", 20, 1, "土木工程", "武汉大学"));
            }
        };
        List<Student> students2 = students.stream().sorted(Comparator.comparingInt(x -> x.getAge())).collect(Collectors.toList());
```

### list\<object\>取object某个属性的list

```java
        List<Long> hitLogIdList = appealLogList.stream().map(AppealLog::getHitLogId).collect(Collectors.toList());
```

### idea中lombok报错

lombok报错

```
java: 不兼容的类型: 无法推断java.util.ArrayList<>的类型参数
    原因: 不存在类型变量E的实例, 以使java.util.ArrayList<E>与lombok.val一致
```

解决办法：

![lombok编译错误解决](https://chenpenghuan.github.io/files//img/20220802165524.png)

```java
-Djps.track.ap.dependencies=false
```

