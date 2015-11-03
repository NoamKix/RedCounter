'use strict';

/**
 * @ngdoc function
 * @name redCounterApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the redCounterApp
 */
angular.module('redCounterExpressApp')
    .controller('MainCtrl', function($scope, $interval, $http) {
        $scope.selectedImage = {};

        function getUserCount() {
            $http.get('http://10.0.0.50:3000/usersCount').then(function successCallback(res) {
                $scope.totalCount = (res.data && res.data.totalCount) ? res.data.totalCount : '88';
            }, function errorCallback(res) {
                $scope.totalCount = 99;
            });
        }
        $scope.totalBugs = 0;

        function getBugsCount() {
            $http.get('bugs').then(function successCallback(res) {
                $scope.bugs = res.data;
                _.each($scope.bugs, function(team, teamName) {
                    $scope.totalBugs += team.bugs;
                    $scope.avatarNames[teamName].bugs = team.bugs;
                });
                $scope.namesAndBugs = _.toArray($scope.avatarNames);
            }, function errorCallback(res) {
                $scope.bugs = res;
            });
        }

        $scope.avatarNames = {
            server: {
                teamName: 'server',
                names: ['michael', 'assaf', 'ofir', 'tamir', 'amit', 'guy'],
                bugs: 0
            },
            web: {
                teamName: 'web',
                names: ['yoni', 'noam'],
                bugs: 0
            },
            ios: {
                teamName: 'ios',
                names: ['gad', 'danny', 'ilya'],
                bugs: 0
            }
        };

        $interval(function() {
            _.each($scope.avatarNames, function(team, teamName) {
                if ($scope.selectedImage[teamName] > 0 || $scope.selectedImage[teamName] === 0) {
                    if ($scope.selectedImage[teamName] === team.names.length - 1) {
                        $scope.selectedImage[teamName] = 0;
                    } else {
                        $scope.selectedImage[teamName]++;
                    }
                } else {
                    $scope.selectedImage[teamName] = 0;
                }
            });
        }, 2000);
        getBugsCount();
        var clock = $('.clock').FlipClock(0, {
            clockFace: 'Counter'
        });
        var singleSound = new Howl({
            urls: ['sounds/blop.mp3']
        });
        var DecaSound = new Howl({
            urls: ['sounds/blop2.mp3']
        });
        getUserCount();


        $interval(function() {
            getUserCount();
        }, 60000, true);
        $scope.$watch('totalCount', function(newValue, oldValue) {
            clock.setValue(newValue);
            if (newValue % 10 === 0) {
                DecaSound.play();
            } else {
                singleSound.play();
            }
        });
        $scope.up = function() {
            $scope.totalCount = 20;
        }
    });