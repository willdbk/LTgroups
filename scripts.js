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
var groups_generated = 100;

function read_input() {
    var num_group_form = document.getElementById("num-groups");
    num_groups = num_group_form.options[num_group_form.selectedIndex].value;

    var num_lod_form = document.getElementById("num-lods");
    num_lods = num_lod_form.options[num_lod_form.selectedIndex].value;
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

}

function get_score(groups) {
    var score = 0;
    score += gender_score(groups) + year_score(groups);
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
        groupHTML += `<p><b>Group ${i+1}:</b></p>\n<p>`;
        var group = groups[i];
        for (var j = 0; j < group.length; j++) {
            var nextTrainee = trainees[group[j]].name;
            groupHTML += nextTrainee;
            if (j != group.length - 1) {
                groupHTML += ", ";
            }
            else {
                groupHTML += ".";
            }
        }
        groupHTML += "</p>";
    }
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
