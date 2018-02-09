require(['vue', 'bloodhound', 'text!activitiesTemplate','text!booksTemplate','$', 'bootstrap', 'popover', 'bootstrap-year-calendar', 'bootstrap-datepicker',
        'underscore', 'typeahead','bootstrap-select'
    ],
    function(Vue, Bloodhound, activitiesTpl, booksTpl) {
        // var getChildrenTextC ontent = function (children) {
        //   return children.map(function (node) {
        //     return node.children
        //       ? getChildrenTextContent(node.children)
        //       : node.text
        //   }).join('')
        // }

        // console.log(booksTpl)
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
         // console.log(_.template(activitiesTpl)())



        Vue.component('activitiestpl', {
            delimiters: ['${', '}'],
            template : _.template(activitiesTpl)(),
            props: {
                activitylistcomplete: {
                    type: Array,
                    required: true,
                    default: function(){
                        return []
                    }
                }

            },
            methods: {
                cemitter: function (activity){
                    this.$emit('chandler', activity)
                },
                cemitter2: function (activity){
                    this.$emit('chandler2', activity.id)
                },
                cemitter3: function (index){
                    this.$emit('chandler3', index)
                }
            }
        
        })

        Vue.component('bookstpl', {
            delimiters: ['${', '}'],
            template : _.template(booksTpl)(),
            props: {
                booklistcomplete: {
                    type: Array,
                    required: true,
                    default: function(){
                        return []
                    }
                },
                showbookimage2: {
                    type: Boolean,
                    required: false,
                    default: false
                }
                
            },
            methods: {
                cemitter: function(book){
                    this.$emit('chandler', book);
                },
                cemitter2: function(){
                    this.$emit('chandler2');
                },
            }
        
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
                activitylist: [],
                activitylistComplete: [],
                raw_activitylist: [],
                activeTab:{
                    all: true,
                    books: false,
                    activities: false
                },
                activityFigures: [],
                newactivity:{
                    id: '',
                    title: '',
                    place: '',
                    figures: [],
                    type: '',
                    subtype: '',
                    content: '',
                    duration: '',
                    target: '',
                    target_name: '',
                    book_lidou: '',
                    book_lidou_name: '',
                    extension_activity: '',
                    assessment: ''
                },
                targetList: [],
                showBookImage: false
            },
            computed: {
                newbook: function(){
                    var self = this;
                    var obj = {};
                    _.each(_.keys(self.raw_booklist[0]), function(key){
                        obj[key] = ''
                    })
                    obj['seriesArray'] = [];
                    // console.log(obj)
                    return obj;
                },
                tabs:function(){
                    var self = this;
                    return _.keys(self.activeTab);
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
                },
                engineActivity: function() {
                    var self = this;
                    var engine = new Bloodhound({
                        initialize: false, //是否初始化，暂不初始化
                        datumTokenizer: Bloodhound.tokenizers.obj.everyword('fulltext'),
                        queryTokenizer: Bloodhound.tokenizers.whitespace,
                        identify: function(obj) { return obj.id },
                        local: self.raw_activitylist
                    });
                    return engine;
                }
            },
            mounted: function() {
                var self = this;
                self.getActivityFiguresList().done(function(){
                    self.getActivityList();
                });
                self.getBookList();
                self.getTargetList();
                self.bindTypeahead();
                self.switchTab(location.hash.replace('#', ''));


            },
            updated: function(){
                var self = this;
                $('.selectpicker').selectpicker('refresh');
            },
            methods: {
                getUrlParam : function (name,path) {
                    if(!path){
                        path = location.search;
                    }
                    var re = new RegExp("(\\?|&)" + name + "=([^&]+)(&|$)", "i"), m = path.match(re);
                    return m ? decodeURIComponent(m[2]) : "";
                },
                switchTab: function(tab){
                    var self = this;
                    // console.log(tab)
                    if(!tab) {
                        tab = 'all';
                    }
                    _.each(self.activeTab, function(tab, index){
                        self.activeTab[index] = false;
                    })
                    Vue.set(self.activeTab, tab, true);
                },
                saveOrUpdateActivity: function(newactivity){
                    var self = this;
                    // console.log(newactivity)
                    self.loading.in();


                    var formData = new FormData();

                    formData.append("title", newactivity.title);
                    formData.append("place", newactivity.place);
                    formData.append("type", newactivity.type);
                    formData.append("subtype", newactivity.subtype);
                    formData.append("content", newactivity.content);
                    formData.append("duration", newactivity.duration);
                    formData.append("target", newactivity.target);
                    formData.append("book_lidou", newactivity.book_lidou);
                    formData.append("extension_activity", newactivity.extension_activity);
                    formData.append("assessment", newactivity.assessment);
                    formData.append("bookcover", $('#figures1')[0].files[0]);
                    if(newactivity.id) {
                        formData.append("id", newactivity.id);
                        self.postUpdateActivityAction(formData).done(function(activityId){
                            self.getActivityFiguresListById(activityId).done(function(){
                                self.getActivityListById(activityId);
                            });
                        });
                    } else {
                        self.postSaveNewActivityAction(formData).done(function(activityId){
                            self.getActivityFiguresListById(activityId).done(function(){
                                self.getActivityListById(activityId);
                            });
                        });
                    }
                    
                },
                showBookImageHandler: function(){
                    this.showBookImage = true;
                },
                getTargetList: function(){

                    var self = this;
                    self.loading.in();
                    $.ajax({
                        url: "http://readingkid.us-east-2.elasticbeanstalk.com/getTargetList",
                        // url: "http://127.0.0.1:8099/getTargetList",
                        method: 'post',
                        dataType: 'json',
                        context: 'application/json;charset=utf-8',
                        success: function(data) {
                            // console.log(data)
                            // var majors = _.groupBy(data, 'major_name');
                            // var tmp = [];
                            // _.each(majors, function(major){
                            //     tmp.push(_.groupBy(major, 'sub_name'));
                            // })
                            // console.log(_.flatten(tmp))
                            self.targetList = data;

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
                        if(!bookname && !self.keyword) {
                            self.alert = {
                                message: 'RecentlyBook 书名无效'
                            }
                            break;
                        }
                        self.loading.in();
                        $.ajax({
                            url: "http://readingkid.us-east-2.elasticbeanstalk.com/punchActivity",
                            method: 'post',
                            dataType: 'json',
                            data: {
                                searchWords: bookname? bookname : self.keyword,
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
                                        message: 'bookid: ' + data.result.book_id + '  bookname: ' + data.result.book_name+ '  count: ' + data.result.count
                                    }
                                    self.getRecentlyBooks();
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
                showActivityImage: function(index){
                    this.activitylistComplete[index].showimage = true;
                    console.log()
                },
                postUpdateActivityAction: function(formData){

                    var self = this;
                    var deferred = $.Deferred();
                    $.ajax({
                            url: "http://readingkid.us-east-2.elasticbeanstalk.com/api/updateActivityAction",
                            // url: "http://127.0.0.1:8099/api/updateActivityAction",
                            method: 'post',
                            dataType: 'json',
                            data: formData,
                            processData: false,
                            contentType: false,
                            // context: 'application/json;charset=utf-8',
                            success: function(data) {
                                self.loading.out();
                                $('#figures1').val('');
                                if (data.code == 1) {
                                    self.alert = {
                                        type: 'success',
                                        message: data.resMessage + JSON.stringify(data.result)
                                    }
                                    deferred.resolve(data.result.id);
                                    $('#activityModal').modal('hide');
                                } else {
                                    self.alert = {
                                        close: true,
                                        message: data.resMessage
                                    }
                                    deferred.reject();
                                }
                            },
                            error: function(data) {
                                self.loading.out();
                                self.alert = {
                                    close: true,
                                    type: 'danger',
                                    message: JSON.stringify(data)
                                }
                                deferred.reject();
                            }
                        });
                    return deferred.promise();
                },
                postSaveNewActivityAction: function(formData){

                    var self = this;
                    var deferred = $.Deferred();
                    $.ajax({
                            url: "http://readingkid.us-east-2.elasticbeanstalk.com/api/saveNewActivityAction",
                            // url: "http://127.0.0.1:8099/api/saveNewActivityAction",
                            method: 'post',
                            dataType: 'json',
                            data: formData,
                            processData: false,
                            contentType: false,
                            // context: 'application/json;charset=utf-8',
                            success: function(data) {
                                self.loading.out();
                                $('#figures1').val('');
                                if (data.code == 1) {
                                    self.alert = {
                                        type: 'success',
                                        message: data.resMessage + JSON.stringify(data.result)
                                    }
                                    alert(data.result.id)
                                    deferred.resolve(data.result.id);
                                    $('#activityModal').modal('hide');
                                } else {
                                    self.alert = {
                                        close: true,
                                        message: data.resMessage
                                    }
                                    deferred.reject();
                                }
                            },
                            error: function(data) {
                                self.loading.out();
                                self.alert = {
                                    close: true,
                                    type: 'danger',
                                    message: JSON.stringify(data)
                                }
                                deferred.reject();
                            }
                        });
                    return deferred.promise();
                },
                addActivity: function(){
                    var self = this;
                    
                    Vue.set(self.newactivity, 'id','');
                    Vue.set(self.newactivity, 'title','');
                    Vue.set(self.newactivity, 'content','');
                    Vue.set(self.newactivity, 'duration','');
                    Vue.set(self.newactivity, 'target','');
                    Vue.set(self.newactivity, 'book_lidou','');
                    Vue.set(self.newactivity, 'extension_activity','');
                    Vue.set(self.newactivity, 'assessment','');
                    $('#activityModal').modal('show');
                },
                updateActivityById: function(activity){
                    var self = this;
                    
                    Vue.set(self.newactivity, 'id', activity.id);
                    Vue.set(self.newactivity, 'title', activity.title);
                    Vue.set(self.newactivity, 'content', activity.content);
                    Vue.set(self.newactivity, 'duration', activity.duration);
                    Vue.set(self.newactivity, 'target', activity.target);
                    Vue.set(self.newactivity, 'book_lidou', activity.book_lidou);
                    Vue.set(self.newactivity, 'extension_activity', activity.extension_activity);
                    Vue.set(self.newactivity, 'assessment', activity.assessment);
                    $('#activityModal').modal('show');

                },
                savechanges: function(){

                    var self = this;
                    // console.log(self.newbook)
                    self.loading.in();
                    $.ajax({
                        url: "http://readingkid.us-east-2.elasticbeanstalk.com/api/saveNewBookAction",
                        // url: "http://127.0.0.1:8099/api/saveNewBookAction",
                        method: 'post',
                        dataType: 'json',
                        data: self.newbook,
                        context: 'application/json;charset=utf-8',
                        success: function(data) {
                            self.loading.out();
                            if (data.code == 1) {
                                self.alert = {
                                    type: 'success',
                                    message: data.resMessage + JSON.stringify(data.result)
                                }
                                self.getBookList();
                            } else {
                                self.alert = {
                                    close: true,
                                    message: data.resMessage
                                }
                            }
                        },
                        error: function(data) {
                            self.loading.out();
                            self.alert = {
                                close: true,
                                type: 'danger',
                                message: JSON.stringify(data)
                            }
                        }
                    });
                },
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
                        {
                            name: 'activities',
                            display: 'content',
                            source: self.nflTeamsWithDefaultsActivity,
                            limit: 1000,
                            templates: {
                                // header: '<h3>books</h3>',
                                suggestion: function(){
                                    return '<span></span>'
                                }
                              }
                        }, 
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
                        // console.log(args)
                        var rest = _.rest(args);//去掉第一个参数ev
                        if(!_.isEmpty(rest)) {
                            if(_.has(rest[0], 'extension_activity')) {
                                self.activitylistComplete = rest;
                                // console.log('====')
                                // console.log(self.activitylistComplete)
                            }
                            if(_.has(rest[0], 'bookname')) {
                                self.booklistComplete = rest;
                            }
                        }
                        
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
                        // url: "http://127.0.0.1:8099/api/uploadBookcoverAction",
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
                uploadimg2: function(book) {
                    var self = this;
                    var formData = new FormData();
                    console.log(book.bookname);
                    formData.append("user_id", book.bookname);
                    formData.append("bookcover", $('#photo')[0].files[0]);
                    self.loading.in();
                    $.ajax({
                        method: "POST",
                        url: "http://readingkid.us-east-2.elasticbeanstalk.com/api/uploadBookcoverAction",
                        // url: "http://127.0.0.1:8099/api/uploadBookcoverAction",
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
                nflTeamsWithDefaults: function(q, sync) {
                    var self = this;
                    if (q === '') {
                        //sync(engine.get('5000', '2', '102165','102166')); 通过id去拿

                        sync(self.engine.all()); //直接拿全部
                    } else {
                        self.engine.search(q, sync); //进行按照搜索
                    }
                },
                nflTeamsWithDefaultsActivity: function(q, sync) {
                    var self = this;
                    if (q === '') {
                        //sync(engine.get('5000', '2', '102165','102166')); 通过id去拿

                        sync(self.engineActivity.all()); //直接拿全部
                    } else {
                        self.engineActivity.search(q, sync); //进行按照搜索
                    }
                },
                getBookList: function(process) {
                    var self = this;
                    self.loading.in();
                    $.ajax({
                        url: "http://readingkid.us-east-2.elasticbeanstalk.com/getBookList",
                        // url: "http://127.0.0.1:8099/getBookList",
                        method: 'post',
                        dataType: 'json',
                        context: 'application/json;charset=utf-8',
                        success: function(data) {

                            $('#searchWords_book_lidou').typeahead({
                                    hint: false,
                                    highlight: true,
                                    minLength: 0, //最小长度为0的时候就启用搜索
                                    classNames: {
                                        input: 'form-control',
                                        menu: 'cust-menu'
                                        // hint: 'Typeahead-hint',
                                        // selectable: 'Typeahead-selectable'
                                    }
                                },
                                {
                                    name: 'books',
                                    display: 'bookname',
                                    source: self.nflTeamsWithDefaults,
                                    limit: 1000,
                                    // templates: {
                                    //     // header: '<h3>books</h3>',
                                    //     suggestion: function() {
                                    //         return '<span></span>'
                                    //     }
                                    // }
                                });
                            $('#searchWords_book_lidou').bind('typeahead:select', function(ev, suggestion) {
                                // console.log(suggestion)
                                // console.log(self.newactivity)
                                Vue.set(self.newactivity, 'book_lidou', suggestion.id);
                            })
                            
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
                getActivityFiguresList: function(process) {
                    var deferred = $.Deferred();
                    var self = this;
                    self.loading.in();
                    $.ajax({
                        url: "http://readingkid.us-east-2.elasticbeanstalk.com/getActivityFiguresList",
                        // url: "http://127.0.0.1:8099/getActivityFiguresList",
                        method: 'post',
                        dataType: 'json',
                        context: 'application/json;charset=utf-8',
                        success: function(data) {
                            // console.log(data)
                            self.activityFigures = data;
                            // self.getActivityList();
                            deferred.resolve();
                        },
                        error: function(data) {
                            self.alert = {
                                close: true,
                                type: 'danger',
                                message: JSON.stringify(data)
                            }
                            self.loading.out();
                            deferred.reject();
                        }
                    });
                    return deferred.promise();
                },
                getActivityFiguresListById: function(activityId) {
                    var deferred = $.Deferred();
                    var self = this;
                    self.loading.in();
                    $.ajax({
                        url: "http://readingkid.us-east-2.elasticbeanstalk.com/getActivityFiguresListById",
                        // url: "http://127.0.0.1:8099/getActivityFiguresListById",
                        method: 'post',
                        dataType: 'json',
                        data: {
                            activityId: activityId
                        },
                        context: 'application/json;charset=utf-8',
                        success: function(data) {
                            // console.log(data)
                            self.activityFigures = data;
                            // self.getActivityList();
                            deferred.resolve();
                        },
                        error: function(data) {
                            self.alert = {
                                close: true,
                                type: 'danger',
                                message: JSON.stringify(data)
                            }
                            self.loading.out();
                            deferred.reject();
                        }
                    });
                    return deferred.promise();
                },
                getActivityList: function() {
                    var self = this;
                    self.loading.in();
                    $.ajax({
                        url: "http://readingkid.us-east-2.elasticbeanstalk.com/getActivityList",
                        // url: "http://127.0.0.1:8099/getActivityList",
                        method: 'post',
                        dataType: 'json',
                        context: 'application/json;charset=utf-8',
                        success: function(data) {
                            self.loading.out();

                            // console.log(data)
                            // console.log(_.findlastIndex)
                            var data_fulltext = [];
                            var activityFigures = self.activityFigures;
                            
                            _.each(data, function(item, index){
                                var fulltext = '';
                                _.each(item, function(i, k){
                                    if(k == 'title' || k == 'book_lidou_name' || k =='content') {
                                     fulltext += i;
                                    }
                                })
                                var index = '';
                                var figures = [];
                                while((index = _.findIndex(activityFigures, {
                                    activity_id: item['id']
                                })) != '-1') {
                                    // console.log(index)
                                    // console.log(activityFigures.splice(index, 1))
                                    figures.push(activityFigures.splice(index, 1));
                                }
                                
                                data_fulltext.push(_.extend(item, {
                                    fulltext: fulltext,
                                    figures: _.flatten(figures),
                                    showimage: false
                                }))
                            })
                            
                            self.activitylist = data_fulltext;
                            self.activitylistComplete = data_fulltext;
                            self.raw_activitylist = data_fulltext;
                        
                            // console.log(data_fulltext)
                            self.engineActivity.clear(); //清空一下初始数据
                            self.engineActivity.local = data_fulltext; //设置一下local
                            console.log('=== a ====')
                            console.time('a')
                            self.engineActivity.initialize(true); //初始化
                            console.timeEnd('a')

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
                getActivityListById: function(activityId) {
                    var self = this;
                    self.loading.in();
                    $.ajax({
                        url: "http://readingkid.us-east-2.elasticbeanstalk.com/getActivityListById",
                        // url: "http://127.0.0.1:8099/getActivityListById",
                        method: 'post',
                        dataType: 'json',
                        data: {
                                activityId: activityId
                            },
                        context: 'application/json;charset=utf-8',
                        success: function(data) {
                            self.loading.out();

                            var figures = [];
                                while((index = _.findIndex(self.activityFigures, {
                                    activity_id: activityId
                                })) != '-1') {
                                    figures.push(self.activityFigures.splice(index, 1));
                                }

                            self.activitylistComplete = [_.extend(data[0], {
                                    figures: _.flatten(figures)
                                })];
                            console.log(self.activitylistComplete)
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
                postPunch: function(activityId) {

                    var self = this;
                    for (var i = 0; i < 1; i++) {
                       
                        self.loading.in();
                        $.ajax({
                            url: "http://readingkid.us-east-2.elasticbeanstalk.com/punchActivity",
                            // url: "http://127.0.0.1:8099/punch",
                            method: 'post',
                            dataType: 'json',
                            data: {
                                activityId: activityId,
                                count: 1,
                                type: 2
                            },
                            context: 'application/json;charset=utf-8',
                            success: function(data) {
                                // console.log(data)
                                self.loading.out();
                                if (data.success) {
                                    self.keyword = '';
                                    self.alert = {
                                        type: 'success',
                                        message: JSON.stringify(data)
                                    }
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