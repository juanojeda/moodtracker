/*global _, Firebase*/
'use strict';

angular.module('moodtrackerApp')
    .factory('moodService', ['$firebaseObject', '$firebaseArray', function($firebaseObject, $firebaseArray){
        var ref = new Firebase('https://kmoods.firebaseio.com/moods');

        // this is wrong, learn how to use $firebaseArray and $firebaseObject
        return {
            object: $firebaseObject(ref),
            array: $firebaseArray(ref)
        };
    }])
    .controller('MainCtrl', ['$scope', '$filter', 'moodService', function ($scope, $filter, moodService) {

            $scope.moods = [
                {
                    value: 0,
                    text: 'tell us how you feel',
                    moodClass: 'mood-none',
                    mouthShape: 'neutral'
                },
                {
                    value: -3,
                    text: 'super unhappy',
                    moodClass: 'mood-super-unhappy',
                    mouthShape: 'upset3'
                },
                {
                    value: -2,
                    text: 'very unhappy',
                    moodClass: 'mood-very-unhappy',
                    mouthShape: 'upset2'
                },
                {
                    value: -1,
                    text: 'pretty unhappy',
                    moodClass: 'mood-pretty-unhappy',
                    mouthShape: 'upset1'
                },
                {
                    value: 1,
                    text: 'pretty happy',
                    moodClass: 'mood-pretty-happy',
                    mouthShape: 'happy1'
                },
                {
                    value: 2,
                    text: 'very happy',
                    moodClass: 'mood-very-happy',
                    mouthShape: 'happy2'
                },
                {
                    value: 3,
                    text: 'super happy',
                    moodClass: 'mood-super-happy',
                    mouthShape: 'happy3'
                },
            ];

            // TODO
            // ===============
            // - add a firebase global variable that tracks moods per day
            // - add a firebase global variable that tracks the running average

            function getToday(){

                var todayFull = new Date(Date.now());

                var today = $filter('date')(todayFull, 'yyyyMMdd');

                return today;
            }


            function getCurrentMood(){

                if ($scope.moodValue !== 0){
                    return $scope.moods[$scope.moodValue];
                }
                else {
                    return $scope.moods[$scope.getAverageMood()];
                }
            }

            function emitSetMouth(moods){

                var newMouth = $scope.moods[$scope.moodValue].mouthShape;
                var oldMouth = moods[1];

                $scope.$broadcast('setMouth', [newMouth, oldMouth]);
            }

            function setMood(moodValue){

                var timeFull = Date.now();
                var today = getToday();
                var time = $filter('date')(timeFull, 'HHmmss');
                var moodsArray = $scope.moodService.array;
                var todaysArray = moodsArray.$getRecord(today);

                // can't set an unset mood
                if (moodValue !== 0){
                    if (todaysArray === null) {
                        $scope.moodService.object[today] = {};
                    }

                    // take current mood, and push it to moodsArr
                    $scope.moodService.object[today][time] = $scope.moodValue;
                    $scope.moodService.object.$save();

                    $scope.resetMood();
                }
            }

            function resetMood(){
                $scope.moodValue = 0;
            }



            function getAverageMood(){
                var obj = $scope.moodService.object;
                    var moodsArr;

                    angular.forEach(obj, function(val){
                        if (typeof val === 'object'){
                            moodsArr = _.values(val);
                        }
                    });

                    var total = _.reduce(moodsArr, function(mem, val){
                        return mem + val;
                    }, 0);
                    
                    var average = Math.round((total / moodsArr.length * 100) / 100);
                    return average;

            }
            $scope.moodService = moodService;

            $scope.moodService.object.$loaded()
                .then(function(){
                    //set to first item in moods
                    $scope.moodValue = 0;
                    
                    // set a base mood level
                    $scope.today = getToday();

                    // put functions on $scope
                    $scope.resetMood = resetMood;
                    $scope.currentMood = getCurrentMood;
                    $scope.setMood = setMood;
                    $scope.getAverageMood = getAverageMood;
                    // $scope.moodClass = ;
                    $scope.setMouth = emitSetMouth;

                    $scope.$watch('moodValue', function(newMood, oldMood){
                        $scope.setMouth([newMood, oldMood]);
                    });
                });

        }]);
