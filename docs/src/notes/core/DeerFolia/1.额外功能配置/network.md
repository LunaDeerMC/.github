---
title: 网络优化
createTime: 2025/06/23 13:42:00
permalink: /core/DeerFolia/features/network/
---

优化了网络数据包的 VarInt 编解码和帧编码流程，降低了 CPU 及带宽开销。

## 优化内容

- **VarInt 读写优化**：优化了 VarInt（可变长度整数）的读写操作，减少了 CPU 占用
- **帧编码优化**：优化了数据包的帧编码方式，提高了网络吞吐量

## 配置项

```yaml
# config/deer-folia.yml
network-optimizations:
   optimized-var-int: true
   optimized-frame-encoding: true
```

- `optimized-var-int`：是否启用优化的 VarInt 读写操作；
- `optimized-frame-encoding`：是否启用优化的帧编码以提高吞吐量；

> 默认情况下两者均已启用，通常无需修改。如果遇到与网络相关的兼容性问题，可以尝试关闭对应选项。
