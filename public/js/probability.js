document.getElementById("searchId").value = 'BTC'
document.getElementById("how_many_days").value = 365;

let value_range = 0;
let range_array = [];
let sum_array = [];
let scale = canvas.width/20;
let height_ratio = (canvas.height - 50) / 11;
var step = 0;
var range_array_index = 0;
let my_time_out = parseInt(document.getElementById("myRange").value);


let is_it_going = false;
let fontSizeOnProbability = "14px Arial";
let fontSizeOnProbabilityCoin = "14px Arial";
function start_probability(){

    scale = canvas.width/20;
    fontSizeOnProbability = (Math.sqrt(canvas.width)/3.2)+"px Arial";
    fontSizeOnProbabilityCoin = (Math.sqrt(canvas.width)/3)+"px Arial";
    is_it_going = true;
    probability_func();
    set_back_init();
    initialize_probability();
    document.getElementById("start_probability").disabled = true;
    document.getElementById("end_probability").disabled = false;

}
function end_probability(){
    is_it_going = false;
    set_back_init();
    document.getElementById("start_probability").disabled = false;
    document.getElementById("end_probability").disabled = true;
}
function probability_func(){
    draw_border();
}
function initialize_probability(){
    sum_array = [];
    for(let i = 0; i < 20; i++){
        sum_array.push(0);
    }
    range_array = [];
    
    let min_value = get_min_from_shape();
    value_range = (get_max_from_shape() - min_value) / 20;
    let how_many_days = document.getElementById("how_many_days").value;
    for(let i = (shapes.length - parseInt(how_many_days)); i < shapes.length; i++){
        for(let j = 1; j <= 20; j++){
            if(shapes[i].value <= min_value + (value_range * j)){
                range_array.push(j + ": " + i); //range + index
                break;
            }
        }
    }
    let start_date = shapes[shapes.length - document.getElementById("how_many_days").value].date.split('T')[0];
    let end_date = shapes[shapes.length-1].date.split('T')[0];
    animationLoop(start_date, end_date);
}

function animationLoop(start_date, end_date){

    let y_scale = canvas.height / 75;
    setTimeout(function() {
        context.clearRect(0,0,canvas.width,canvas.height);

        for(let i = 0; i < sum_array.length; i++){
            draw_rect(i*scale, canvas.height-(y_scale*sum_array[i]), scale, y_scale*sum_array[i]);
        }

        
        draw_border();
        draw_rect((parseInt(range_array[range_array_index].split(':')[0])-1) * scale, step, scale, y_scale);
        
        
        context.clearRect(0, 0, (scale*4)-5, height_ratio+5);
        draw_line(0, height_ratio+5, (scale*4), height_ratio+5, '#B0B0B1', 2, false);
        //separator of percentages
        draw_line(0, canvas.height-(Math.sqrt(canvas.width)/3.2)-5, canvas.width, canvas.height-(Math.sqrt(canvas.width)/3.2)-5, 'DarkGrey', 1, false);

        let changing_day = shapes[parseInt(range_array[range_array_index].split(': ')[1])].date.split('T')[0];
        write_this(current_coin+":  "+start_date+' - '+end_date, fontSizeOnProbabilityCoin, 5, (canvas.height - 50) * 0.035, "#B0B0B1");
        write_this("DAY:  "+changing_day, fontSizeOnProbabilityCoin, 5, (canvas.height - 50) * 0.075, "#B0B0B1");

        //bottom of canvas
        for(let i = 0; i < sum_array.length; i++){
            write_this(((i*5)+' - '+(i*5+5)+'%'), fontSizeOnProbability, (i*scale)+(scale*0.15), canvas.height-20, "#B0B0B1");
            write_this(((sum_array[i]/range_array_index)*100).toFixed(1)+'%', fontSizeOnProbability, (i*scale)+(scale*0.25), canvas.height-5, "#B0B0B1");
        }

        step+=25;
        if(is_it_going && range_array_index < range_array.length-1){
            if (step < canvas.height-y_scale) {
                animationLoop(start_date, end_date);
            }
            else{
                if(range_array_index<range_array.length){
                    step = 0;
                    sum_array[(parseInt(range_array[range_array_index].split(':')[0])-1)] += 1
                    range_array_index++;
                    animationLoop(start_date, end_date);
                }
            }
        }

        //set the sped of blocks
        if(document.getElementById("myRange").value == 100){
            my_time_out = 0;
        }
        else{
            my_time_out = (1000/parseInt(document.getElementById("myRange").value));
        }
      }, my_time_out)
}
function set_back_init(){
    context.clearRect(0,0,canvas.width,canvas.height);
    draw_border();

    step = 0;
    range_array_index = 0;
    for(let i = 0; i < sum_array.length; i++){
        sum_array[i] = 0;
    }
    my_time_out = (1000/parseInt(document.getElementById("myRange").value));


}