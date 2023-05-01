const body = document.querySelector("body");
const modeText = body.querySelector(".mode-text");
const pike_mode = body.querySelector("#pikemode");
const min_pike = body.querySelector("#min_pike");
const jump = body.querySelector(".min_pike");
const slider = body.querySelector(".slider");
const start_search = body.querySelector("#start_search");
const clear_indicated_pattern = body.querySelector("#clear_chart");

const monthsWithChars = ['January', 'February',' March',' April','May','June','July','August','September','October','November','December'];
const monthsWithNumbers = ['-01-01', '-02-01','-03-01','-04-01','-05-01','-06-01','-07-01','-08-01','-09-01','-10-01','-11-01','-12-01'];

min_pike.style.display = 'none';
min_pike.value = '1.5';
slider.style.display = 'none';
start_search.style.display = 'none';
clear_indicated_pattern.style.display = 'none';

let additional_width = 0;
let additional_height = 0;


window.onscroll = function(){get_offset();}
window.onresize = function(){
    rawData(maindata);
    pikemodeclear();
    canvas.width = canvasWrapperRect.width;
    canvas.height = canvasWrapperRect.width*0.43;
}

function slider_change(value){
    let x1 = Math.abs(finalPikes[value].x);
    let x2 = canvas.width / 10;

    let distance = x2 - x1;
    if(x1 > x2){distance = x1 - x2;}
    if(finalPikes[value].x > x2){
        distance *= -1;
    }

    
    for(let shape of shapes){
        shape.x += distance;
    }

    if(draw_result.length !== 0 && typeof draw_result.length !== 'undefined'){
        for(let i = 0; i < selected_pikes.length; i++){
            draw_result[i].color = '#B42CC2';
        }
    }

    draw_result = [];
    for(let i = parseInt(value); i < (parseInt(value) + selected_pikes.length); i++){
        draw_result.push(finalPikes[i]);
        finalPikes[i].color = '#00CCE5';
    }
    graph_refresh(cursor_X);
}