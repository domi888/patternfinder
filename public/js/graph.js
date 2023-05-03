let fontSizeOnChart = "12px Arial";
let fontSizeOnChartCoin = "16px Arial";
if(window.innerWidth < 850){
    fontSizeOnChart = "10px Arial";
}

if(window.innerWidth < 1080){
    fontSizeOnChartCoin = "12px Arial";
}

searchBtn.addEventListener("keydown", function(event){
    
    if(event.key === "Enter"){
        pikemodeclear();
    }
});
window.addEventListener("keydown", function(event){
    if(event.key === "Shift"){
        isShiftDown = true;
    }
});
window.addEventListener("keyup", function(event){
    if(event.key === "Shift"){
        isShiftDown = false;
    }
});

let pikes_frame = function(){
    let diff_ = (shapes[1].x - shapes[0].x) / 2.0;
    let selected_pikes_points_coordinates = [{x: 0, y: -diff_},{x: 0, y: diff_}];

    for(let i = 0; i<selected_pikes_interval_points.length; i++){
        for(let j = 0; j<2; j++){
            selected_pikes_interval_points[i].array[j].x = selected_pikes[i].x + selected_pikes_points_coordinates[j].x;
            selected_pikes_interval_points[i].array[j].y = selected_pikes[i].y + selected_pikes_points_coordinates[j].y + selected_pikes_interval_points[i].array[j].additional_y;
        }
    }

    //line between the interval points
    for(let point of selected_pikes_interval_points){
        draw_line(point.array[0].x,point.array[0].y,point.array[1].x,point.array[1].y, '#00CCE5', 2, false);
    }

    //line between middle points
    for(let i = 0; i <selected_pikes.length-1; i++){
        draw_line(selected_pikes[i].x,selected_pikes[i].y,selected_pikes[i+1].x,selected_pikes[i+1].y, '#00CCE5', 2, true);
    }

    //draw the middlepoints
    for(let point of selected_pikes_interval_points){
        for(let i = 0; i< 2; i++){
            context.beginPath();
            context.arc(point.array[i].x, point.array[i].y, point.r, 0, 2 * Math.PI);
            context.fillStyle = point.color;
            context.fill();
        }
    }
}

//fetch
document.addEventListener('DOMContentLoaded', function(){
    document.getElementById("searchId").value = 'BTC'
    fetchData('BTC');
})
let in_between_which_two_points = function(cursor_x){
    for(let i = 0; i< shapes.length - 1; i++){
        if(shapes[i].x < cursor_x && shapes[i+1].x > cursor_x){
            current_day = shapes[i+1];

            let differneceInValue = shapes[i+1].value - shapes[i].value;
            let differenceBetweenX = shapes[i+1].x-shapes[i].x;
            let differenceBetweenY = shapes[i+1].y-shapes[i].y;
            let differenceBetweenCursorX = cursor_x - shapes[i].x;
            let percentage = differenceBetweenCursorX / differenceBetweenX;
            let percentageInValue = differneceInValue * percentage;

            let percentageInValueY = differenceBetweenY * percentage;
            followerPointX = cursor_x;
            followerPointY = shapes[i].y + percentageInValueY;
            let returnValue = shapes[i].value + percentageInValue;

            percent_between_two_day = 100 - (shapes[i].value / returnValue) * 100.0;

            return returnValue;
        }
    }
    return 0;
}
//if a click is not on a circle then we can move within the graph
let is_click_in_circle = function(x, y){
    for(let shape of shapes){
        if(Math.sqrt((shape.x-x)*(shape.x-x) + (shape.y-y)*(shape.y-y)) < shape.r){
            return true;
        }
    }
    return false;
}
let is_click_in_interval_point = function(x, y){
    let diff_ = (shapes[1].x - shapes[0].x) / 2.0;
    let selected_pikes_points_coordinates = [{x: 0, y: -diff_},{x: 0, y: diff_}];

    for(let i = 0; i<selected_pikes_interval_points.length; i++){
        for(let j = 0; j<2; j++){
            let point_x = selected_pikes[i].x + selected_pikes_points_coordinates[j].x;
            let point_y = selected_pikes[i].y + selected_pikes_points_coordinates[j].y + selected_pikes_interval_points[i].array[j].additional_y;

            if(Math.sqrt((point_x-x)*(point_x-x) + (point_y-y)*(point_y-y)) < selected_pikes_interval_points[0].r){
                current_interval_point_click = {f: i, s: j};
                return true;
            }
        }
    }
    return false;
}

//it gives the points whom are visible on the graph
let chart_between = function(){
    points_on_canvas = shapes.length-1;
    let start = false;
    while(points_on_canvas>-1){
        let canvasX = shapes[points_on_canvas].x + dragging_value;
        if(canvasX < canvas.width-(canvas.width*0.10) && canvasX > 0){
            if(!start){last_point_on_canvas = points_on_canvas; start = true;}
            first_point_on_canvas = points_on_canvas;
        }
        points_on_canvas--;
    }

    //an error might occure here!!!!!
    if(last_point_on_canvas<shapes.length-1){
        last_point_on_canvas++;
    }
    if(first_point_on_canvas>0){
        first_point_on_canvas--;
    }
}

//data normalization regarding value on the graph
let graph_points_height = function(){
    chart_between();

    let index = 0;
    min = shapes[first_point_on_canvas + index].value;
    minIndex = first_point_on_canvas + index;
    max = shapes[first_point_on_canvas + index].value;
    maxIndex = first_point_on_canvas + index;
    while(first_point_on_canvas + index < last_point_on_canvas + 1){
        if(shapes[first_point_on_canvas + index].value < min){min = shapes[first_point_on_canvas + index].value; minIndex = first_point_on_canvas + index;}
        if(shapes[first_point_on_canvas + index].value > max){max = shapes[first_point_on_canvas + index].value; maxIndex = first_point_on_canvas + index;}
        index++;
    }
    //newvalue= (max'-min')/(max-min)*(value-max)+max'
    let height_ = canvas.height - 50;
    let ratio = height_ / 10;

    index = 0;
    while(first_point_on_canvas + index < last_point_on_canvas + 1){
        let newY = (height_ - ratio)/(max-min)*(shapes[first_point_on_canvas + index].value - max) + height_;

        shapes[first_point_on_canvas + index].y = height_ - newY + ratio;
        index++;
    }
}

//graph initialization
let graph_initialization = function(){
    chart_between();
    let index = 0;
    for (let i = shapes.length - 1; i > -1; i--)
    {
        let newX = canvas.width - (distance_b_t_p * 1.30) - (index * distance_b_t_p);
        shapes[i].x = newX + dragging_value;
        
        index++;
    }
    //console.log(days_in_chart);
    graph_points_height();
    draw_points();
}

//refresh the graph when we are moving within it(scrolling or dragging)
let graph_refresh = function(cursorX){
    chart_between();
    
    if(last_point_on_canvas != shapes.length-1){
        let index = 0;
        for (let i = last_point_on_canvas-1; i > -1; i--)
        {
            shapes[i].x = shapes[i].x + (index * canvas_scroll_value);
        
            index++;
        }
        index = shapes.length-last_point_on_canvas;
        for (let i = shapes.length-1; i >= last_point_on_canvas; i--)
        {
            shapes[i].x = shapes[i].x - (index * canvas_scroll_value);
            index--;
        }
    }
    else{
        let index = 0;
        for (let i = last_point_on_canvas; i > -1; i--)
        {
            shapes[i].x = shapes[i].x + (index * canvas_scroll_value);
        
            index++;
        }
    }
    canvas_scroll_value = 0;
    graph_points_height();
    
    cursor_X = cursorX;
    draw_points();
}
//mouse down function
let mouse_down = function(event){
    let clientX = event.clientX;
    let clientY = event.clientY;
    if(typeof event.changedTouches !== 'undefined'){
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
    }
    event.preventDefault();
    mouse_clickX = clientX - offset_x + toggle_on_plus_x;
    mouse_clickY = clientY - offset_y;
    console.log('aaaaaa')
    
    is_in_interval_point = is_click_in_interval_point(mouse_clickX, mouse_clickY);
    if(!is_in_interval_point && !is_click_in_circle(mouse_clickX, mouse_clickY)){
        isDragging = true;
    }
}

//mouse_up function
let mouse_up = function(event){
    event.preventDefault();
    is_in_interval_point = false;
    let diff_ = (shapes[1].x - shapes[0].x) / 2.0;
    let selected_pikes_points_coordinates = [{x: 0, y: -diff_},{x: 0, y: diff_}];

    isDragging = false;
    for(let shape of current_selected_pikes){
        let is_it_already_in = false;
        for(let item of selected_pikes){
            if(item.date === shape.date){is_it_already_in = true;}
        }
        if(!is_it_already_in){
            selected_pikes.push(shape);
            let current_pike_interval_points = [];
            current_pike_interval_points.push({x: shape.x + selected_pikes_points_coordinates[0].x, y: shape.y + selected_pikes_points_coordinates[0].y, additional_x: 0, additional_y: 0, value: 20});
            current_pike_interval_points.push({x: shape.x + selected_pikes_points_coordinates[1].x, y: shape.y + selected_pikes_points_coordinates[1].y, additional_x: 0, additional_y: 0, value: -20});

            selected_pikes_interval_points.push({array: current_pike_interval_points, r: 7, color: '#00CCE5', date: shape.date, x: shape.x});
        }
    }
    for(let i = 0; i < selected_pikes.length; i++){
        for(let j = 0; j < selected_pikes.length - i - 1; j++){
            if(selected_pikes[j + 1].x < selected_pikes[j].x){
                [selected_pikes[j + 1],selected_pikes[j]] = [selected_pikes[j],selected_pikes[j + 1]];
                [selected_pikes_interval_points[j + 1],selected_pikes_interval_points[j]] = [selected_pikes_interval_points[j],selected_pikes_interval_points[j + 1]];
            }
        }
    }
}

//mouse move function
let mouse_move = function(event){
    let clientX = event.clientX;
    let clientY = event.clientY;
    if(typeof event.changedTouches !== 'undefined'){
        clientX = event.changedTouches[0].clientX;
        clientY = event.changedTouches[0].clientY;
    }
    event.preventDefault();
        if(!isDragging){
            is_cursor_on_canvas = true;
            constant_cursor_x = parseInt(clientX - offset_x) + toggle_on_plus_x;
            constant_cursor_y = parseInt(clientY - offset_y);
    
            let mouseX = constant_cursor_x;
            let mouseY = constant_cursor_y;
    
            if(is_in_interval_point){
                let dy = mouseY - mouse_clickY;
                selected_pikes_interval_points[current_interval_point_click.f].array[current_interval_point_click.s].value -= (dy * 1.0);
                selected_pikes_interval_points[current_interval_point_click.f].array[current_interval_point_click.s].additional_y += dy;
                //console.log(selected_pikes_interval_points[current_interval_point_click.f].array[current_interval_point_click.s].value)
            }
            else if(!is_click_in_interval_point(constant_cursor_x, constant_cursor_y)){
                current_interval_point_click = [];
            }
            
            cursor_X = constant_cursor_x
            cursor_Y = constant_cursor_y;
            mouse_clickX = mouseX;
            mouse_clickY = mouseY;
            draw_points();
            return;
        }
        else if(isShiftDown){
            draw_points();
            draw_frame(mouse_clickX, mouse_clickY, parseInt(clientX - offset_x), parseInt(clientY - offset_y));
        }
        else{
            is_cursor_on_canvas = false;
            constant_cursor_x = 0;
            constant_cursor_y = 0;
            //error might occur here in the future
        
            let mouseX = parseInt(clientX - offset_x);
            let dx = mouseX - mouse_clickX;
            grid_x+=dx;
            console.log(dx)
            
            for(let shape of shapes){
                shape.x += dx;
            }
        
            canvas_scroll_value = 0;
            mouse_clickX = mouseX;
            graph_points_height();
            graph_refresh(parseInt(clientX - offset_x) + toggle_on_plus_x);
        }
        //console.log(event);
}
//---------------------------
//mouse wheeling event
this.canvas.addEventListener('mousewheel',function(event){
    event.preventDefault();
    chart_between();
    //kell egy külön function

    let before_scroll = shapes[1].x - shapes[0].x;
    if(event.deltaY > 0){
        //increase density
        if(shapes[1].x - shapes[0].x > 3.0){
            canvas_scroll_value = 0.75;
        }
    }
    else{
        //decrease density
        canvas_scroll_value = -0.75;
    }
    //--------
    graph_refresh(parseInt(event.clientX - offset_x) + toggle_on_plus_x);

    let after_scroll = shapes[1].x - shapes[0].x;

    let perc_ = (after_scroll / before_scroll);
    for(let pike of selected_pikes_interval_points){
        for(let i = 0; i < 2; i++){
            pike.array[i].additional_y*=perc_;
        }
    }
}, false);

//canvas.onkeydown = ;//mouse_down;
canvas.onmousedown = mouse_down;
canvas.onmouseup = mouse_up;
canvas.onmousemove = mouse_move;

canvas.ontouchstart = mouse_down;
canvas.ontouchend = mouse_up;
canvas.ontouchmove = mouse_move;
//canvas.ontouchmove = mouse_move;



let start = function(){
    //line coloring
if(shapes[shapes.length-1].value>shapes[shapes.length-2].value){
    base_color = line_color_green;
    base_color_highlight = line_color_green_highlight;
}
else{
    base_color = line_color_red;
    base_color_highlight = line_color_red_highlight;
}

//pass the line color to the circle
for(let shape of shapes){
    shape.color = base_color;
}

//start initialization
graph_points_height();
graph_initialization();

//test
}