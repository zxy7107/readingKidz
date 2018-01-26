require(['vue', 'bloodhound', '$', 'bootstrap', 'popover', 'bootstrap-year-calendar', 'bootstrap-datepicker',
        'underscore', 'typeahead'
    ],
    function(Vue, Bloodhound) {

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
            mounted: function() {
                var self = this;
                if (!self.close) {
                    setTimeout(function() {
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
                            'alert': true, ['alert-' + self.type]: true,
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
                                click: function() {
                                    self.$emit('close')
                                }
                            }
                        }, this.$slots.foo) : '',
                        createElement('span', this.$slots.default)
                    ]
                )
            }
        })

        Vue.component('loading', {
            template: [
                '<div class="refresh-container">',
                '<i class="refresh-spinner glyphicon glyphicon-refresh glyphicon-refresh-animate"></i>',
                '</div>'
            ].join('')
        })

        var app = new Vue({
            el: '#library-app',
            delimiters: ['${', '}'],
            data: {
                keyword: '',
                booklist: [],
                alert: {},
                changer: false,
                bookCounts: [],
                booklist: [],
                booklistComplete: [],
                raw_booklist: [],
                newbook:{
                    author: '',
                    bookcover: '',
                    bookname: '',
                    language: '',
                    message: '',
                    price: '',
                    publicationDate: '',
                    publisher: '',
                    series: '',
                    users: ''
                }
            },
            computed: {
                newbook: function(){
                    var self = this;
                    var obj = {};
                    _.each(_.keys(self.raw_booklist[0]), function(key){
                        obj[key] = ''
                    })
                    return obj;
                },
                a: function() {
                    var self = this;
                    var defaultAlert = {
                        type: 'warning', //success, info, warning, danger
                        message: '',
                        close: false
                    }
                    return _.extend({}, defaultAlert, self.alert);
                },
                loading: function() {
                    var self = this;
                    return { in: function() {
                            self.changer = true;
                        },
                        out: function() {
                            self.changer = false;

                        }
                    }
                },
                engine: function() {
                    var self = this;
                    var engine = new Bloodhound({
                        initialize: false, //是否初始化，暂不初始化
                        datumTokenizer: Bloodhound.tokenizers.obj.everyword('bookname'),
                        queryTokenizer: Bloodhound.tokenizers.whitespace,
                        identify: function(obj) { return obj.bookname },
                        local: self.raw_booklist
                    });
                    return engine;
                }
            },
            mounted: function() {
                var self = this;
                self.getBookList();
                self.bindTypeahead();
            },
            methods: {
                bindTypeahead: function() {
                    var self = this;
                    $('#searchWords').typeahead({
                            hint: false,
                            highlight: true,
                            minLength: 0, //最小长度为0的时候就启用搜索
                            classNames: {
                                input: 'form-control',
                                // hint: 'Typeahead-hint',
                                // selectable: 'Typeahead-selectable'
                            }
                        },
                        // {
                        //     name: 'activities',
                        //     display: 'bookname',
                        //     source: self.nflTeamsWithDefaults,
                        //     limit: 1000,
                        //     // templates: {
                        //     //     // header: '<h3>books</h3>',
                        //     //     suggestion: function(){
                        //     //         return '<span></span>'
                        //     //     }
                        //     //   }
                        // }, 
                        {
                            name: 'books',
                            display: 'bookname',
                            source: self.nflTeamsWithDefaults,
                            limit: 1000,
                            templates: {
                                // header: '<h3>books</h3>',
                                suggestion: function() {
                                    return '<span></span>'
                                }
                            }
                        });
                    $('#searchWords').bind('typeahead:render', function(ev) {
                        var args = [];
                        Array.prototype.push.apply(args, arguments);
                        self.booklistComplete = _.rest(args);
                    });

                    $('#searchWords').bind('typeahead:select', function(ev, suggestion) {
                        self.keyword = suggestion.bookname;
                    })
                },
                uploadimg: function() {
                    var self = this;
                    var formData = new FormData();

                    formData.append("user_id", self.keyword);
                    formData.append("bookcover", $('#photo')[0].files[0]);
                    self.loading.in();
                    $.ajax({
                        method: "POST",
                        url: "http://readingkid.us-east-2.elasticbeanstalk.com/api/uploadBookcoverAction",
                        data: formData,
                        processData: false,
                        contentType: false
                    }).always(function(res) {
                        self.loading.out();
                        $('#photo').val('');
                        if (res.flag == 1) {
                            self.alert = {
                                type: 'success',
                                message: res.content + '  ' + res.file_name
                            }
                            $('#photo').val('');
                            self.getBookList();

                        } else {
                            self.alert = {
                                close: true,
                                type: 'danger',
                                message: JSON.stringify(res)
                            }
                        }

                    });
                },
                resetAllBooklist: function() {
                    var self = this;
                    console.log('change')
                    console.log(self.keyword)
                    if (self.keyword == '') {
                        self.booklistComplete = self.raw_booklist;
                    }
                },
                nflTeamsWithDefaults: function(q, sync) {
                    var self = this;
                    if (q === '') {
                        //sync(engine.get('5000', '2', '102165','102166')); 通过id去拿

                        sync(self.engine.all()); //直接拿全部
                    } else {
                        self.engine.search(q, sync); //进行按照搜索
                    }
                },
                getBookList: function(process) {
                    var self = this;
                    self.loading.in();
                    $.ajax({
                        url: "http://readingkid.us-east-2.elasticbeanstalk.com/getBookList",
                        method: 'post',
                        dataType: 'json',
                        context: 'application/json;charset=utf-8',
                        success: function(data) {
                            self.booklistComplete = data;
                            self.raw_booklist = data;
                            var tmp = [];
                            // console.log(data)
                            _.each(data, function(v, k) {
                                tmp.push(v['bookname'])
                            })
                            // console.log(tmp)
                            self.booklist = tmp;
                            if (process) {
                                process(self.booklist);
                            }
                            self.loading.out();

                            var states = self.booklist;

                            // function nflTeamsWithDefaults(q, sync) {
                            //     if (q === '') {
                            //         //sync(engine.get('5000', '2', '102165','102166')); 通过id去拿

                            //         sync(self.engine.all());//直接拿全部
                            //     }
                            //     else {
                            //         self.engine.search(q, sync);//进行按照搜索
                            //     }
                            // }



                            self.engine.clear(); //清空一下初始数据
                            self.engine.local = data; //设置一下local
                            self.engine.initialize(true); //初始化

                        },
                        error: function(data) {
                            self.alert = {
                                close: true,
                                type: 'danger',
                                message: JSON.stringify(data)
                            }
                            self.loading.out();
                        }
                    });
                },
                closeAlert: function() {
                    var self = this;
                    self.alert = {
                        message: ''
                    }
                },
                postPunch: function(index) {
                    var self = this;
                    var bookname = self.recentlyBooks[index];
                    console.log(bookname)
                    for (var i = 0; i < 1; i++) {
                        if (!self.keyword && !bookname) {
                            self.alert = {
                                message: '请输入书名'
                            }
                            break;
                        }
                        if (!bookname && !self.keyword) {
                            self.alert = {
                                message: 'RecentlyBook 书名无效'
                            }
                            break;
                        }
                        self.loading.in();
                        $.ajax({
                            url: "http://readingkid.us-east-2.elasticbeanstalk.com/punch",
                            method: 'post',
                            dataType: 'json',
                            data: {
                                searchWords: bookname ? bookname : self.keyword,
                                count: self.bookCounts[index]
                            },
                            context: 'application/json;charset=utf-8',
                            success: function(data) {
                                console.log(data)
                                self.loading.out();
                                if (data.success) {
                                    self.keyword = '';
                                    self.alert = {
                                        type: 'success',
                                        message: 'bookid: ' + data.result.book_id + '  bookname: ' + data.result.book_name + '  count: ' + data.result.count
                                    }
                                    self.getBookList();
                                } else {
                                    self.alert = {
                                        close: true,
                                        message: data.resultMassage
                                    }
                                }
                            },
                            error: function(data) {
                                self.alert = {
                                    close: true,
                                    type: 'danger',
                                    message: JSON.stringify(data)
                                }
                                self.loading.out();
                            }
                        });
                    }

                },
            }
        })
    })