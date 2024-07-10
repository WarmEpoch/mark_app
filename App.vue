<script>
	export default {
		data() {
			return {
				lanzouBase: 'https://muyl.lanzouq.com',
				lanzouUrl: 'b068mx5rc',
				lanzouPwd: 'hbl8',
			}
		},
		onLaunch: function() {
			console.log('App Launch')
			if (process.env.NODE_ENV === 'development') {
				return false
			}
			Promise.resolve().then(async () => {
				let more
				if (uni.getSystemInfoSync().platform == 'android') {
					more = await this.LanzouMore(lanzouUrl, lanzouPwd, 'apk')
				} else if (uni.getSystemInfoSync().platform == 'ios'){
					more = await this.LanzouMore(lanzouUrl, lanzouPwd, 'ipa')
				}else{
					plus.runtime.openURL('https://www.immers.icu/#call')
					return
				}
				console.log(more)
				if(more[0].version > plus.runtime.versionCode){
					const detail = await this.Lanzou(more[0]['id'])
					uni.showModal({
						title: '更新新版本',
						content: detail.desc,
						showCancel: false,
						success: e => {
							if (!e.confirm) {
								plus.runtime.quit()
								return
							}
							plus.runtime.openURL(detail.downUrl)
						}
					})
				}
			})
		
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			async Lanzou(id) {
				const header = {
					'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
					'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
				}
				const _data = await uni.request({
					url: `${this.lanzouBase}/${id}`,
					header
				}).then(res => res[1].data)
				const desc = [..._data.matchAll(/文件描述：<\/span><br>\n([\s\S]*?)\s*?<\/td>/g)][0][1].replaceAll('<br />',
					'')
				const iframeUrl = [..._data.matchAll(/iframe.*src="(.*)"\sframeborder/g)][1][1]
				const _iframe = await uni.request({
					url: `${this.lanzouBase}/${iframeUrl}`,
					header
				}).then(res => res[1]['data'])
				const actionValue = [..._iframe.matchAll(/'action':'(.*?)',/g)][0][1]
				const signValue = [..._iframe.matchAll(/'sign':'(.*?)',/g)][0][1]
				const signsValue = [..._iframe.matchAll(/'signs':(.*?),/g)][0][1]
				const signsReg = new RegExp(signsValue + "\\s=\\s'(.*)'", 'g')
				const websignValue = [..._iframe.matchAll(/'websign':(.*?),/g)][0][1]
				const websignReg = new RegExp(websignValue + "\\s=\\s'(.*)'", 'g')
				const websignkeyValue = [..._iframe.matchAll(/'websignkey':(.*?),/g)][0][1]
				const websignkeyReg = new RegExp(websignkeyValue + "\\s=\\s'(.*)'", 'g')
				const data = {
					'action': actionValue,
					'signs': [..._iframe.matchAll(signsReg)][0][1],
					'sign': signValue,
					'websign': [..._iframe.matchAll(websignReg)][0][1],
					'websignkey': [..._iframe.matchAll(websignkeyReg)][0][1],
					'ves': 1,
				}
				const downprocess = await uni.request({
					url: `${this.lanzouBase}/ajaxm.php`,
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded',
						'Referer': `${this.lanzouBase}/${iframeUrl}`
					},
					data
				}).then(res => res[1].data)
				const downUrl = `${downprocess.dom}/file/${downprocess.url}`
				return {
					desc,
					downUrl,
				}
			},
			async LanzouMore(id, pwd, type) {
				const _data = await uni.request({
					url: `${this.lanzouBase}/${id}`,
				}).then(res => res[1].data)
				const tValue = [..._data.matchAll(/'t':(.*),/g)][0][1]
				const kValue = [..._data.matchAll(/'k':(.*),/g)][0][1]
				const tReg = new RegExp(tValue + "\\s=\\s'(.*)'", 'g')
				const kReg = new RegExp(kValue + "\\s=\\s'(.*)'", 'g')
				const data = {
					'lx': '2',
					'fid': '9057744',
					'pg': '1',
					't': [..._data.matchAll(tReg)][0][1],
					'k': [..._data.matchAll(kReg)][0][1],
					'pwd': pwd
				}
				const more = await uni.request({
					url: `${this.lanzouBase}/filemoreajax.php`,
					method: 'POST',
					header: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data
				}).then(res => res[1].data)
				if (more.info !== 'sucess') {
					return []
				}
				const json = []
				more.text.forEach(item => {
					if (item.icon == type) {
						json.push({
							id: item.id,
							type: item.icon,
							name: item.name_all,
							version: item.name_all.split('.')[1]
						})
					}
				})
				json.sort((a, b) => a.version > b.version ? -1 : 1)
				return json
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
</style>