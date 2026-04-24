---
title: 生物动态激活
createTime: 2025/06/23 13:35:52
permalink: /core/DeerFolia/features/dab/
---

基于 Pufferfish 的动态激活大脑实现，通过动态开启/关闭生物的 AI 来提升服务器性能。

## 工作原理

生物只有在玩家接近时才激活其 AI（激活距离内），远离时则暂停 AI 以减少 CPU 占用。这对于村民、铁傀儡等需要频繁 AI 计算的生物尤为有效。

## 配置项

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
- `maximum-activation-prio`：最大停顿（如果设置为 20 则表示无论多远，每 20 tick 都至少计算一次）；
- `start-distance`：开始递减的距离；

> 如果刷怪塔受到影响可以尝试减少 `activation-distance-mod` 或者增加 `start-distance`。
> 通常情况下，`activation-distance-mod` 推荐设置为 7 或 8，`start-distance` 推荐设置为 12。
