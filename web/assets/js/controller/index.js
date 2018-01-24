require(['moment','$', 'bootstrap', 'popover', 'bootstrap-year-calendar', 'bootstrap-datepicker', 'underscore', 'bootstrap3-typeahead','vue'], 
    function(moment){
    var colors = ['#FFF4C9', '#C7E78B', '#81AE64', '#709053', '#FFBBE1', '#FC7FB6', '#DD356E', '#B80257'];
    var delimiter = 2;
    function editEvent(event) {
        $('#event-modal input[name="event-index"]').val(event ? event.id : '');
        $('#event-modal input[name="event-name"]').val(event ? event.name : '');
        $('#event-modal input[name="event-count"]').val(event ? event.count : '');
        $('#event-modal input[name="event-start-date"]').datepicker('update', event ? event.startDate : '');
        $('#event-modal input[name="event-end-date"]').datepicker('update', event ? event.endDate : '');
        $('#event-modal').modal();
    }

    function deleteEvent(event) {
        var dataSource = $('#calendar').data('calendar').getDataSource();

        for (var i in dataSource) {
            if (dataSource[i].id == event.id) {
                dataSource.splice(i, 1);
                break;
            }
        }

        $('#calendar').data('calendar').setDataSource(dataSource);
    }

    function saveEvent() {
        var event = {
            id: $('#event-modal input[name="event-index"]').val(),
            name: $('#event-modal input[name="event-name"]').val(),
            count: $('#event-modal input[name="event-count"]').val(),
            startDate: $('#event-modal input[name="event-start-date"]').datepicker('getDate'),
            endDate: $('#event-modal input[name="event-end-date"]').datepicker('getDate'),
        }
        var dataSource = $('#calendar').data('calendar').getDataSource();
        alert(JSON.stringify(dataSource))
        if (event.id) {
            for (var i in dataSource) {
                if (dataSource[i].id == event.id) {
                    dataSource[i].name = event.name;
                    dataSource[i].count = event.count;
                    dataSource[i].startDate = event.startDate;
                    dataSource[i].endDate = event.endDate;
                }
            }
        } else {
            var newId = 0;
            for (var i in dataSource) {
                if (dataSource[i].id > newId) {
                    newId = dataSource[i].id;
                }
            }

            newId++;
            event.id = newId;
            dataSource.push(event);
        }

        $('#calendar').data('calendar').setDataSource(dataSource);
        $('#event-modal').modal('hide');
    }

        var currentYear = new Date().getFullYear();

    var datasource = [];
    var newdatasource = [];
    $.ajax({
        url: "http://readingkid.us-east-2.elasticbeanstalk.com/getPunchList",
        method: 'post',
        dataType: 'json',
        context: 'application/json;charset=utf-8',
        success: function(data) {
            console.log(data);
            _.each(data, function(v, k) {
                // var tmp = new Date(v.punchDatetime);
                var tmp = moment(v.punchDatetime);
                datasource.push({
                    id: k,
                    name: v.bookname,
                    count: parseInt(v.count),
                    startDate: new Date(tmp.year(), tmp.month(), tmp.date()),
                    endDate: new Date(tmp.year(), tmp.month(), tmp.date()),
                    color: 'red'
                })
            });
            var tmp2 = _.groupBy(datasource, 'startDate')
            
            var curindex = 0;
            var groupIndexStart;
            var groupIndexEnd;
            _.each(tmp2, function(dateitem, k1){
                var group = _.groupBy(dateitem, function(bookitem, k3){
                    return bookitem.name;
                });
                var daycount = 0;
                groupIndexStart = newdatasource.length; //打卡记录按日分段的起始index
                _.each(group, function(item, k4){
                    
                    _.each(item, function(i, k5){
                        //合计一天的打卡量daycount
                      if(k5 == 0) {
                          newdatasource.push(i);
                          curindex = newdatasource.length-1;
                          daycount += i.count;
                      } else {
                        newdatasource[curindex].count += i.count;
                        daycount += i.count;
                      }
                  })
                    
                    
                })
                groupIndexEnd = newdatasource.length;//打卡记录按日分段的结束index
                //修改每项打卡记录的color值
                for(var i = groupIndexStart; i < groupIndexEnd; i++) {
                    newdatasource[i].color = colors[Math.floor(daycount/delimiter)];
                }
            })
            renderCalendar();
        }
    });


    function renderCalendar() {
        var currentYear = new Date().getFullYear();
        $('#calendar').calendar({
            style: 'background',
            allowOverlap: false,
            enableContextMenu: true,
            enableRangeSelection: true,
            contextMenuItems: [{
                    text: 'Update',
                    click: editEvent
                },
                {
                    text: 'Delete',
                    click: deleteEvent
                }
            ],
            selectRange: function(e) {
                editEvent({ startDate: e.startDate, endDate: e.endDate });
            },
            mouseOnDay: function(e) {
                if (e.events.length > 0) {
                    var content = '';

                    for (var i in e.events) {
                        content += '<div class="event-tooltip-content">' +
                            '<div class="event-name" style="color:' + e.events[i].color + '">' + e.events[i].name + '</div>' +
                            '<div class="event-count">' + e.events[i].count + '</div>' +
                            '</div>';
                    }

                    $(e.element).popover({
                        trigger: 'manual',
                        container: 'body',
                        html: true,
                        content: content,
                        placement: 'bottom'
                    });

                    $(e.element).popover('show');
                }
            },
            mouseOutDay: function(e) {
                if (e.events.length > 0) {
                    $(e.element).popover('hide');
                }
            },
            dayContextMenu: function(e) {
                $(e.element).popover('hide');
            },
            dataSource: newdatasource
        });

        $('#save-event').click(function() {
            saveEvent();
        });
    }


})
