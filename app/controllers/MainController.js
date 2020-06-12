app.controller('MainController', ($scope, $interval, $filter, $mdDialog) => {

    /*variable declaration*/
    $scope.eventList = [];
    $scope.selectedDay = "Un";
    $scope.todayEventList = [];
    $scope.setEditEventId = -0;
    $scope.setEditEventName = "";
    $scope.setEditEventDate = "";
    $scope.setEditEventDateToinput = "";
    $scope.setEditEventTime = "12/00";
    let promise1, upcomingEvent;
    $scope.inEventName;
    $scope.inEventTime ;
    $scope.date;

    /*By this function we can add event to Event List
    * Validations Are Provided
    * IF Values Are Empty User Can not Add Events*/
    $scope.addEvent = () => {
        if($scope.inEventName == undefined|| $scope.inEventName == ""|| $scope.inEventName == null|| $scope.inEventTime == undefined|| $scope.inEventTime == ""){
            $scope.openOffscreen("Please Fill The Details Correctly!", "You Can not Add Empty Values.");
        }
        else {
            $scope.eventList.push({
                id: Date.now(),
                eventName: $scope.inEventName,
                eventDate: $scope.date,
                eventTime: $scope.inEventTime
            })

            $scope.SelectDate();
            $scope.openOffscreen("New Event Added To : " + $scope.date, "Event Name : " + $scope.inEventName + ", Event Time : " + $scope.inEventTime);
        }

        $scope.inEventName = "";
        $scope.inEventTime = "";
    }


    /*
    * First Of All User Have To Select the Date from the calender
    * If IT A Past Date User Can not Add events (Adding option Disable)
    * If User Add A Valid Date Event Adding Option will be Show*/
    $scope.SelectDate = () => {
        $scope.date = $filter('date')($scope.calDate, 'longDate');
        if ($scope.date == "" || $scope.date == null || $scope.date == undefined) {
            alert("Please Select A Date!");
        } else {

            $scope.todayEventList = [];
            let allEventList = $scope.eventList;
            $scope.selectedDay = $scope.date;

            allEventList.map(event => {
                if (event.eventDate == $scope.date){

                    $scope.todayEventList.push(event);
                }
            })
            $scope.stop(promise1);
            $scope.showCounter();
        }

    }

    /*Delete the Event From The List
    * Before Delete an event user have to confirm it*/
    $scope.deleteEvent = (id) => {
        $scope.eventList = $scope.eventList.filter(event => event.id !== id);
        $scope.SelectDate();
    }

    /*In Edit Also User Should Fill All the Details Otherwise it will Show an error*/
    $scope.editEvent = () => {
        let expiaryDate = new Date($filter('date')($scope.setEditEventDateToinput, 'longDate') + ", " + $scope.setEditEventTime).getTime() / 1000;
        let nTime = Math.floor(Date.now() / 1000);
        let remaining = expiaryDate - nTime;

        if (remaining <= 0) {
            $scope.openOffscreen("Please Select Correct Date!", "You Can not Add Events To Past.");
        }

        else if ($scope.setEditEventName == "" || $scope.setEditEventDateToinput == "" || $scope.setEditEventDateToinput == null || $scope.setEditEventTime == "") {
            $scope.openOffscreen("Please Fill The Details Correctly!", "You Can not Add Empty Values.");
        } else {
            $scope.eventList = $scope.eventList.filter(event => event.id !== $scope.setEditEventId);
            $scope.eventList.push({
                id: $scope.setEditEventId,
                eventName: $scope.setEditEventName,
                eventDate: $filter('date')($scope.setEditEventDateToinput, 'longDate'),
                eventTime: $scope.setEditEventTime
            });

            $scope.SelectDate();
            $scope.openOffscreen("Event Updated, New Values As Follows,", "Event Name : " + $scope.setEditEventName + ", Event Date : " + $filter('date')($scope.setEditEventDateToinput, 'longDate') + ", Event Time  : " + $scope.setEditEventTime);
        }
    }

    /*By this values of selected day set to the popup modal*/
    $scope.setEditEventByEvent = (event) => {
        $scope.setEditEventId = event.id;
        $scope.setEditEventName = event.eventName;
        $scope.setEditEventTime = event.eventTime;
        $scope.setEditEventDateToinput =  new Date(event.eventDate);
    }

    /*we can get the Selected day Event Count from this
    * User can see the event only If Selected day Event Count > 0 */
    $scope.getSelectedDayEventCount = () => {
        let count = 0;
        $scope.eventList.map(event => {
            if (event.eventDate == $scope.date) {
                ++count;
            }
        })

        return count;
    }

    /*This method will return the next event on the event List*/
    $scope.getNextEvent = () => {
        let nextEvent = $scope.eventList.reduce((prev, curr) =>
            new Date(prev.date + ", " + prev.time).getTime() < new Date(curr.date + ", " + curr.time).getTime() ? prev : curr
        );
        return nextEvent;
    }

    /*This method check the selected day is valid day in future
    * It will show the add button to the user only if day is valid*/
    $scope.isShowAddButton = () =>{
        let curDate = $filter('date')($scope.date, 'shortDate');
        let expiaryDate = new Date( curDate + ", " + "11:59 PM").getTime() / 1000;
        let nTime = Math.floor(Date.now() / 1000);
        let remaining = expiaryDate - nTime;

        remaining = expiaryDate - nTime;

        if (remaining > 0) {
            return true;
        } else {
            return false;
        }
    }

    /*By this we can stop the interval function when changing the upcoming event*/
    $scope.stop = function (promise) {
        $interval.cancel(promise);
    };

    /*
    * this method use to show the remaining time of an event */
    $scope.showCounter = () => {

            if($scope.eventList.length > 0){
                upcomingEvent = $scope.getNextEvent();
                $scope.NextEventName = upcomingEvent.eventName;
                $scope.NextEventDate = upcomingEvent.eventDate;
                $scope.NextEventTime = upcomingEvent.eventTime;

                promise1 = $interval(function () {

                    let expiaryDate = new Date(upcomingEvent.eventDate + ", " + upcomingEvent.eventTime).getTime() / 1000;
                    let nTime = Math.floor(Date.now() / 1000);
                    let remaining = expiaryDate - nTime;
                    $scope.rDays = parseInt(remaining / 60 / 60 / 24);
                    $scope.rHours = parseInt(
                        (remaining - $scope.rDays * 60 * 60 * 24) / 60 / 60
                    );
                    $scope.rMinutes = parseInt(
                        (remaining - $scope.rDays * 60 * 60 * 24 - $scope.rHours * 60 * 60) / 60
                    );
                    $scope.rSeconds = parseInt(
                        remaining -
                        $scope.rDays * 60 * 60 * 24 -
                        $scope.rHours * 60 * 60 -
                        $scope.rMinutes * 60
                    );
                }, 1000);
            }

    }

    /*By this method we can check if the upcoming event get expired
    * if it so, the upcoming event will be deleted*/
    $interval(function () {
        if (upcomingEvent != null) {
            let expiaryDate = new Date(upcomingEvent.eventDate + ", " + upcomingEvent.eventTime).getTime() / 1000;
            let nTime = Math.floor(Date.now() / 1000);
            let remaining = expiaryDate - nTime;
            if (remaining <= 0) {
                $scope.deleteEvent(upcomingEvent.id);
            }
        }

    }, 1000);

    /*this method use to add alert dialog*/
    $scope.openOffscreen = (title,content) =>{
        $mdDialog.show(
            $mdDialog.alert()
                .clickOutsideToClose(true)
                .title(title)
                .textContent(content)
                .ariaLabel('Offscreen Demo')
                .ok('Ok')

                .openFrom({
                    top: -50,
                    width: 30,
                    height: 80
                })
                .closeTo({
                    left: 1500
                })
        );
    };

    /*this method use to get the confirmation from the user to delete event*/
    $scope.showConfirm = function(id) {
        var confirm = $mdDialog.confirm()
            .title('Are You Want To Delete This Event')
            .textContent('IF You Want, PLease Confirm It!')
            .ok('Yes, I Want')
            .cancel('No I\'m Sorry');

        $mdDialog.show(confirm).then(function() {
            M.toast({html: 'Event With Id : ' + id + ', Deleted Successfully!'});
            $scope.deleteEvent(id);

        }, function() {
            M.toast({html: 'You Decided To Keep The Event'})
        });
    };


});
