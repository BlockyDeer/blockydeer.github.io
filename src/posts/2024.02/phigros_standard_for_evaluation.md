---
title: 'Phigros单Note评分标准'
date: 2024-02-05T17:33:46+08:00
draft: false
featured_image: 'posts/2024.02/assets/Phigros.png'
---

# Phigros单Note评分标准

我之前搜过这个问题，还真找到过一篇讲这个的文章（在B站专栏）。但是今天真的要用上的时候就找不到了，于是在我的各种电子设备上一通找。翻到一张之前手抄的那张文章中的公式的照片。

现在放在我自己的网站上，以免又丢了∠( ᐛ 」∠)＿。

所以很抱歉，以下信息我暂时找不到原出处（但是原信息在B站专栏上是肯定的）。

---

设$c$为按下Note后的Combo数（结算完成），$n$为谱面物量，$m$是当时Phigros已知的此次最大连击数，$a$为aac值.

设 $s = 10^6$

那么对于每一个被判定的Note：

当 $c = m$ 时.

- 若判 Perfect.
  $获得分数 = \frac{s}{n}$
- 若判 Good.
  $获得分数 = \frac{sk_1}{n} (k_1\approx0.685)$
- 若判 Bad or Miss.
  $获得分数 = 0$

当 $c < m$ 时

- 若判Perfect.
  $获得分数 = \frac{sk_2}{n}(k_2\approx0.900)$
- 若判Good.
  $获得分数 = \frac{sk_3}{n} (k_3\approx0.585)$
- 若判 Bad or Miss.
  
  $获得分数 = 0$

$最终判分 = 900000a + \frac{ms}{n}$
