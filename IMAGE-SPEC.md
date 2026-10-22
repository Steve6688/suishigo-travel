# 图片审图与裁切/调色规范（UI）

## 打回标准（任一即打回）
灰天/正午顶光/逆光死黑；主体不清或居中呆板；画面里游客、路牌、水印抢眼；地平线歪；与其他图同一机位或构图；横向<2000px；HDR 过度、饱和发荧光。

## 裁切
| 用途 | 比例 | 输出 @1x/@2x | 焦点 |
|---|---|---|---|
| 首页场景卡 | 16:10 | 828×518 / 1656×1036 | 主体落在右上三分点，左下留给标题 |
| 场景头图（概览） | 3:4 | 828×1104 / 1656×2208 | 主体在上 1/3，下 40% 留暗部压字 |
| 每日配图 | 16:9 | 828×466 / 1656×932 | 三分法，地平线在上 1/3 或下 1/3 |
- JSON 每张图加 `focus:"x% y%"`，CSS 用 `object-fit:cover; object-position:var(--focus,50% 40%)`，换比例时主体不被裁掉。
- WebP q=78，@2x ≤220KB。

## 统一调色（ImageMagick/sharp 批处理，轻调，不改色相）
- 曝光：中间调 +0.1EV；高光 −15%；阴影 +10%。
- 色温：黄金时段图保持暖调，蓝调图不加暖；全部饱和度 ×1.05，vibrance 优先。
- 对比：轻 S 曲线，黑场抬到 #0A0C10（与深色底融合，不纯黑）。
- sharp 参考：`.modulate({brightness:1.03,saturation:1.05}).linear(1.06,-6).sharpen(0.6)`

## 渐变遮罩（CSS，不烘焙进图片）
```css
.cover::after{content:"";position:absolute;inset:0;pointer-events:none;
  background:
   linear-gradient(180deg,rgba(11,15,20,.35) 0%,rgba(11,15,20,0) 22%),      /* 顶部压暗，保证返回按钮可见 */
   linear-gradient(0deg,rgba(11,15,20,.88) 0%,rgba(11,15,20,.45) 32%,rgba(11,15,20,0) 60%); /* 底部压字 */
}
.day-img::after{background:linear-gradient(0deg,rgba(11,15,20,.55) 0%,rgba(11,15,20,0) 45%);}
```
- 验收：标题文字对比度 ≥4.5:1；同屏不出现两张主色调相同的相邻图。
