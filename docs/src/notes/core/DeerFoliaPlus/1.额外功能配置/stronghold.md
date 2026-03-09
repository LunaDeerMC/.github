---
title: 基岩版风格要塞生成
createTime: 2025/06/23 13:37:53
permalink: /core/DeerFoliaPlus/features/stronghold/
---

将 Java 版的要塞生成方式替换为类似基岩版的随机分布模式。原版 Java 版中要塞以同心环的形式分布，且总数量固定为 128 个；启用此功能后，要塞将以随机分散的方式无限制地生成在世界各处。

## 配置参考

```yaml
# config/deer-folia-plus.yml
bedrock-stronghold-generation:
   enabled: false
   spacing: 48
   separation: 12
```

- `enabled`：是否启用基岩版风格的要塞生成，默认为 `false`；
- `spacing`：要塞之间的平均距离（以区块为单位），默认 48；
- `separation`：要塞之间的最小距离（以区块为单位），必须小于 `spacing`，默认 12；

> ⚠️ 此功能会影响世界生成，建议仅在新建世界时启用。在已有世界中启用可能导致要塞分布不一致。
