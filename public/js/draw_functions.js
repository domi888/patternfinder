var r_a = 0.303; 
var r_a_border = 0.503; 
let prediction_negative_color = "rgba(255, 0, 0, " + r_a + ")";
let prediction_positive_color = "rgba(0, 255, 0, " + r_a + ")";
let prediction_color = "";
let prediction_negative_color_border = "rgba(255, 0, 0, " + r_a_border + ")";
let prediction_positive_color_border = "rgba(0, 255, 0, " + r_a_border + ")";
let prediction_color_border= "";
//write the datas within the canvas
let write_this = function(text, mode, x, y, color){
    context.font = mode;
    context.fillStyle = color;
    context.fillText(text, x, y);
}

//draw the graph cursor
let graph_cursor = function(x, y){
    let start_of_the_last_tenth = canvas.width-(canvas.width*0.10);

    draw_line(x, 0, x, canvas.height - 50, '#B0B0B1', 1, true);
    draw_line(0, y, start_of_the_last_tenth, y, '#B0B0B1', 1, true);

    //actual date & value of the cursor(y):
    if(typeof current_day.date !== 'undefined'){
        context.fillStyle = 'Gray';
        context.fillRect(x-35,canvas.height-46,75,16);
        let stringDate = current_day.date.split('T')[0];
        write_this(stringDate, '13px Arial', x-30, canvas.height-50+17, '#EBEBEB');
    }

    if(typeof normalizedValues[0].height !== 'undefined'){
        let between_bottom_height = 0;
        let between_top_height = 0;
        let between_bottom_value = 0;
        let between_top_value = 0;

        for(let i = 0; i<normalizedValues.length-1; i++){
            if(normalizedValues[i].height > y && normalizedValues[i+1].height<y){
                between_bottom_height = normalizedValues[i].height;
                between_top_height = normalizedValues[i+1].height;

                between_bottom_value = normalizedValues[i].value;
                between_top_value = normalizedValues[i+1].value;
                break;
            }
        }
        let difference_between_height = between_bottom_height - between_top_height;
        let difference_betwen_cursor_height = y - between_top_height;
        let percentage_between_cursor = difference_betwen_cursor_height / difference_between_height;
        let difference_between_value = between_bottom_value - between_top_value;

        let value_of_cursor = parseFloat(between_top_value) + parseFloat((difference_between_value * percentage_between_cursor));

        context.fillStyle = 'Gray';
        context.fillRect(start_of_the_last_tenth, y-15, (canvas.width*0.10), 30);
        write_this(' '+value_of_cursor.toFixed(4), '13px Arial', start_of_the_last_tenth, y+5, '#EBEBEB');
    }

}
//draw functions
let draw_points = function(){
    context.clearRect(0,0,canvas.width,canvas.height);

    let height_ = canvas.height - 50;
    let ratio = height_ / 11;

    let difference = max - min;
    let value_ratio = difference/10;

    //vertical grid part  --> moving part and drawing part
    if((canvas.width*0.05)+ grid_x > (canvas.width*0.05)*2 || (canvas.width*0.05)+ grid_x < 0){
        grid_x = 0;
    }
    for(let i = 0; i<=18; i++){
        draw_line(((canvas.width*0.05) * i) + grid_x, 0, ((canvas.width*0.05) * i) + grid_x, height_, '#E1E1E1', 1, false);
    }
    
    //horizontal grid part
    for(let i = 1; i<=11; i++){
        draw_line(0, height_-((i-1)*ratio), canvas.width-(canvas.width*0.10), height_-((i-1)*ratio), '#E1E1E1', 1, false);
    }
    
    draw_line(canvas.width-(canvas.width*0.10), 0, canvas.width-(canvas.width*0.10), canvas.height, 'Black', 1, false);
    //prediction section start
    prediction_rect_draw();

    //-----
    draw_line_between_chart_points();
    for(let shape of shapes){
        context.beginPath();
        context.arc(shape.x, shape.y, shape.r, 0, 2 * Math.PI);
        context.fillStyle = shape.color;
        context.fill();
        //context.stroke();
    }
    for(let i = 1; i < shapes.length; i++){
        for(let j = 0; j<monthsWithNumbers.length; j++){
            if(shapes[i].date.includes(monthsWithNumbers[j])){
                write_this(monthsWithChars[j], '14px Arial', shapes[i-1].x, height_+17, 'Gray');
                break;
            }
        }
    }

    pikes_frame();
    //result:
    for(let i = 0; i < draw_result.length-1; i++){
        let fromX = draw_result[i].x;
        let fromY = draw_result[i].y;
        let toX = draw_result[i+1].x;
        let toY = draw_result[i+1].y;

        draw_line(fromX, fromY, toX, toY, '#00CCE5', 2,false);
    }

    context.clearRect(canvas.width-(canvas.width*0.10), 0, canvas.width*0.10, canvas.height);
    normalizedValues = [];
    for(let i = 1; i<=11; i++){
        
        let roundedValue = parseFloat(min + (value_ratio*(i-1))).toFixed(4);
        let valueHeight = height_- ((i-1) *ratio);

        normalizedValues.push({height: valueHeight, value: roundedValue});
        write_this(roundedValue,fontSizeOnChart, canvas.width-(canvas.width*0.08), valueHeight, 'gray');
    }

    context.clearRect(0, 0, (canvas.width*0.25)-1, ratio-1);
    
    //cursor
    if(is_cursor_on_canvas){
        graph_cursor(constant_cursor_x, constant_cursor_y);
    }
    
    //coin title and its value
    if(typeof cursor_X !== 'undefined'){
        let coinValue = in_between_which_two_points(cursor_X);
        let percent = -0;
        if(typeof percent_between_two_day !== 'undefined'){
            if(percent_between_two_day > 0)percent = '+'+percent_between_two_day.toFixed(2);
            else percent = percent_between_two_day.toFixed(2);
        }

        write_this(current_coin.toUpperCase()+":  "+coinValue.toFixed(4)+' $  ('+percent+'%)', fontSizeOnChartCoin, 5, height_ * 0.055, base_color);
    
        //-----follower point
        context.beginPath();
        context.arc(followerPointX, followerPointY, 4, 0, 2 * Math.PI);
        context.fillStyle = 'Orange';
        context.fill();

    }

    //interval point's value
    if(typeof current_interval_point_click.f !== 'undefined'){
        let value_ = selected_pikes_interval_points[current_interval_point_click.f].array[current_interval_point_click.s].value.toFixed(1);
        let x_ = selected_pikes_interval_points[current_interval_point_click.f].array[current_interval_point_click.s].x;
        let y_ = selected_pikes_interval_points[current_interval_point_click.f].array[current_interval_point_click.s].y;
        let color_ = '#EBEBEB';

        //min, max
        let normalized_values = [];
        let max_ = selected_pikes[0].value;
        let min_ = selected_pikes[0].value;

        for(let pike of selected_pikes){
            if(pike.value > max_){max_ = pike.value;}
            if(pike.value < min_){min_ = pike.value;}
        }

        //newvalue= (max'-min')/(max-min)*(value-max)+max'
        for(let i = 0; i < selected_pikes.length; i++){
            normalized_values.push(getNormalized(0, 100, selected_pikes[i].value, min_, max_));
        }

        //background & text
        let add_y_to_background = -30;
        let add_y_to_text = -15;
        if(current_interval_point_click.s === 1){
            add_y_to_background = 10;
            add_y_to_text = 25;
        }
        context.fillStyle = 'Gray';
        context.fillRect(x_-20, y_+add_y_to_background, 60, 20);

        let normValue = (normalized_values[current_interval_point_click.f] + parseFloat(value_)).toFixed(1);
        if(normValue > 0){normValue = '+'+normValue+'%';}
        else{normValue = normValue+'%';}

        write_this(normValue, '13px Arial', x_-10, y_+add_y_to_text, color_);
    }
    
}
function prediction_rect_draw(){
    if(selected_pikes.length > 0 && prediction_list_days.length > 0){
        let index_shape = 0;
        for(let i = 0; i < shapes.length; i++){
            if(shapes[i].date == selected_pikes[selected_pikes.length-1].date){
                index_shape = i;
            }
        }
        let min_pred_interval_y = Math.abs((shapes[index_shape].y - shapes[index_shape+1].y)) * Math.abs(get_min(prediction_list_percentage));
        let max_pred_interval_y = Math.abs((shapes[index_shape].y - shapes[index_shape+1].y)) * Math.abs(get_max(prediction_list_percentage) * 10.0);

        if(get_sum(prediction_list_percentage) > 0){
            min_pred_interval_y = selected_pikes[selected_pikes.length-1].y - min_pred_interval_y;
            max_pred_interval_y *= -1;

            prediction_color = prediction_positive_color;
            prediction_color_border = prediction_positive_color_border;
        }
        else{
            min_pred_interval_y = selected_pikes[selected_pikes.length-1].y + min_pred_interval_y;
            max_pred_interval_y *= 1;

            prediction_color = prediction_negative_color;
            prediction_color_border = prediction_negative_color_border;
        }

        
        context.beginPath();
        context.setLineDash([10, 5]);
        context.lineWidth = "2";
        context.fillStyle = prediction_color;
        context.strokeStyle = prediction_color_border;
        context.rect(selected_pikes[selected_pikes.length-1].x+(get_min(prediction_list_days)), min_pred_interval_y, (get_max(prediction_list_days) * (Math.abs(shapes[1].x) - Math.abs(shapes[2].x))), max_pred_interval_y);
        context.stroke();
        context.fill();
    }
}
let draw_line_between_chart_points = function(){
    for(let i = 0; i<shapes.length - 1; i++){
        draw_line(shapes[i].x, shapes[i].y, shapes[i + 1].x, shapes[i + 1].y, base_color, 2, false);
    }
}
function draw_line(fromx, fromy, tox, toy, color, line_width, is_dashed){
    context.lineWidth = line_width;
    context.strokeStyle = color;
    if(is_dashed){
        context.setLineDash([5, 15]);
    }
    else{
        context.setLineDash([0, 0]);
    }
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.stroke();
}

//draw a frame and store the points within it
let draw_frame = function(startX, startY, endX, endY){
    context.lineWidth = 1;
    context.strokeStyle = '#B0B0B1';
    context.setLineDash([5, 15]);
    context.beginPath();
    context.rect(startX, startY, endX-startX+toggle_on_plus_x, endY-startY);
    context.stroke();

    let sX = startX ;
    let sY = startY;
    let eX = endX+toggle_on_plus_x;
    let eY = endY;
    current_selected_pikes = [];

    if(sX > eX){let replace_ = sX; sX = eX; eX = replace_;}
    if(sY > eY){let replace_ = sY; sY = eY; eY = replace_;}
    
    for(let shape of shapes){
        if(shape.pike){
            if(sX<shape.x && eX > shape.x && sY<shape.y && eY > shape.y){
                shape.r = 4;
                shape.color = '#00CCE5';
                current_selected_pikes.push(shape);
            }
            else{
                shape.color = '#B42CC2';
                shape.r = 4;
            }
        }
    }
    for(let shape of selected_pikes){
        for(let item of shapes){
            if(item.date === shape.date){
                item.r = 4;
                item.color = '#00CCE5';
            }
        }
    }
    //draw_points();
}
//probability
function draw_border(){
    const scale = canvas.width/20;
    for(let i = 0; i < 20; i++){
        draw_line(i*scale, 0, i*scale, canvas.height, "#B0B0B1", 2, false);
    }
}
function draw_rect(sx,sy,ex,ey){
    context.lineWidth = 1;
    context.fillStyle = '#009499';
    context.beginPath();
    //context.rect(startX, startY, endX-startX+toggle_on_plus_x, endY-startY);
    context.rect(sx, sy, ex, ey);
    context.fill();
}

//-----
function get_index_of_date(date){
    for(let i = 0; i < pikes.length; i++){
        if(date == pikes[i].date){
            return i;
        }
    }
}
function get_min(my_array){
    let min = my_array[0];
    for(let item of my_array){
        if(item < min)min=item;
    }
    return min;
}
function get_max(my_array){
    let max = my_array[0];
    for(let item of my_array){
        if(item > max)max=item;
    }
    return max;
}
function days_between_two_date(date1, date2){
    var date1_ = new Date(date1);
    var date2_ = new Date(date2);

    let time_difference = date2_.getTime() - date1_.getTime();
    let TotalDays = Math.ceil(time_difference / (1000 * 3600 * 24));
    return Math.abs(TotalDays);
}
function get_sum(my_array){
    let sum = 0;
    for(let value of my_array){
        sum+=value;
    }
    return sum;
}
function get_max_from_shape(){
    let max = shapes[0].value;
    for(let item of shapes){
        if(item.value > max)max=item.value;
    }
    return max;
}
function get_min_from_shape(){
    let min = shapes[0].value;
    for(let item of shapes){
        if(item.value < min)min=item.value;
    }
    return min;
}