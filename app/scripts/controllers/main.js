/*global _, Firebase*/
'use strict';

angular.module('moodtrackerApp')
    .factory('moodService', ['$firebase', function($firebase){
        var ref = new Firebase('https://kmoods.firebaseio.com/moods');
        return $firebase(ref);
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

            $scope.moodsService = moodService;
            //set to first item in moods
            $scope.moodValue = 0;
            // set a base mood level
            $scope.averageMood = 0;

            function getToday(){

                var todayFull = new Date(Date.now());

                var today = $filter('date')(todayFull, 'yyyyMMdd');

                return today;
            }

            $scope.today = getToday();

            function getCurrentMood(){
                return $scope.moods[$scope.moodValue];
            }

            function emitSetMouth(){

                var mouthShape = $scope.moods[$scope.moodValue].mouthShape;

                $scope.$emit('setMouth', mouthShape);
                console.log('a thing');
            }

            function setMood(moodValue){

                var timeFull = Date.now();
                var time = $filter('date')(timeFull, 'HHmmss');

                // can't set an unset mood
                if (moodValue !== 0){
                    // take current mood, and push it to moodsArr

                    $scope.moodsService
                        .$child($scope.today)
                        .$child(time)
                        .$set(moodValue);
                }

                $scope.emitSetMouth();
            }

            function getAverageMood(moodsArr){
                var moodsCount = moodsArr.length;
                var calculateTotal = _.reduce(moodsArr, function(memo, val){ return memo + val;}, 0);

                var average = Math.round(calculateTotal / moodsCount * 100) / 100;
                average = average.toString();

                return moodsArr.length ? average : null;
            }

            $scope.currentMood = getCurrentMood;
            $scope.setMood = setMood;
            $scope.getAverageMood = getAverageMood;
            $scope.setMouth = emitSetMouth;

        }]);
