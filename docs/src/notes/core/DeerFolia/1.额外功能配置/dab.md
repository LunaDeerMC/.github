---
title: 生物动态激活
createTime: 2025/06/23 13:35:52
permalink: /core/DeerFolia/features/dab/
---

通过动态调整实体的激活频率，减少了不必要的计算，提升服务器的性能。

```yaml
# config/deer-folia.yml
dynamic-activation-brain:
   enabled: true
   start-distance: 12
   activation-distance-mod: 8
   maximum-activation-prio: 20
```
- `enabled`：是否启用；
- `activation-distance-mod`：递减倍数；
- `maximum-activation-prio`：最大停顿（如果设置为20则表示无论多远，每20tick都至少计算一次）；
- `start-distance`：开始递减的距离；

> 如果刷怪塔收到影响可以尝试减少 `activation-distance-mod` 或者增加 `start-distance`。
> 通常情况下，`activation-distance-mod` 推荐设置为 7 或 8，`start-distance` 推荐设置为 12。
