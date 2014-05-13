'use strict';

var _ = window._;

angular.module('moodtrackerApp')
  .controller('MainCtrl', function ($scope) {
    
    var moods = [
        {
            value: 0,
            text: 'tell us how you feel'
        },
        {
            value: -3,
            text: 'super unhappy'
        },
        {
            value: -2,
            text: 'very unhappy'
        },
        {
            value: -1,
            text: 'pretty unhappy'
        },
        {
            value: 1,
            text: 'pretty happy'
        },
        {
            value: 2,
            text: 'very happy'
        },
        {
            value: 3,
            text: 'super happy'
        },
    ];

    $scope.moodsArr = [];

    $scope.moods = moods;
    //set to first item in moods
    $scope.moodValue = 0;
    // set a base mood level
    $scope.averageMood = 0;

    function getCurrentMood(){
        return $scope.moods[$scope.moodValue];
    }

    function setMood(moodValue){

        // can't set an unset mood
        if (moodValue !== 0){
            // take current mood, and push it to moodsArr
            $scope.moodsArr.push(moodValue);
        }
    }

    function getAverageMood(moodsArr){
        var moodsCount = moodsArr.length;
        var calculateTotal = _.reduce(moodsArr, function(memo, val){ return memo + val;}, 0);

        var average = Math.round(calculateTotal / moodsCount * 100) / 100;

        return average ? average : null;
    }

    $scope.currentMood = getCurrentMood;
    $scope.setMood = setMood;
    $scope.averageMood = function(){
        return getAverageMood($scope.moodsArr);
    };

  });
