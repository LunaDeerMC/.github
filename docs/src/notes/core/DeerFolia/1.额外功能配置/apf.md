---
title: 异步寻路
createTime: 2025/06/23 13:37:53
permalink: /core/DeerFolia/features/apf/
---

引入异步路径查找和相关的机制，使用线程池处理路径计算，提升了路径查找的性能和响应速度。

## 工作原理

异步寻路将耗时的路径计算任务从主线程转移到专门的线程池中处理，避免阻塞服务器主循环。`NodeEvaluatorCache` 使用特征标识（`NodeEvaluatorFeatures`）来复用和缓存路径评估器，减少对象创建开销。

## 配置项

```yaml
# config/deer-folia.yml
async-pathfinding:
   enabled: true
   async-pathfinding-keep-alive: 60
   async-pathfinding-max-threads: 20
```

- `enabled`：是否启用；
- `async-pathfinding-keepalive`：单个线程最大活跃时间（秒）；
- `async-pathfinding-max-threads`：用于异步寻路的线程池大小；

> 线程池本质上为虚拟线程，与 CPU 物理核心无关。过少的线程池大小可能会对性能提升不明显，过多通常不会有明显的负面影响但是可能会影响 Java 的 GC。
> 推荐 `async-pathfinding-max-threads` 为 10-20 之间。
