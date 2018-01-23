require(['vue', '$', 'bootstrap', 'popover', 'bootstrap-year-calendar', 'bootstrap-datepicker', 'underscore', 'bootstrap3-typeahead'],
    function(Vue) {

        // var getChildrenTextContent = function (children) {
        //   return children.map(function (node) {
        //     return node.children
        //       ? getChildrenTextContent(node.children)
        //       : node.text
        //   }).join('')
        // }
        $(document).off('.alert.data-api');

        Vue.component('alert', {
            props: {
                type: {
                    type: String,
                    required: true,
                    default: 'alert'
                },
                close: {
                	type: Boolean,
                	required: false,
                	default: false
                }
            },
            mounted: function(){
            	var self = this;
            	if(!self.close) {
            		setTimeout(function(){
            			self.$emit('close')
            		}, 2000);
            	}
            },
            render: function(createElement) {
                // var closeicon = getChildrenTextContent(this.$slots.default)
                //   .toLowerCase()
                //   .replace(/\W+/g, '-')
                //   .replace(/(^\-|\-$)/g, '')

                var self = this;
                return createElement(
                    'div', {
                        class: {
                            'alert': true, 
                            ['alert-' + self.type]: true,
                            'alert-dismissible': self.close
                        },
                        style: {
                        	marginTop: '20px'
                        }
                    }, [
                    	self.close ? 
                        createElement('button', {
                            attrs: {
                                type: 'button',
                                'data-dismiss': 'alert'
                            },
                            class: {
                                'close': true
                            },
                            on: {
                        		click: function(){
                        			self.$emit('close')
                        		}
                        	}
                        }, this.$slots.foo) : '',
                        createElement('span',this.$slots.default)
                    ]
                )
            }
        })

        Vue.component('loading', {
        	template: [
        	'<div class="refresh-container">',
				'<i class="refresh-spinner glyphicon glyphicon-refresh glyphicon-refresh-animate"></i>',
			'</div>'].join('')
        })

        var app = new Vue({
            el: '#app',
            delimiters: ['${', '}'],
            data: {
                keyword: '',
                booklist: [],
                alert: {},
                changer : false
            },
            computed: {
            	a: function(){
            		var self = this;
	            	var defaultAlert = {
	            		type: 'warning', //success, info, warning, danger
		                message: '',
		                close: false
	            	}
	            	return _.extend({}, defaultAlert, self.alert);
            	},
            	loading: function(){
            		var self = this;
            		return {
            			in: function(){
            				self.changer = true;
            			},
            			out: function(){
            				self.changer = false;

            			}
            		}
            	}
            },
            mounted: function() {
                var self = this;
                $('#searchWords').typeahead({
                    source: function(query, process) {
                        //query是输入值
                        // $.getJSON('http://127.0.0.1:8099/getBookList', { "query": query }, function (data) {
                        // 	process(data);
                        // });

                        if (self.booklist.length == 0) {
                        	self.loading.in();
                            $.ajax({
                                url: "http://readingkid.us-east-2.elasticbeanstalk.com/getBookList",
                                method: 'post',
                                dataType: 'json',
                                context: 'application/json;charset=utf-8',
                                success: function(data) {
                                    var tmp = [];
                                    // console.log(data)
                                    _.each(data, function(v, k) {
                                        tmp.push(v['bookname'])
                                    })
                                    // console.log(tmp)
                                    self.booklist = tmp;
                                    process(self.booklist);
                                    self.loading.out();
                                },
                                error: function(data){
                                	self.alert = {
	                            		close : true,
	                            		type : 'danger',
		                        		message : JSON.stringify(data)
		                        	}
                                    self.loading.out();
                                }
                            });
                        } else {
                            process(self.booklist);

                        }

                    },
                    updater: function(item) {
                        return item.replace(/<a(.+?)<\/a>/, ""); //这里一定要return，否则选中不显示
                    },
                    afterSelect: function(item) {
                        //选择项之后的时间，item是当前选中的项
                        // alert(item);
                        self.keyword = item;
                    },
                    items: 8, //显示8条
                    delay: 500 //延迟时间
                });
            },
            methods: {
                closeAlert: function() {
                	var self = this;
                	self.alert = {
                		message :''
                	}
                },
                postPunch: function() {
                    var self = this;
                    for (var i = 0; i < 1; i++) {
                        if (self.keyword == '') {
                        	self.alert = {
                        		message :'请输入书名'
                        	}
                            break;
                        }
                        self.loading.in();
                        $.ajax({
                            url: "http://readingkid.us-east-2.elasticbeanstalk.com/punch",
                            method: 'post',
                            dataType: 'json',
                            data: {
                                searchWords: self.keyword
                            },
                            context: 'application/json;charset=utf-8',
                            success: function(data) {
                                console.log(data)
                                self.loading.out();
                                if (data.success) {
                                	self.keyword = '';
                                	self.alert = {
                                		type : 'success',
		                        		message : 'bookid: ' + data.result.book_id + '  bookname: ' + data.result.book_name
		                        	}
                                   
                                    } else {
                                    	self.alert = {
                                    		close : true,
			                        		message : data.resultMassage
			                        	}
                                }
                            },
                            error: function(data) {
                            	self.alert = {
                            		close : true,
                            		type : 'danger',
	                        		message : JSON.stringify(data)
	                        	}
                                self.loading.out();
                            }
                        });
                    }

                },
            }
        })
    })