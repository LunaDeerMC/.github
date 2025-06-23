---
title: 异步寻路
createTime: 2025/06/23 13:37:53
permalink: /core/DeerFolia/features/apf/
---

引入异步路径查找和相关的机制，提升了路径查找的性能和响应速度。

```yaml
# config/deer-folia.yml
async-pathfinding:
   enabled: true
   async-pathfinding-keep-alive: 60
   async-pathfinding-max-threads: 20
```

- `enabled`：是否启用；
- `async-pathfinding-keepalive`：单个线程最大活跃时间；
- `async-pathfinding-max-threads`：用于异步寻路的线程池大小；

> 线程池本质上为虚拟线程，与cpu物理核心无关。过少的线程池大小可能会对性能提升不明显，过多通常不会有明显的负面影响但是可能会影响java的GC。
> 推荐 `async-pathfinding-max-threads` 为 10-20 之间。
