
$(function() {
	

	var app = new Vue({
	  el: '#app',
	  data: {
	    keyword: '',
	    booklist: []
	  },
	  mounted: function(){
	  	var self = this;
	  	$('#searchWords').typeahead({
				source: function (query, process) {
				//query是输入值
					// $.getJSON('http://127.0.0.1:8099/getBookList', { "query": query }, function (data) {
					// 	process(data);
					// });
					
	  			if(self.booklist.length == 0) {
	  				$.ajax({
			        url: "http://127.0.0.1:8099/getBookList",
			        method: 'post',
			        dataType: 'json',
			        context: 'application/json;charset=utf-8',
			        success: function(data){
				        	var tmp = [];
				        	// console.log(data)
				        	_.each(data, function(v,k){
				        		tmp.push(v['bookname'])
				        	})
				        	// console.log(tmp)
				        	self.booklist = tmp;
				        	process(self.booklist);
			            }
			        });
	  			} else {
				    process(self.booklist);

	  			}
					
					},
					updater: function (item) {
						return item.replace(/<a(.+?)<\/a>/, ""); //这里一定要return，否则选中不显示
					},
					afterSelect: function (item) {
					//选择项之后的时间，item是当前选中的项
						// alert(item);
						self.keyword = item;
					},
					items: 8, //显示8条
					delay: 500 //延迟时间
				});
	  },
	  methods: {
	  	postPunch: function(){
	  		var self = this;
	  		alert(self.keyword);
	  		$.ajax({
	        url: "http://127.0.0.1:8099/punch",
	        method: 'post',
	        dataType: 'json',
	        data: {
	        	searchWords: self.keyword
	        },
	        context: 'application/json;charset=utf-8',
	        success: function(data){
	        	console.log(data)	
	        	if(data.success) {
	        		alert('bookid: ' + data.result.book_id + '  bookname: ' + data.result.book_name);
	        		self.keyword = '';
	        	} else {
	        		alert(data.resultMassage);
	        	}

	        }
	        });
			},
  	}
	})		
});
