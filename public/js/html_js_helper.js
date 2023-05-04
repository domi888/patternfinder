let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d", {willReadFrequently: true});

var canvasWrapperRect = document.getElementById('canvas-wrapper').getBoundingClientRect();
canvas.width = canvasWrapperRect.width;
canvas.height = canvasWrapperRect.width*0.43;

const bodymain = document.querySelector("body");
const searchBtn = bodymain.querySelector(".search-box");

let offset_x;
let offset_y;
let cursor_X;
let cursor_Y;
let shapes = [];
let canvas_scroll_value = 0;
let toggle_on_plus_x = 0;
let followerPointX;
let followerPointY;

let get_offset=function(){
    let canvas_offsets = canvas.getBoundingClientRect();
    offset_x = canvas_offsets.left;
    offset_y = canvas_offsets.top;
}
get_offset();

var rect = canvas.getBoundingClientRect();
let maindata;
let distance_b_t_p = canvas.width / 15;
let points_on_canvas = 0;
let min;
let minIndex;
let max;
let maxIndex;
let isDragging = false;
let isShiftDown = false;
let dragging_value = 0;
let mouse_clickX;
let mouse_clickY;
let last_point_on_canvas = 0;
let first_point_on_canvas = 0;

let line_color_green = "#00E08E";
let line_color_red = "#FF0015";
let line_color_green_highlight = "#00FFA2";
let line_color_red_highlight = "#FD2E3F";
let base_color;
let base_color_highlight;
let shape_r = 1;
let shape_r_highlight = 5;

let grid_x = 0;

let percent_between_two_day;

let is_cursor_on_canvas = false;
let constant_cursor_x = 0;
let constant_cursor_y = 0;
let current_coin = 'BTC';
let current_day = [];
let normalizedValues = [];
let selected_pikes = [];
let selected_pikes_interval_points = [];
let current_selected_pikes = [];
let is_in_interval_point = false;
let current_interval_point_click = [];

searchBtn.addEventListener("keydown", function(event){
    if(event.key === "Enter"){
        fetchData(document.getElementById("searchId").value);
    }
});
document.addEventListener('DOMContentLoaded', function(){
    fetchData('BTC');
});

let fetchData = function(coin){
    fetch('http://localhost:3000/name/'+coin)
    .then(response => response.json()).then(data => check_wheter_coin_existing(coin, data['data'])).catch((error) => alert('Unknown error, please try again!: '+error));;
}
function check_wheter_coin_existing(coin, res){
    if(res.toLowerCase() != 'not_found'){
        current_coin = document.getElementById("searchId").value;
        fetch('http://localhost:3000/coin/'+coin)
        .then(response => response.json())
        .then(data => rawData(data['data']))
        .catch((error) => alert('Unknown error, please try again!: '+error));
    }
    else{
        alert("No coin found!");
    }
}
function rawData(data){
    maindata = data;
    //do something
    distance_b_t_p = canvas.width / 15;
    min = 0;
    minIndex = 0;
    max = 0;
    maxIndex = 0;
    dragging_value = 0;
    last_point_on_canvas = 0;
    first_point_on_canvas = 0;
    constant_cursor_x = 0;
    constant_cursor_y = 0;
    canvas_scroll_value = 0;
    points_on_canvas = 0;
    grid_x = 0;

    shapes = [];
    for(let item of data){
        shapes.push({x: canvas.width - (points_on_canvas*distance_b_t_p) - (distance_b_t_p * 1.30), y: (canvas.height-50), r: shape_r, color: "black", value: item.value, date: item.date, pike: false});
    }
    if(document.getElementById('pikemode') !== null){
        start();
        pikemodeclear();
    }
}

