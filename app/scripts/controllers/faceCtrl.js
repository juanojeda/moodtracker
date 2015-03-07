/* global Snap */
'use strict';

angular.module('moodtrackerApp')
    .controller('faceCtrl', ['$scope', function ($scope){

        // set up canvas

        var face = new Snap('#face');

        $scope.mouths = {
            happy3: 'M10 10 C 5 70, 95 70, 90 10',
            happy2: 'M10 20 C 25 60, 75 60, 90 20',
            happy1: 'M10 30 C 30 50, 70 50, 90 30',
            neutral: 'M10 40 C 50 40, 50 40, 90 40',
            upset1: 'M 90 50 C 70 30, 30 30, 10 50',
            upset2: 'M90 60 C 75 20, 25 20, 10 60',
            upset3: 'M90 70 C 95 10, 5 10, 10 70'
        };

        var mouth = face.el('path', {
            d: $scope.mouths.neutral
        });

        face.append(mouth);

        function setMouthShape(moods) {
            var oldMouth = $scope.mouths[moods[1]];
            var newMouth = $scope.mouths[moods[0]];
            console.log(oldMouth + '\n' + newMouth);
            if (oldMouth !== newMouth){
                mouth.animate({d: newMouth}, 300);
            }
        }


        $scope.$on('setMouth', function(event, args){
            setMouthShape(args);
        });

    }]);