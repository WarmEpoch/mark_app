<template>
</template>

<script>
	export default {
		data() {
			return {
				local: 'http://192.168.3.11:5173/',
				static: '/static/index.html',
				webView: plus.webview.create('', 'webview', {
							kernelRecovery: 'reload',
						}),
			}
		},
		onLoad() {
			uni.request({
				url: this.local,
				timeout: 1000,
			}).then(e => {
				if(/request:ok/.test(JSON.stringify(e))){
					this.webView.loadURL(this.local)
				}else{
					this.webView.loadURL(this.static)
				}
			}).catch(err => {
				this.webView.loadURL(this.static)
			}).finally(() => {
				this.webView.overrideUrlLoading({
					mode: 'reject',
				}, e => {
					const regexp = /(.*)\/\/(.*)\/(.*)/g;
					const array = [...e.url.matchAll(regexp)];
					uni.navigateTo({
						url: `${array[0][2]}?id=${array[0][3]}`
					})
				})
				this.$scope.$getAppWebview().append(this.webView)
			})
		},
		methods: {
			async canBack() {
				return new Promise((resolve) => {
					this.webView.canBack((e) => {
						resolve(e.canBack)
					})
				})
			}
		}
	}
</script>