
$(function() {
	$('#searchWords').typeahead({
	source: function (query, process) {
	//query是输入值
		// $.getJSON('http://127.0.0.1:8099/getBookList', { "query": query }, function (data) {
		// 	process(data);
		// });
		$.ajax({
        // url: "http://127.0.0.1:8099/getBookList",
        url: "http://readingkid.us-east-2.elasticbeanstalk.com/getBookList",
        method: 'post',
        dataType: 'json',
        context: 'application/json;charset=utf-8',
        success: function(data){
        	var tmp = [];
        	console.log(data)
        	_.each(data, function(v,k){
        		tmp.push(v['bookname'])
        	})
        	console.log(tmp)
        	process(tmp);
            }
        });
	},
	updater: function (item) {
		return item.replace(/<a(.+?)<\/a>/, ""); //这里一定要return，否则选中不显示
	},
	afterSelect: function (item) {
	//选择项之后的时间，item是当前选中的项
	alert(item);
	},
	items: 8, //显示8条
	delay: 500 //延迟时间
});
});
