/* global Snap */
'use strict';

angular.module('moodtrackerApp')
    .controller('faceCtrl', ['$scope', function ($scope){

        // set up canvas

        var face = new Snap('#mouth');

        $scope.mouths = {
            happy3:  'M10 10 C05 70, 95 70, 90 10',
            happy2:  'M10 20 C25 60, 75 60, 90 20',
            happy1:  'M10 30 C30 50, 70 50, 90 30',
            neutral: 'M10 40 C50 40, 50 40, 90 40',
            upset1:  'M10 50 C30 30, 70 30, 90 50',
            upset2:  'M10 60 C25 20, 75 20, 90 60',
            upset3:  'M10 70 C05 10, 95 10, 90 70'
        };

        var mouth = face.el('path', {
            d: $scope.mouths.neutral
        });

        face.append(mouth);

        function setMouthShape(moods) {
            var oldMouth = $scope.mouths[moods[1]];
            var newMouth = $scope.mouths[moods[0]];
            if (oldMouth !== newMouth){
                mouth.animate({d: newMouth}, 300);
            }
        }
        var holderVal = 0;
        var holderThreshold = 5;

        function holderToMood(dir){
            if (holderVal !== holderThreshold){
                return;
            }
            if(dir === 'up'){
                $scope.$parent.moodValue++;
            } else if(dir === 'down'){
                $scope.$parent.moodValue--;
            }
            resetHolder();
        }
        function resetHolder(){
            holderVal = 0;
        }

        function smileMore(){
            var mood = $scope.$parent.moodValue;
            
            if (!mood || mood === 0){
                $scope.$parent.moodValue = 4;
                return;
            }
            if (mood === 6){
                return;
            }
            holderVal++;
            holderToMood('up');
        }

        function frownMore(){
            var mood = $scope.$parent.moodValue;
            
            if (!mood || mood === 0){
                $scope.$parent.moodValue = 3;
                return;
            }
            if (mood === 1){
                return;
            }
            holderVal++;
            holderToMood('down');
        }

        $scope.$on('setMouth', function(event, args){
            setMouthShape(args);
        });
        $scope.moodChange = {
            up: smileMore,
            down: frownMore,
            resetHolder: resetHolder
        };

    }]);