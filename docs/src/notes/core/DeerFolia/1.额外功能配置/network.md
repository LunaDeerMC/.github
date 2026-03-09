---
title: 网络优化
createTime: 2025/06/23 13:42:00
permalink: /core/DeerFolia/features/network/
---

优化了网络数据包的 VarInt 编解码和帧编码流程，降低了 CPU 及带宽开销。

```yaml
# config/deer-folia.yml
network-optimizations:
   optimized-var-int: true
   optimized-frame-encoding: true
```

- `optimized-var-int`：是否启用优化的 VarInt 读写操作；
- `optimized-frame-encoding`：是否启用优化的帧编码以提高吞吐量；

> 默认情况下两者均已启用，通常无需修改。如果遇到与网络相关的兼容性问题，可以尝试关闭对应选项。
