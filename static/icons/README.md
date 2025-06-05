# 图标使用指南

## 图标列表

本项目包含以下SVG图标：

- `home.svg` - 首页图标
- `plus-circle.svg` - 添加/记账图标
- `account.svg` - 我的账户图标
- `food.svg` - 餐饮类别图标
- `car.svg` - 交通类别图标
- `shopping-cart.svg` - 购物类别图标
- `rmb-circle.svg` - 收入/人民币图标
- `gift.svg` - 奖金/礼物图标
- `graph.svg` - 理财/图表图标
- `video.svg` - 娱乐图标
- `right.svg` - 右箭头图标
- `close.svg` - 关闭图标

## 在Vue组件中使用SVG图标

### 方法一：直接使用image标签

```html
<image src="/static/icons/home.svg" mode="aspectFit" style="width: 24px; height: 24px;"></image>
```

### 方法二：使用背景图片

```html
<view class="icon-home"></view>
```

```css
.icon-home {
  width: 24px;
  height: 24px;
  background-image: url('/static/icons/home.svg');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
```

### 方法三：创建图标组件

创建一个通用的图标组件 `components/SvgIcon.vue`：

```vue
<template>
  <image :src="iconPath" :style="iconStyle" mode="aspectFit"></image>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [Number, String],
      default: 24
    },
    color: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconPath() {
      return `/static/icons/${this.name}.svg`;
    },
    iconStyle() {
      const size = typeof this.size === 'number' ? `${this.size}px` : this.size;
      return `width: ${size}; height: ${size};`;
    }
  }
}
</script>
```

然后在其他组件中使用：

```html
<svg-icon name="home" :size="32" color="#5677fc"></svg-icon>
```

## 替换当前的字体图标

要将当前项目中的字体图标替换为SVG图标，可以按照以下步骤操作：

1. 在需要使用图标的组件中引入SVG图标：

```html
<!-- 原字体图标用法 -->
<text class="iconfont icon-home"></text>

<!-- 替换为SVG图标 -->
<image src="/static/icons/home.svg" mode="aspectFit" class="icon"></image>
```

2. 更新相应的CSS样式：

```css
.icon {
  width: 40rpx;
  height: 40rpx;
}
```

## 自定义SVG图标颜色

由于SVG图标使用了`fill="currentColor"`属性，可以通过CSS的`color`属性来控制图标颜色：

```html
<view class="colored-icon">
  <image src="/static/icons/home.svg" mode="aspectFit"></image>
</view>
```

```css
.colored-icon {
  color: #5677fc; /* 设置图标颜色 */
}

.colored-icon image {
  width: 40rpx;
  height: 40rpx;
  filter: brightness(0) saturate(100%) invert(43%) sepia(85%) saturate(1401%) hue-rotate(213deg) brightness(96%) contrast(98%);
}
```

注意：直接通过CSS的`color`属性控制SVG颜色在某些平台可能不生效，可以使用CSS的`filter`属性来实现颜色变换。