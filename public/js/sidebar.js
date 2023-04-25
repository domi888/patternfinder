const body = document.querySelector("body");
const sidebar_ = body.querySelector("#sidebarCollapse");
const modeSwitch = body.querySelector(".toggle-switch");
const modeText = body.querySelector(".mode-text");
const pike_mode = body.querySelector("#pikemode");
const min_pike = body.querySelector("#min_pike");
const jump = body.querySelector(".min_pike");
const slider = body.querySelector(".slider");
const start_search = body.querySelector("#start_search");
const clear_indicated_pattern = body.querySelector("#clear_chart");

min_pike.style.display = 'none';
min_pike.value = '1.5';
slider.style.display = 'none';
start_search.style.display = 'none';
clear_indicated_pattern.style.display = 'none';

let toggleClick = false;

modeSwitch.addEventListener("click", () =>{
    body.classList.toggle("dark");
});

let additional_width = 0;
let additional_height = 0;

const monthsWithChars = ['January', 'February',' March',' April','May','June','July','August','September','October','November','December'];
const monthsWithNumbers = ['-01-01', '-02-01','-03-01','-04-01','-05-01','-06-01','-07-01','-08-01','-09-01','-10-01','-11-01','-12-01'];

sidebar_.addEventListener("click", function(){
    if(!toggleClick){
        additional_width = 250;
        canvas.width = (window.innerWidth * 0.90 -250) + 250;
        canvas.height = (canvas.width * 0.38);

        toggle_on_plus_x = 245;
        toggleClick = true;

        document.getElementById("news_prompt").style.width = ((window.innerWidth*0.80)+250)+"px";
    }
    else{
        document.getElementById("news_prompt").style.width = ((window.innerWidth*0.80))+"px";
        additional_width = 0;
        canvas.width = (window.innerWidth * 0.90 -250);
        canvas.height = (canvas.width * 0.38);

        toggle_on_plus_x = 0;
        toggleClick = false;
    }

    fontSizeOnChart = "12px Arial";
    if(window.innerWidth < 850){
        fontSizeOnChart = "10px Arial";
    }
    if(global_prompt == "Pattern"){
        if(window.innerWidth < 769){
            document.getElementById('canvas').style.display = 'none';
        }
        else{
            document.getElementById('canvas').style.display = 'block';
        }
        scale = canvas.width/20;
        rawData(maindata);
    }

});
window.onscroll = function(){get_offset();}
window.onresize = function(){
    document.getElementById("news_prompt").style.width = (window.innerWidth*0.80)+"px";
    canvas.width = (window.innerWidth * 0.90 -250) + additional_width;
    canvas.height = (canvas.width * 0.35);
    scale = canvas.width/20;

    fontSizeOnChart = "12px Arial";
    if(window.innerWidth < 850){
        fontSizeOnChart = "10px Arial";
    }

    fontSizeOnChartCoin = "16px Arial";
    if(window.innerWidth < 1080){
        fontSizeOnChartCoin = "12px Arial";
    }

    if(global_prompt == "Pettern")
    {
        if(window.innerWidth < 769){
            document.getElementById('canvas').style.display = 'none';
        }
        else{
            document.getElementById('canvas').style.display = 'block';
        }
        rawData(maindata);
        pikemodeon();
    }
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