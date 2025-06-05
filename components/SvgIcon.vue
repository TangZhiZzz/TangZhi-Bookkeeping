<template>
	<image :src="iconPath" :style="iconStyle" mode="aspectFit"></image>
</template>

<script>
	export default {
		name: 'SvgIcon',
		props: {
			name: {
				type: String,
				required: true
			},
			size: {
				type: [Number, String],
				default: 40
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
				// const size = typeof this.size === 'number' ? `${this.size}rpx` : this.size;
				const size = `${this.size}rpx`;

				let style = `width: ${size}; height: ${size};`;
				
				// 如果指定了颜色，使用filter属性来改变SVG颜色
				if (this.color) {
					// 这里可以添加颜色转换逻辑
					// 简单起见，这里只处理几种常见颜色
					switch(this.color) {
						case '#5677fc': // 主题蓝色
							style += 'filter: brightness(0) saturate(100%) invert(43%) sepia(85%) saturate(1401%) hue-rotate(213deg) brightness(96%) contrast(98%);';
							break;
						case '#f56c6c': // 红色/支出
							style += 'filter: brightness(0) saturate(100%) invert(56%) sepia(75%) saturate(5532%) hue-rotate(335deg) brightness(100%) contrast(96%);';
							break;
						case '#67c23a': // 绿色/收入
							style += 'filter: brightness(0) saturate(100%) invert(68%) sepia(23%) saturate(1071%) hue-rotate(54deg) brightness(93%) contrast(88%);';
							break;
						case '#909399': // 灰色
							style += 'filter: brightness(0) saturate(100%) invert(62%) sepia(12%) saturate(219%) hue-rotate(182deg) brightness(90%) contrast(87%);';
							break;
						default:
							// 如果是其他颜色，尝试直接应用
							style += `color: ${this.color};`;
					}
				}
				
				return style;
			}
		}
	}
</script>

<style>
	/* 可以添加一些基础样式 */
</style>