var trainees = [
        "Jaya Blanchard",
        "Eleanor Mildenstein",
        "Amanda Bansiak",
        "Kim Hancock",
        "Tashi Brundige",
        "Aida Muratoglu",
        "Tor Parker",
        "Arjun Mehta",
        "Cooper Dart",
        "Holden Turner",
        "Dylan Atencio",
        "Coleman Brockmeier",
        "Jesse Dunn",
        "Patrick Warner",
        "George Walker",
        "Dan Ralston"
    ];


function generate_groups() {
    var num_group_form = document.getElementById("num-groups");
    var num_groups = num_group_form.options[num_group_form.selectedIndex].value;

    var num_lod_form = document.getElementById("num-lods");
    var num_lods = num_lod_form.options[num_lod_form.selectedIndex].value;

    //var groups = create_groups(num_groups);

    var array = [];
    for (var i = 0; i < trainees.length; i++) {
       array.push(i);
    }
    array = shuffle(array);

    var groupHTML = "";

    for (var i = 0; i < num_groups; i++) {
        groupHTML += `<p><b>Group ${i+1}:</b></p>\n<p>`;
        for (var j = 0; j < trainees.length/num_groups; j++) {
            var nextTrainee = array.pop()
            groupHTML += `${trainees[nextTrainee]}`;
            if (j != trainees.length/num_groups - 1) {
                groupHTML += ", ";
            }
            else {
                groupHTML += ".";
            }
        }
        groupHTML += "</p>";
    }
    document.getElementById("groups").innerHTML = groupHTML;
}

//
function create_groups(num_groups) {
    var array = [];
    for (var i = 0; i < trainees.length; i++) {
       array.push(i);
    }
    array = shuffle(array);
    var groups = [];
    for (var i = 0; i < num_groups; i++) {
        var group = [];
        for (var j = 0; i < trainees.length/num_groups; i++) {
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
