# 随时Go UI-SPEC v3（B 版·液态玻璃）

## 1. 基调
- 深色沉浸：页面底 #0B0F14；场景封面大图铺满，底部 0→70% 黑渐变保证文字可读。
- 强调色琥珀 #FFB547；正文 #F5F7FA，次级 rgba(245,247,250,.62)。
- 圆角：卡片 28px，玻璃底栏 32px（胶囊），按钮 999px。

## 2. 玻璃材质（仅用于 chrome：底栏、顶栏、浮动按钮、弹层；每屏 ≤2 层）
```css
.glass{
  background: rgba(28,32,40,.42);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255,255,255,.14);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.28),   /* 顶部高光 */
    inset 0 -1px 0 rgba(255,255,255,.06),  /* 底部反光 */
    0 12px 32px rgba(0,0,0,.35);           /* 悬浮阴影 */
}
.glass::before{ /* 镜面高光，静态，不做动画 */
  content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;
  background: linear-gradient(180deg,rgba(255,255,255,.18) 0%,rgba(255,255,255,0) 45%);
}
```
- 浅色场景下 background 改 rgba(255,255,255,.55)，边框 rgba(255,255,255,.5)。
- 内容卡片**不用** backdrop-filter，只用实色 + 阴影。
- 降级：`@supports not (backdrop-filter:blur(1px))` 时 background 用 rgba(28,32,40,.88)。

## 3. 弹簧曲线（对标 iOS）
```css
--spring-snappy: cubic-bezier(.34,1.3,.64,1);  /* iOS .snappy ≈ 轻回弹 */
--spring-smooth: cubic-bezier(.32,.72,0,1);    /* iOS .smooth / 系统导航 */
--ease-out:      cubic-bezier(.2,.8,.2,1);
```
复杂弹簧用 Web Animations API + 预计算 linear() 关键帧（stiffness 300, damping 26）；不支持 linear() 时退回上面的 cubic-bezier。

## 4. 动效
| 场景 | 动作 | 时长 / 曲线 |
|---|---|---|
| Tab 切换 | 选中胶囊 translateX 滑到目标；图标 scale 1→1.12→1 | 320ms snappy |
| | 内容交叉淡入：新页 opacity 0→1 + translateY 8→0 | 220ms ease-out |
| 底栏按压 | 胶囊 scale(.94)，松手回弹 | 按下 120ms / 回弹 320ms snappy |
| 滚动收缩 | 下滑 >40px：底栏 scale(.86)+translateY(6px)，标签 opacity→0；上滑恢复 | 260ms smooth |
| 卡片展开（首页→场景） | 共享元素：记录卡片 rect，封面从卡片位置 transform 放大到全屏头图（FLIP） | 420ms smooth |
| | 场景内容随后 opacity 0→1 + translateY 16→0，Tab 栏从下 translateY(100%)→0 | 延迟 120ms，300ms snappy |
| 返回 | 反向 FLIP 缩回原卡片位置；支持左缘右滑手势，跟手 translateX，松手 >35% 宽或速度 >0.5px/ms 则完成 | 360ms smooth |
| 卡片按压 | scale(.97) | 120ms / 回弹 280ms snappy |

## 5. 60fps 守则（Android WebView）
1. 只动画 transform / opacity；动画元素加 `will-change:transform`，结束后移除。
2. blur 层不做尺寸/模糊值动画，只整体 transform。
3. 封面图用 `<img decoding="async">`，按屏宽出 1x/2x WebP，≤200KB。
4. 滚动监听用 passive + rAF 节流。
5. `prefers-reduced-motion: reduce` 时全部改为 150ms 淡入淡出。

## 6. 验收
- 荣耀 90 Pro 上首页滚动、Tab 切换、卡片展开/返回均无可见掉帧（Chrome DevTools Performance 帧耗时 <16.7ms，长任务 0）。
- 玻璃底栏透出背后大图色彩且文字清晰（对比度 ≥4.5:1）。
- 每屏 backdrop-filter 层数 ≤2。
- 选中胶囊有轻微回弹，无抖动；返回手势可中途取消。

## 7. 浅色主题（全局唯一主题，替代上面的深色值）
### 色板（CSS 变量）
```css
:root{
  --bg:#F5F5F7; --bg-grouped:#F2F2F7;
  --card:#FFFFFF; --card-2:#FAFAFC;
  --sep:rgba(60,60,67,.12);
  --text-1:#1D1D1F;            /* 标题/正文 */
  --text-2:rgba(60,60,67,.72); /* 次级 */
  --text-3:rgba(60,60,67,.45); /* 辅助/占位 */
  --accent:#E8890C;            /* 琥珀在白底加深，保证 ≥3:1；小字用 #B86A00 */
  --accent-soft:rgba(232,137,12,.12);
  --success:#34A853; --danger:#E5484D;
}
```
- 卡片：背景用 `var(--card)`，圆角不变，阴影 `0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06)`，不加边框。
- 文字层级：大标题 28/700 用 --text-1；节标题 17/600 用 --text-1；正文 15/400 用 --text-1；次级 13/400 用 --text-2；角标 11/500 用 --text-3。
- 删除所有深色值，包括 #0B0F14、rgba(28,32,40,…) 和 rgba(245,247,250,…)，一处都不留。

### 浅色液态玻璃（只用于底栏、顶栏、浮动按钮和弹层）
```css
.glass{
  background:rgba(255,255,255,.62);
  backdrop-filter:blur(24px) saturate(180%);
  -webkit-backdrop-filter:blur(24px) saturate(180%);
  border:.5px solid rgba(255,255,255,.7);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.9),
    0 0 0 .5px rgba(0,0,0,.06),
    0 8px 28px rgba(0,0,0,.10);
}
.glass::before{background:linear-gradient(180deg,rgba(255,255,255,.55) 0%,rgba(255,255,255,0) 50%);}
@supports not (backdrop-filter:blur(1px)){ .glass{background:rgba(255,255,255,.94);} }
```
- 底栏选中胶囊用 `background:var(--accent-soft)`、`border:1px solid rgba(232,137,12,.35)`；选中图标和文字用 --accent，未选中用 --text-2。
- 压在图片上的玻璃按钮（返回、收藏）白底透明度改成 .72，图标颜色用 --text-1。

### 图片上的文字遮罩
图片上的文字仍然用白字，配下面的黑色渐变遮罩；只有图片区域保留这层暗色，其他地方不能出现深色块。
```css
.cover::after{background:
  linear-gradient(180deg,rgba(0,0,0,.18) 0%,rgba(0,0,0,0) 20%),
  linear-gradient(0deg,rgba(0,0,0,.62) 0%,rgba(0,0,0,.25) 35%,rgba(0,0,0,0) 60%);}
.cover .title{color:#fff;text-shadow:0 1px 12px rgba(0,0,0,.25);}
```
- 场景头图底部加一段 24px 的渐变，从透明过渡到 --bg，让头图和下面的页面自然衔接。

### 验收
- 正文对比度 ≥7:1，次级文字 ≥4.5:1，小号琥珀色文字一律用 #B86A00。
- 截图逐页检查：除图片遮罩外，没有任何亮度低于 #E5E5EA 的整块背景。

## 7.1 悬浮玻璃导航（对照 ref-glass/ref1、ref2；覆盖前面对底栏和顶栏的写法）
### 浅色玻璃参数（统一用于底栏胶囊、圆形按钮和标题胶囊）
```css
.glass{
  background:rgba(255,255,255,.72);
  backdrop-filter:blur(20px) saturate(180%);
  -webkit-backdrop-filter:blur(20px) saturate(180%);
  border:.5px solid rgba(0,0,0,.08);                 /* 细描边，参考图里的灰色细线 */
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.95),              /* 顶部细高光 */
    inset 0 -.5px 0 rgba(0,0,0,.04),
    0 2px 6px rgba(0,0,0,.04),
    0 10px 32px rgba(0,0,0,.10);                      /* 柔和的大阴影 */
}
.glass:active{transform:scale(.94);transition:transform 120ms;}
```

### 底栏：悬浮胶囊
```css
.tabbar{position:fixed;left:16px;right:16px;
  bottom:calc(12px + env(safe-area-inset-bottom));
  height:62px;border-radius:31px;padding:0 6px;
  display:flex;align-items:center;justify-content:space-around;}
.tabbar .pill{height:50px;border-radius:25px;background:rgba(0,0,0,.05);} /* 选中胶囊用中性灰，不再用琥珀色底 */
.tabbar .item.active{color:var(--accent-strong,#B86A00);}
.tabbar .item{color:rgba(60,60,67,.6);font-size:10px;font-weight:600;}
.page{padding-bottom:calc(62px + 12px + env(safe-area-inset-bottom) + 20px);}
```
- 底栏四周都要有留空，不能贴边；滚动时收缩成小胶囊的效果保留（见第 4 节）。

### 顶栏：圆形返回键 + 居中标题胶囊 + 右侧圆形按钮
```css
.topbar{position:fixed;top:calc(8px + env(safe-area-inset-top));left:16px;right:16px;
  height:44px;display:flex;align-items:center;justify-content:space-between;
  pointer-events:none;background:none;}
.topbar > *{pointer-events:auto;}
.topbar .circle{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;color:#1D1D1F;}
.topbar .circle svg{width:22px;height:22px;stroke-width:2.2;}
.topbar .title-pill{position:absolute;left:50%;transform:translateX(-50%);
  height:40px;padding:0 16px;border-radius:20px;max-width:56%;
  display:flex;align-items:center;gap:8px;font:600 16px/1 system-ui;color:#1D1D1F;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
  opacity:0;transition:opacity .2s,transform .26s cubic-bezier(.32,.72,0,1);}
.topbar.scrolled .title-pill{opacity:1;}  /* 概览页滚过头图后才出现；其他 Tab 一直显示 */
```
- 三个控件都加 `.glass`；右侧的圆形按钮放“收藏”或“更多”（…）。
- 顶栏不再有整条背景，内容从按钮之间透出来。

### 验收
- 底栏和顶栏四周可以看到页面背景，左右留空 16px，底栏离底 12px（另加安全区）。
- 白底页面上，靠描边和阴影仍能分清玻璃控件的轮廓；压在图片上时能透出图片颜色。
- 每屏 backdrop-filter 层数不超过 4（底栏 1 个、顶栏 3 个），在荣耀 90 Pro 上滚动无掉帧；如果掉帧，顶栏的两个圆形按钮改用不透明白底 `rgba(255,255,255,.9)`，去掉模糊。

## 8. 手势动效（1.2.8）
### 8.1 Tab 左右滑动切换
- 结构：5 个 Tab 页横排在一个 track 里，`transform:translate3d(-index*100% + dx,0,0)`，不要用 scroll-snap（会和跟手冲突）。
- 识别：pointerdown 后先看前 10px 的移动，`|dx| > |dy|*1.2` 才判定为横滑，否则交给纵向滚动；判定为横滑后对 track 设 `touch-action:pan-y`，用 pointer capture 锁定手势。
- 跟手：dx 1:1 跟随手指；第一个 Tab 往右拉、最后一个 Tab 往左拉时加橡皮筋阻尼 `dx*0.35`。
- 切换判定：松手时满足 `|dx| > 30% 屏宽` 或 `|速度| > 0.4px/ms`，就切到相邻 Tab；否则回弹到原位。
- 松手动画：`transform 320ms cubic-bezier(.32,.72,0,1)`；剩余距离很短时最短 180ms，时长按剩余距离比例算。
- 底栏同步：选中胶囊的位置 = 当前 index + dx/屏宽，跟手时实时插值，不加 transition；松手时和页面同一条曲线、同一时长。图标和文字颜色在进度过半时切换。
- 冲突：起点落在横向滚动容器上（日期条、票据筛选、图片轮播）时，只要该容器还能往这个方向滚，就不触发 Tab 切换。容器标 `data-hscroll`，判断条件是 `scrollLeft` 在两端之间。

### 8.2 左边缘右滑返回
- 起点：`clientX < 24px`，首页不启用。从左边缘开始的手势优先级高于 Tab 横滑，也高于横向列表。
- 跟手：当前页 `translateX(dx)`，左侧阴影 `box-shadow:-8px 0 24px rgba(0,0,0,.12)`；下层页面从 `translateX(-30%)` 线性移到 0，同时盖一层白色遮罩，opacity 从 .4 降到 0（浅色主题，不用黑色遮罩）。
- 完成判定：`dx > 35% 屏宽` 或 `速度 > 0.5px/ms`，就完成返回，动画 300ms smooth；否则取消，回弹 260ms，用同一条 smooth 曲线。
- 返回完成后再调用 history.back，系统返回键走同一套动画，不跳帧。

### 8.3 性能与验收
- 只改 transform 和 opacity；位置更新放进 rAF，一帧最多更新一次；pointermove 监听设为 passive；手势结束后清掉 will-change。
- 跟手过程中玻璃底栏的 backdrop 不要重算，底栏本身不移动，只移动选中胶囊。
- 验收：在荣耀 90 Pro 上快速连续左右滑 10 次没有掉帧，底栏高亮和页面始终同步；在日期条上横滑只滚动日期，不切 Tab；首页从左边缘右滑没有反应；返回手势中途松手能正确回弹。
- `prefers-reduced-motion` 打开时：跟手照常；松手后直接淡入淡出切换，时长 150ms。
