/**
 * Created by Administrator on 2017/5/9.
 */
import  _layer from './component/layer/layer.js'

const App = function () {
	var dom = document.getElementById('app')
	var layer= new _layer()
	dom.innerHTML=layer.tpl({
		name:'hehhe',
		arr:['app','mi']
	})
	$('body').css('background','blue')
}
new App()