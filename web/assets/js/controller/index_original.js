alert('index_original')
function editEvent(event) {
    $('#event-modal input[name="event-index"]').val(event ? event.id : '');
    $('#event-modal input[name="event-name"]').val(event ? event.name : '');
    $('#event-modal input[name="event-location"]').val(event ? event.location : '');
    $('#event-modal input[name="event-start-date"]').datepicker('update', event ? event.startDate : '');
    $('#event-modal input[name="event-end-date"]').datepicker('update', event ? event.endDate : '');
    $('#event-modal').modal();
}

function deleteEvent(event) {
    var dataSource = $('#calendar').data('calendar').getDataSource();

    for(var i in dataSource) {
        if(dataSource[i].id == event.id) {
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
        location: $('#event-modal input[name="event-location"]').val(),
        startDate: $('#event-modal input[name="event-start-date"]').datepicker('getDate'),
        endDate: $('#event-modal input[name="event-end-date"]').datepicker('getDate'),
    }
    
    var dataSource = $('#calendar').data('calendar').getDataSource();

    if(event.id) {
        for(var i in dataSource) {
            if(dataSource[i].id == event.id) {
                dataSource[i].name = event.name;
                dataSource[i].location = event.location;
                dataSource[i].startDate = event.startDate;
                dataSource[i].endDate = event.endDate;
            }
        }
    }
    else
    {
        var newId = 0;
        for(var i in dataSource) {
            if(dataSource[i].id > newId) {
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

$(function() {
    $.ajax({
        url: "http://127.0.0.1:8099/getBookList",
        method: 'post',
        context: document.body,
        success: function(){
            $(this).addClass("done");
            }
        });
    var datasource = [];
    $.ajax({
        url: "http://127.0.0.1:8099/getPunchList",
        method: 'post',
        dataType: 'json',
        context: 'application/json;charset=utf-8',
        success: function(data){
            console.log(data);
            _.each(data, function(v,k){
                var tmp = new Date(v.punchDatetime);
                datasource.push({
                    id: k,
                    name: v.bookname,
                    location: 'San Francisco, CA',
                    startDate: new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate()),
                    endDate: new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate()),
                    color: '#FF858A'
                })
            });
            // var currentYear = new Date().getFullYear();
            // datasource = [
            // {
            //     id: 0,
            //     name: 'Google I/O',
            //     location: 'San Francisco, CA',
            //     startDate: new Date(currentYear, 4, 28),
            //     endDate: new Date(currentYear, 4, 29),
            //     color: '#FF858A'
            // },
            // {
            //     id: 1,
            //     name: 'Microsoft Convergence',
            //     location: 'New Orleans, LA',
            //     startDate: new Date(currentYear, 2, 16),
            //     endDate: new Date(currentYear, 2, 19),
            //     color: '#F6CAC9'
            // },
            // {
            //     id: 2,
            //     name: 'Microsoft Build Developer Conference',
            //     location: 'San Francisco, CA',
            //     startDate: new Date(currentYear, 3, 29),
            //     endDate: new Date(currentYear, 4, 1),
            //     color: '#FF858A'
            // },
            // {
            //     id: 3,
            //     name: 'Apple Special Event',
            //     location: 'San Francisco, CA',
            //     startDate: new Date(currentYear, 8, 1),
            //     endDate: new Date(currentYear, 8, 1),
            //     color: '#FFF3A7'
            // },
            // {
            //     id: 4,
            //     name: 'Apple Keynote',
            //     location: 'San Francisco, CA',
            //     startDate: new Date(currentYear, 8, 9),
            //     endDate: new Date(currentYear, 8, 9),
            //     color: '#F6CAC9'

            // },
            // {
            //     id: 5,
            //     name: 'Chrome Developer Summit',
            //     location: 'Mountain View, CA',
            //     startDate: new Date(currentYear, 10, 17),
            //     endDate: new Date(currentYear, 10, 18),
            //     color: '#F72464'

            // },
            // {
            //     id: 6,
            //     name: 'F8 2015',
            //     location: 'San Francisco, CA',
            //     startDate: new Date(currentYear, 2, 25),
            //     endDate: new Date(currentYear, 2, 26),
            //     color: '#F6CAC9'

            // },
            // {
            //     id: 7,
            //     name: 'Yahoo Mobile Developer Conference',
            //     location: 'New York',
            //     startDate: new Date(currentYear, 7, 25),
            //     endDate: new Date(currentYear, 7, 26),
            //     color: '#FFF3A7'
            // },
            // {
            //     id: 8,
            //     name: 'Android Developer Conference',
            //     location: 'Santa Clara, CA',
            //     startDate: new Date(currentYear, 11, 1),
            //     endDate: new Date(currentYear, 11, 4),
            //     color: '#F72464'

            // },
            // {
            //     id: 9,
            //     name: 'LA Tech Summit',
            //     location: 'Los Angeles, CA',
            //     startDate: new Date(currentYear, 10, 17),
            //     endDate: new Date(currentYear, 10, 17),
            //     color: '#FFF3A7'

            // },
            // {
            //     id: 10,
            //     name: 'test',
            //     location: 'xx',
            //     startDate: new Date('2018-1-1'),
            //     endDate: new Date('2018-1-1'),
            //     color: '#F6CAC9'
            // }
        // ]
            console.log(datasource)
            renderCalendar();
        }
    });


function renderCalendar(){
   var currentYear = new Date().getFullYear();
    $('#calendar').calendar({
        style: 'background',
        allowOverlap: false,
        enableContextMenu: true,
        enableRangeSelection: true,
        contextMenuItems:[
            {
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
            if(e.events.length > 0) {
                var content = '';
                
                for(var i in e.events) {
                    content += '<div class="event-tooltip-content">'
                                    + '<div class="event-name" style="color:' + e.events[i].color + '">' + e.events[i].name + '</div>'
                                    + '<div class="event-location">' + e.events[i].location + '</div>'
                                + '</div>';
                }
            
                $(e.element).popover({ 
                    trigger: 'manual',
                    container: 'body',
                    html:true,
                    content: content,
                    placement: 'bottom'
                });
                
                $(e.element).popover('show');
            }
        },
        mouseOutDay: function(e) {
            if(e.events.length > 0) {
                $(e.element).popover('hide');
            }
        },
        dayContextMenu: function(e) {
            $(e.element).popover('hide');
        },
        dataSource: datasource
    });

    $('#save-event').click(function() {
        saveEvent();
    }); 
}

    
});