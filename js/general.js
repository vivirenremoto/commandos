// iniciar variables
var buildings = ['barracks', 'blacksmith', 'university', 'house'];
var buildings_help = ['skills', 'tools', 'experiencia', 'mis cosas'];


if (document.location.href.indexOf('en.html') > -1) {

    var buildings_help = ['skills', 'tools', 'experience', 'stuff'];
}

var village_walking = false;
var final_x = 0;
var final_y = 0;
var current_x = 0;
var current_y = 0;
var trees_desktop = 20;
var trees_mobile = 10;
var building_width = 203;
var building_height = 254;
var is_test = document.location.href.indexOf('test') > -1;
var eagle_width = $('#eagle').width();
var eagle_height = $('#eagle').height();

var box_width = 70 / 2;
var box_height = 81 / 2;

var walking_speed = 1;
var eagle_speed = 10000;
var villager_voice = false;

var music_start = false;
var alarm_music_start = false;

var screen_width = $(window).width();
var screen_height = $(window).height();
var is_mobile = screen_width < 480;

var villager_walking_class = 'villager_walking';
var eagle_flying_class = '';

var pressed_keys = [];
var latest_key = [];

var is_alarm = document.location.href.indexOf('alarm') > -1;

if (is_alarm) {
    $('#villager').addClass('soldier');
    villager_walking_class = 'soldier_walking';
}



var villager_width = $('#villager').width();
var villager_height = $('#villager').height();


if (is_mobile) {
    eagle_speed = eagle_speed / 2;
}



// delimitar zonas para que los edificios no se sobrepongan
if (is_mobile) {
    var zones = [
        {
            start_x: 0,
            end_x: screen_width,
            start_y: 0,
            end_y: (screen_height / 4) * 1
        },

        {
            start_x: 0,
            end_x: screen_width,
            start_y: (screen_height / 4) * 1,
            end_y: (screen_height / 4) * 2
        },

        {
            start_x: 0,
            end_x: screen_width,
            start_y: (screen_height / 4) * 2,
            end_y: (screen_height / 4) * 3
        },

        {
            start_x: 0,
            end_x: screen_width,
            start_y: (screen_height / 4) * 3,
            end_y: (screen_height / 4) * 4
        },

    ];

} else {
    var zones = [
        {
            start_x: 0,
            end_x: screen_width / 2,
            start_y: 0,
            end_y: screen_height / 2
        },

        {
            start_x: screen_width / 2,
            end_x: screen_width,
            start_y: 0,
            end_y: screen_height / 2
        },

        {
            start_x: 0,
            end_x: screen_width / 2,
            start_y: screen_height / 2,
            end_y: screen_height
        },

        {
            start_x: screen_width / 2,
            end_x: screen_width,
            start_y: screen_height / 2,
            end_y: screen_height
        },

    ];
}



// precargar imagenes
//(new Image()).src = 'img/villager_walking.gif';
//(new Image()).src = 'img/paper.png';


function init() {

    // arrow controls
    document.onkeydown = function (e) {

        if (is_alarm) return;



        if (e.which == 13) {
            if ($('#paper').is(':visible') == false) return;

            latest_key = [13];
            return;
        }


        if ($('#paper').is(':visible')) return;


        pressed_keys.push(e.which);

        pressed_keys = pressed_keys.filter(onlyUnique);



        if (pressed_keys.length == 1) {
            final_x = current_x;
            final_y = current_y;
        }


        // left
        if (pressed_keys.includes(37)) {
            final_x = 0;
        }

        // right
        if (pressed_keys.includes(39)) {
            final_x = screen_width;
        }

        // up
        if (pressed_keys.includes(38)) {
            final_y = 0;
        }

        // down
        if (pressed_keys.includes(40)) {
            final_y = screen_height;
        }

        latest_key = pressed_keys;


        startWalking();

    };

    document.onkeyup = function (e) {

        if (is_alarm) return;


        if (latest_key.includes(13)) {
            $('#close').click();
        } else {
            endWalking();
        }
        pressed_keys = [];

    };




    // botón cerrar ventana
    $('#close').click(function () {

        $('#paper').hide();
        $('#special').show();
        $('#land').removeClass('blur');
        document.getElementById('click').play();
    });

    // mover aldeano
    $('#canvas').click(function (e) {


        if (is_alarm) {



            if (!alarm_music_start) {

                alarm_music_start = true;



                document.getElementById('sound_alarm').volume = 0.1;
                document.getElementById('sound_alarm').play();


                document.getElementById('sound_alarm_voice').currentTime = 0;
                document.getElementById('sound_alarm_voice').play();


                setInterval(function () {
                    document.getElementById('sound_alarm_voice').currentTime = 0;
                    document.getElementById('sound_alarm_voice').play();

                }, 8000);


            }

            return;
        }



        if ($('#paper').is(':visible')) return;

        final_x = e.offsetX - parseInt(villager_width / 2);
        final_y = e.offsetY - parseInt(villager_height / 2);


        //final_x = e.offsetX;
        //final_y = e.offsetY;

        startWalking();


        if (!is_test) {

            if (is_alarm) {



                document.getElementById('sound_alarm_voice').play();
            } else {

                var found = false;
                while (!found) {
                    var i = randomNumber(1, 3);
                    if (villager_voice != i) {
                        found = true;
                        villager_voice = i;
                    }
                    i++;
                }

                document.getElementById('villager_talk' + villager_voice).play();


            }
        }



        //}
    });


    // centrar aldeano
    current_x = screen_width / 2;
    current_y = screen_height / 2;

    $("#villager")
        .css('left', current_x + 'px')
        .css('top', current_y + 'px').show();



    // mostrar nieve?
    /*
    var rand_snow = randomNumber(0, 2);

    if (rand_snow == 0) {
        $.getScript('js/snow.js');
    }
    */








    if (is_mobile) {
        var current_zone = zones[3];
    } else {
        var current_zone = zones[2];
    }

    var zone_x = (current_zone.end_x + current_zone.start_x - (building_width)) / 2;
    var zone_y = (current_zone.end_y + current_zone.start_y - (building_height)) / 2;


    $('#villager').css('left', zone_x).css('top', zone_y);






}

function randomNumber(min, max) {
    if (min > max) {
        let temp = max;
        max = min;
        min = temp;
    }

    if (min <= 0) {
        return Math.floor(Math.random() * (max + Math.abs(min) + 1)) + min;
    } else {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}


function flyBoxes() {



    if (is_mobile) {
        zones = [zones[3], zones[2], zones[1], zones[0]];

    } else {
        zones = [zones[3], zones[1], zones[2], zones[0]];

    }




    var html = '';
    var boxes = 4;

    for (var i = 1; i <= boxes; i++) {
        html += '<div id="' + buildings[i - 1] + '" class="box box' + i + '" ><img id="paracaidas' + i + '" class="paracaidas" src="img/paracaidas.png" width="203" height="254" ><span class="box_info">' + buildings_help[i - 1] + '</span></div>';


    }


    $('#boxes').append(html);



    for (var i = 1; i <= boxes; i++) {


        var rand_box = 3000 * i;
        var box_speed;

        if (i == 1) {
            rand_box = 0;
        }







        if (i == 1) {
            box_speed = 4000;


        } else if (i == 2) {
            box_speed = 4000;

        } else if (i == 3) {
            box_speed = 6000;

        } else if (i == 4) {
            box_speed = 6000;
        }


        var current_zone = zones[i - 1];


        var zone_x = (current_zone.end_x + current_zone.start_x - 35) / 2;
        var zone_y = (current_zone.end_y + current_zone.start_y - 41) / 2;


        if (is_mobile) {
            zone_x += randomNumber(-170, 170);

            if (zone_x > (screen_width / 2)) {
                zone_x -= 131;
            }

        } else {
            zone_x += randomNumber(-170, 170);

        }




        $('.box' + i).css('left', zone_x);



        $('.box' + i).data('index', i).delay(rand_box).animate({
            top: zone_y
        }, 3000, function () {



            $(this).css('z-index', 2);

            var id_paracaidas = $(this).data('index');


            $('#paracaidas' + id_paracaidas).animate({
                height: 0,
                top: '+=310'
            }, 3000, function () {


                $(this).parent().find('.box_info').animate({
                    'margin-top': -26,
                    'opacity': 1
                }, 500);


                $(this).remove();
            });

        });


    }




}

function flyEagle() {



    document.getElementById('sound_avion').play();


    var eagle_rand = Math.floor(Math.random() * 2);
    var eagle_final_x;
    var eagle_final_y;


    if (is_mobile) {

        eagle_start_x = screen_width;
        eagle_start_y = screen_height;

        eagle_final_x = screen_width * -1;
        eagle_final_y = (screen_height * -1) + 311;
    } else {

        eagle_start_x = screen_width;
        eagle_start_y = screen_height - (eagle_height / 2);

        eagle_final_x = screen_width * -1;
        eagle_final_y = screen_height * -1;
    }


    $("#eagle").css('left', eagle_start_x).css('top', eagle_start_y).show();

    $("#eagle").animate({
        left: eagle_final_x + 'px',
        top: eagle_final_y + 'px'
    },
        eagle_speed, 'linear', function () {
            $("#eagle").css('top', 0).css('left', 0).hide();






        });





    setTimeout(function () {

        flyBoxes();

    }, eagle_speed / 4);
}


function startWalking() {



    if (music_start == false) {


        music_start = true;





        if (is_alarm) {






            if (is_mobile) {
                $('#alarm1').css('left', (screen_width - 100) / 2).show().animate({
                    bottom: '+=72'
                }, 1000);

            } else {
                $('#alarm1').css('left', '15%').show().animate({
                    bottom: '+=72'
                }, 1000);
                $('#alarm2').css('right', '15%').show().animate({
                    bottom: '+=72'
                }, 1000);
            }

            alarm_loop();


        } else {

            music_start = true;

            flyEagle();
            document.getElementById('bg_music1').volume = 1;
            document.getElementById('bg_music1').play();

        }






    }



    $('#villager').addClass(villager_walking_class);

    clearInterval(village_walking);

    // girar aldeano si se mueve a la izquierda o derecha
    village_walking = setInterval(function () {



        current_x = parseInt($('#villager').css('left'));
        current_y = parseInt($('#villager').css('top'));
        if (current_x > final_x) {
            $('#villager').removeClass('villager_flip_x');
        } else if (current_x < final_x) {
            $('#villager').addClass('villager_flip_x');
        }




        if (current_x == final_x && current_y == final_y) {
            endWalking();

            if (is_alarm) {
                randomWalking();
            }
        } else {
            var next_x = current_x;
            var next_y = current_y;

            if (current_x < final_x) {
                next_x += walking_speed;
            } else if (current_x > final_x) {
                next_x -= walking_speed;
            }

            if (current_y < final_y) {
                next_y += walking_speed;
            } else if (current_y > final_y) {
                next_y -= walking_speed;
            }

            $('#villager').css({
                'left': next_x + 'px',
                'top': next_y + 'px',
            });
        }


    }, 5);

}

function randomWalking() {


    final_x = randomNumber(0, screen_width) - parseInt(villager_width / 2);
    final_y = randomNumber(0, screen_height) - parseInt(villager_height / 2);

    startWalking();
}

function endWalking() {


    clearInterval(village_walking);

    $('#villager').removeClass(villager_walking_class);

    // comprobar si estamos encima de un edificio
    var i = 0;
    var building_found;
    var current_building = false;
    var building_x, building_x2, building_y, building_y2;

    while (!building_found && i < buildings.length) {
        current_building = buildings[i];

        building_x = parseInt($('#' + current_building).css('left'));//- box_width;
        building_x2 = building_x + parseInt($('#' + current_building).css('width'));//+ box_width;


        building_y = parseInt($('#' + current_building).css('top'));// - box_height;
        building_y2 = building_y + parseInt($('#' + current_building).css('height'));//+ box_height;


        var diff_x = current_x - building_x;
        if (diff_x < 0) diff_x *= -1;

        var diff_y = current_y - building_y;
        if (diff_y < 0) diff_y *= -1;

        building_found = diff_x < (villager_width / 2) && diff_y < (villager_height / 2);


        i++;
    }

    if (building_found) {
        village_walking = true;
        $('#paper').show();
        $('#special').hide();
        $('#paper .pages').hide();
        $('#content_' + current_building).show();
        $('#land').addClass('blur');

        current_building = 'barracks';
        document.getElementById('sound_' + current_building).play();
    }

}

// https://www.kirupa.com/html5/using_the_pythagorean_theorem_to_measure_distance.htm
function getDistance(xA, yA, xB, yB) {
    var xDiff = xA - xB;
    var yDiff = yA - yB;

    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array?noredirect=1&lq=1
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;

}

// https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}




function alarm_loop() {


    $('body').css('background', 'black');


    $('#land').animate({
        opacity: 0.9
    }, 200, function () {

        $('body').css('background', 'red');


        $('#land').animate({
            opacity: 1
        }, 200, function () {
            alarm_loop();
        });

    });

}



if (is_alarm) {


    startWalking();
}


window.onload = function () {

    init();

    if (is_alarm) {
        $('#land').show();

    } else {
        $('#land').fadeIn('slow');

    }
};
