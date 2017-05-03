(function() {
    "use strict";

    angular
        .module("main")
        .directive("mainContainer", function() {
            return {
                templateUrl: "components/main-container/main-container.html",
                controller: mainContainerCtrl,
                controllerAs: "vm"
            }

            function mainContainerCtrl(mainService, $mdDialog, d3, $http, $scope, $timeout) {

                var self = this;

                // GLOBAL VARIABLES 
                var senators = null;
                var votes = null;
                var votes2 = null;
                var groups = [];
                var dategroups = [];
                var dategroups2 = [];
                var indexDate = null;
                var indexDate2 = null;
                var uStatePaths = null;

                // DEFINE FUNCTION
                self.voteResults = voteResults;

                self.isLoading = false;

                $scope.vote_index = 0;


                $http({
                    method: 'get',
                    url: 'https://api.propublica.org/congress/v1/115/senate/members.json',
                    headers: { 'X-API-KEY': API_KEY }
                }).then(function(response) {


                    //console.log(response.data.results[0].members, ' members');
                    senators = response.data.results[0].members;
                    // console.log(senators, 'senators');

                    // BASED ON PARTY ADD COLOR PROPERTY TO OBJECT
                    senators.forEach(function(o) {
                        var party = o.party;

                        var color = null;

                        if (party == 'R') {
                            color = "#eb6f62";
                        }

                        if (party == 'D') {
                            color = "#85c1e9";
                        }

                        if (party == 'I') {
                            color = '#56dd8f';
                        }

                        o.color = color;

                        // MAKE GROUPS WITH SAME STATE
                        var group = o.state;
                        groups[group] = groups[group] || [];
                        groups[group].push(o);
                    });

                    Object.keys(groups).map(function(group) {
                        groups[group];
                    })

                    //console.log(groups, "GROUPS BY STATE");
                    $scope.groups = groups;


                }).catch(function(error) {
                    console.error("Error with GET request", error);
                })

                // CHANGE VOTE RESULT IN VIEW BY SHOWING CURRENT INDEX
                $scope.next = function() {
                    console.log($scope.dategroups.length, "check length of datagroups inside next function");
                    if ($scope.vote_index >= $scope.dategroups.length - 1) {
                        $scope.vote_index = 0;
                        //console.log($scope.vote_index, "date index if length -1");
                    } else {
                        $scope.vote_index++;
                        //console.log($scope.vote_index, "date index else ++");
                    }
                };

                console.log($scope.vote_index, "date index");

                function voteResults(v, dategroupsIndex, voteIndex) {
                    //console.log('waiting for results');
                    self.haveNoVotes = false;
                    self.resultsArr = [];

                    self.isLoading = true;
                    self.err = false;
                    var voteUri = v.vote_uri;
                    $http({
                        method: 'get',
                        url: voteUri,
                        headers: { 'X-API-KEY': API_KEY }
                    }).then(function(response) {

                        self.haveNoVotes = false;
                        //console.log(self.haveNoVotes, "get vote results for today");

                        $scope.results = response.data.results.votes.vote;
                        if (dategroupsIndex === voteIndex) {
                            self.resultsArr[dategroupsIndex] = $scope.results;
                        } else {
                            self.resultsArr[dategroupsIndex] = $scope.results;
                        }

                        self.resultsArr.join();
                        //console.log(self.resultsArr, "results array");
                        self.isLoading = false;
                        self.err = false;


                    }).catch(function(error) {
                        console.error("Error with GET request", error);
                        self.isLoading = false;
                        self.err = true;

                    })


                }

                // GET MAP CORDS AND PATHS
                $http.get('../map-data/paths.json').then(function (data){
                    uStatePaths = data;
                },function (error){
                    console.log(error, " can't get data");
                });


                var uStates = {};

                uStates.draw = function(id, data, toolTip) {

                    function onClick(d) {
                        // reset dategroups array
                        dategroups = [];
                        //console.log(dategroups, "empty dategroups array");

                        var pageX = d3.event.pageX;
                        var pageY = d3.event.pageY;

                        var senId = data[d.id][0].id;
                        var senId2 = data[d.id][1].id;

                        self.gettingvotes = true;
                        $http({
                            method: 'get',
                            url: 'https://api.propublica.org/congress/v1/members/' + senId + '/votes.json',
                            headers: { 'X-API-KEY': API_KEY }
                        }).then(function(response) {
                            //console.log(response.data.results[0].votes, ' votes');
                            self.gettingvotes = false;
                            votes = response.data.results[0].votes;
                            indexDate = response.data.results[0].votes[0].date;

                            // MAKE GROUPS OF VOTES WITH SAME DATE
                            votes.forEach(function(v) {
                                var date = v.date;

                                dategroups[date] = dategroups[date] || [];
                                dategroups[date].push(v);
                            });

                            Object.keys(dategroups).map(function(date) {
                                dategroups[date];

                            })
                            console.log(dategroups, 'dates');

                            $scope.dategroups = dategroups[indexDate];
                            console.log($scope.dategroups, "dategroups by specific date");
                            //console.log($scope.vote_index, "vote_index inside api call for votes")

                            // GET VOTE RESULTS FOR EACH VOTE INSIDE THE DATEGROUPS ARRAY
                            angular.forEach($scope.dategroups, function(v, index) {
                                    self.voteResults(v, index, $scope.vote_index);
                                })
                                //self.votestoday = false;
                            $scope.buildTooltip();
                            // var d = new Date();
                            // self.today  = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toJSON().slice(0, 10);
                            // console.log(self.votes[0].date, 'votes date', self.today, 'today');
                            // if (self.votes[0].date === self.today) {

                            //     self.votestoday = true;
                            //     console.log("yes there are votes today", self.votestoday)
                            // }

                            // the success method called

                        }).catch(function(error) {
                            self.gettingvotes = false;
                            console.error("Error with GET request", error);
                        })

                        $http({
                            method: 'get',
                            url: 'https://api.propublica.org/congress/v1/members/' + senId2 + '/votes.json',
                            headers: { 'X-API-KEY': API_KEY }
                        }).then(function(response) {
                            //console.log(response.data.results[0].votes, ' votes');
                            //self.gettingvotes = false;
                            votes2 = response.data.results[0].votes;
                            indexDate2 = response.data.results[0].votes[7].date;

                            // MAKE GROUPS OF VOTES WITH SAME DATE
                            votes2.forEach(function(v2) {
                                var date2 = v2.date;

                                dategroups2[date2] = dategroups2[date2] || [];
                                dategroups2[date2].push(v2);
                            });

                            Object.keys(dategroups2).map(function(date2) {
                                dategroups2[date2];

                            })
                            console.log(dategroups2, 'dates2');

                            $scope.dategroups2 = dategroups2[indexDate2];
                            console.log($scope.dategroups2, "dategroups2 by specific date");
                            //console.log($scope.vote_index, "vote_index inside api call for votes")

                            //self.votestoday = false;

                            // var d = new Date();
                            // self.today  = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toJSON().slice(0, 10);
                            // console.log(self.votes[0].date, 'votes date', self.today, 'today');
                            // if (self.votes[0].date === self.today) {

                            //     self.votestoday = true;
                            //     console.log("yes there are votes today", self.votestoday)
                            // }

                            $scope.buildTooltip();

                        }).catch(function(error) {
                            //self.gettingvotes = false;
                            console.error("Error with GET request senId2", error);
                        })

                        $scope.buildTooltip = function() {

                            d3.select("#tooltip").transition().duration(500).style("opacity", .9);
                            d3.select("#tooltip").html(toolTip(d.n, data[d.id][0], data[d.id][1], $scope.dategroups, $scope.dategroups2, $scope.vote_index))
                                .style("left", (pageX) + "px")
                                .style("top", (pageY - 28) + "px");
                        }
                    }

                    function mouseOut() {
                        d3.select("#tooltip").transition().duration(500).style("opacity", 0);
                    }

                    d3.select(id).selectAll(".state")
                        .data(uStatePaths).enter().append("path").attr("class", "state").attr("d", function(d) {
                            return d.d;
                        })
                        .style("fill", function(d) {
                            var stateid = d.id;
                            //console.log(d.id);
                            //console.log(data[d.id][0].color, "color error");
                            return data[d.id][0].color;
                        })
                        .on("click", onClick)
                        .on("mouseout", mouseOut);
                }
                this.uStates = uStates;

                this.tooltipHtml = tooltipHtml;



                function tooltipHtml(n, d, d2, dgroups, dgroups2, dindex) {
                    /* function to create html content string in tooltip div. */
                    var name1 = (d.first_name) + " " + (d.last_name);
                    var name2 = (d2.first_name) + " " + (d2.last_name);
                    return "<h4>" + n + "</h4>" +
                        "<div style='display:inline-block; width:auto; padding:10px;'><img style='height:65px; width:60px;' src='../assets/img/senators/" + d.id + ".jpg'/><p>" + (name1) + "(" + d.party + ") Voted " + dgroups[dindex].position + "</p><p> Votes with party " + (d.votes_with_party_pct) + "% </p></div>" +
                        "<div style='display:inline-block; width:auto; padding:10px;'><img style='height:65px; width:60px;' src='../assets/img/senators/" + d2.id + ".jpg'/><p>" + (name2) + "(" + d2.party + ") Voted " + dgroups2[dindex].position + "</p><p> Votes with party " + (d2.votes_with_party_pct) + "% </p></div>";
                }

                /* draw states on id #statesvg */
                $timeout(function() {
                    uStates.draw("#statesvg", $scope.groups, tooltipHtml);
                }, 1500);


                d3.select(self.frameElement).style("height", "600px");

            }
        })
}());
