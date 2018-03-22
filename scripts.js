$(document).ready(function(){
    //var test_value = document.getElementById("test_input").value;

    jQuery.get("group_adj.txt", function(data) {
        group_adj = str_to_matrix(data);
    }, 'text');

    jQuery.get("lod_adj.txt", function(data) {
        lod_adj = str_to_matrix(data);
    }, 'text');

    $("#generate-button").click(function() {
        generate_groups();
    });
    $("#log-button").click(function() {
        log_group();
    });
    $("#update-btn").click(function() {
        update_logged_groups();
        logged_groups_updateHTML();
    });
});


var trainees = [
        {name:"Jaya Blanchard", gender:"f", year:1},
        {name:"Eleanor Mildenstein", gender:"f", year:1},
        {name:"Amanda Bansiak", gender:"f", year:2},
        {name:"Kim Hancock", gender:"f", year:1},
        {name:"Tashi Brundige", gender:"f", year:1},
        {name:"Aida Muratoglu", gender:"f", year:1},
        {name:"Tor Parker", gender:"f", year:1},
        {name:"Arjun Mehta", gender:"m", year:1},
        {name:"Cooper Dart", gender:"m", year:1},
        {name:"Holden Turner", gender:"m", year:1},
        {name:"Dylan Atencio", gender:"m", year:2},
        {name:"Coleman Brockmeier", gender:"m", year:1},
        {name:"Jesse Dunn", gender:"m", year:2},
        {name:"Patrick Warner", gender:"m", year:2},
        {name:"George Walker", gender:"m", year:1},
        {name:"Dan Ralston", gender:"m", year:1}
    ];
var num_groups = 0;
var num_lods = 0;
var num_days = 0;
var groups_generated = 1000;
var group_adj = [[]];
var lod_adj = [[]];
var group_to_log = [[]];

function read_input() {
    var num_group_form = document.getElementById("num-groups");
    num_groups = num_group_form.options[num_group_form.selectedIndex].value;

    var num_lod_form = document.getElementById("num-lods");
    num_lods = num_lod_form.options[num_lod_form.selectedIndex].value;

    var num_days_form = document.getElementById("num-days");
    num_days = num_days_form.options[num_days_form.selectedIndex].value;
}

function str_to_matrix(str) {
    var matrix = [];
    var txtByLine = str.split('\n');
    for (var i = 0; i < trainees.length; i++) {
        var arr = [];
    	var line = txtByLine[i];
        for (var j = 0; j < trainees.length; j++) {
            arr.push(parseInt(line.charAt(j)));
        }
        matrix.push(arr);
    }
    return matrix;
}

//
function update_logged_groups() {
    for(var i = 0; i < group_to_log.length; i++) {
        for(var j = 0; j < group_to_log[i].length; j++) {
            var trainee_id = `trainee${i}${j}`;
            var form = document.getElementById("logged-groups");
            var trainee = form[i*num_groups+j].value;
            group_to_log[i][j] = trainee;
        }
    }
}

// updates txt files based on value of group_to_log
function log_group() {

}

function generate_groups() {

    read_input();

    var best_groups = create_groups();
    var best_groups_score = get_score(best_groups);

    for (var i = 0; i < groups_generated; i++) {
        var groups = create_groups();
        var score = get_score(groups);
        if(score < best_groups_score) {
            best_groups = groups;
            best_groups_score = score;
        }
    }

    document.getElementById("groups").innerHTML = groups_toHTML(best_groups);

    group_to_log = best_groups;

    logged_groups_updateHTML();

}

function logged_groups_updateHTML() {
    document.getElementById("logged-groups").innerHTML = logged_groups_toHTML(group_to_log);
}

function get_score(groups) {
    var score = 0;
    score += gender_score(groups) + year_score(groups) + 100*lod_score(groups) + 5*group_score(groups);
    return score;
}

function is_leader(i, j, group) {
    return (parseInt((i+j*num_groups)/num_lods) < num_days) || (i >= num_groups-2 && j == group.length-1);
}

function lod_score(groups) {
    var score = 0;
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        for(var j = 0; j < group.length; j++) {
            if(is_leader(i,j,group)) {
                var lod = group[j];
                //computes LOD reps
                var lod_reps = 0;
                for(var k = 0; k < trainees.length; k++) {
                    lod_reps += lod_adj[lod][k];
                }
                //checks if repeat LOD pair
                if(i%2==0) {
                    var lod_co = groups[i+1][j];
                    if(lod_adj[lod][lod_co] >= 1) {
                        score += 100;
                    }
                }
                score += lod_reps;
            }
        }
    }
    return score;
}

function group_score(groups) {
    var score = 0;
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        var same_group_count = 0;
        for(var j = 0; j < group.length; j++) {
            for (var k = j; k < group.length; k++) {
                same_group_count += group_adj[group[j]][group[k]];
            }
        }
        score += same_group_count;
    }
    return score;
}

function gender_score(groups) {
    var score = 0;
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        var gender_diff = 0;
        for(var j = 0; j < group.length; j++) {
            var gender = trainees[group[j]].gender;
            if(gender == 'f') {
                gender_diff++;
            }
            else if(gender == 'm') {
                gender_diff--;
            }
        }
        score += Math.pow(gender_diff, 2);
    }
    return score;
}

function year_score(groups) {
    var score = 0;
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        var year_diff = 0;
        for(var j = 0; j < group.length; j++) {
            var year = trainees[group[j]].year;
            if(year == 1) {
                year_diff++;
            }
            else if(year == 2) {
                year_diff--;
            }
        }
        score += Math.pow(year_diff, 2);
    }
    return score;
}


function groups_toHTML(groups) {
    var groupHTML = "";

    for (var i = 0; i < num_groups; i++) {
        groupHTML += `<div class="group">\n`;
        groupHTML += `<h4>Group ${i+1}:</h4>\n`;
        var group = groups[i];
        for (var j = 0; j < group.length; j++) {
            var nextTrainee = group[j];
            groupHTML += `<p>${nextTrainee} - ${trainees[nextTrainee].name}`;
            if(i >= num_groups-2 && j == group.length-1) {
                groupHTML += " <b>(Packout)</b>";
            }
            lod_day = parseInt((i+j*num_groups)/num_lods);
            if(lod_day < num_days) {
                groupHTML += ` <b>(Day ${lod_day+1})</b>`;
            }
            groupHTML += "</p>";
        }
        groupHTML += `</div>`;
    }
    return groupHTML;
}

function logged_groups_toHTML(groups) {
    var groupHTML = '';

    for (var i = 0; i < num_groups; i++) {
        groupHTML += `<div class="group">\n`;
        groupHTML += `<h4>Group ${i+1}:</h4>\n`;
        var group = groups[i];
        for (var j = 0; j < group.length; j++) {
            var nextTrainee = group[j];
            groupHTML += `<p><input type="text" name="trainee${i}${j}" value="${nextTrainee}">`
            groupHTML += ` - ${trainees[nextTrainee].name}`;
            if(i >= num_groups-2 && j == group.length-1) {
                groupHTML += " <b>(Packout)</b>";
            }
            lod_day = parseInt((i+j*num_groups)/num_lods);
            if(lod_day < num_days) {
                groupHTML += ` <b>(Day ${lod_day+1})</b>`;
            }
            groupHTML += "</p>";
        }
        groupHTML += `</div>`;
    }
    groupHTML += '';
    return groupHTML;
}


// returns a 2D array with num_groups # of groups
function create_groups() {
    var array = [];
    for (var i = 0; i < trainees.length; i++) {
       array.push(i);
    }
    array = shuffle(array);
    var groups = [];
    for (var i = 0; i < num_groups; i++) {
        var group = [];
        var num_in_group = parseInt(array.length/(num_groups-i));
        for (var j = 0; j < num_in_group; j++) {
            group.push(array.pop());
        }
        groups.push(group);
    }
    return groups;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
