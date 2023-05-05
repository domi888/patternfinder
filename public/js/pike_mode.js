let finalPikes = []; //final results
let draw_result = [];
let max_day_ = 6;
let angle_percent = 75.0;

let prediction_list_percentage = [];
let prediction_list_days = [];
let result_ = [];

function pike_sensity(){
    if(min_pike.value > 0.0){
        pikemodeclear();
        pike_mode.innerHTML = 'Pike Mode: Off';
        slider.style.display = 'none';
        pikemodeon();
    }
}
function pikemodeon(){
    if(pike_mode.innerHTML == 'Pike Mode: Off'){
        pikemodeclear();
        pike_mode.innerHTML = 'Pike Mode: On'
        min_pike.style.display = 'block';
        start_search.style.display = 'block';
        clear_indicated_pattern.style.display = 'block';

        let pikes = [];
        //analyze the data
        let pikeSequent = [];
        const least = 1.5;
        const minPercentPike = parseFloat(min_pike.value);
        let leastCounter = 0.0;
        for(let i = 0; i < shapes.length; i++){
            if(pikeSequent.length > 0){
                if(parseFloat(pikeSequent[pikeSequent.length - 1].value) <= parseFloat(shapes[i].value)){
                    pikeSequent.push({value: shapes[i].value, date: shapes[i].date});
                }
                else{
                    let max_ = parseFloat(pikeSequent[0].value);
                    for(let shape of pikeSequent){
                        if(parseFloat(shape.value) > max_){
                            max_ = parseFloat(shape.value);
                        }
                    }
                    let differenceInPercentage = (parseFloat(shapes[i].value) / parseFloat(max_)) * 100.0;
                    let diff_ = 100.0 - differenceInPercentage;
                    leastCounter += diff_;
                    if(parseFloat(least) > leastCounter){
                        pikeSequent.push({value: shapes[i].value, date: shapes[i].date});
                    }
                    else{
                        if(pikeSequent.length > 1){
                            let max__ = parseFloat(pikeSequent[0].value);
                            let maxIndex_ = 0;
                            let min__ = parseFloat(pikeSequent[0].value);
                            let minIndex_ = 0;
                            for(let j = 1; j<pikeSequent.length; j++){
                                if(max__ < parseFloat(pikeSequent[j].value)){
                                    max__ = parseFloat(pikeSequent[j].value);
                                    maxIndex_ = j;
                                }
                                if(min__ > parseFloat(pikeSequent[j].value)){
                                    min__ = parseFloat(pikeSequent[j].value);
                                    minIndex_ = j;
                                }
                            }
                            let percentageMinMax = (min__ / max__) * 100.0;
                            let p_ = 100.0 - percentageMinMax;
                            if(p_ > minPercentPike){
                                pikes.push(pikeSequent[maxIndex_]);
                                pikes.push(pikeSequent[minIndex_]);
                            }
                        }
                        pikeSequent = [];
                        i--;
                        leastCounter = 0;
                    }
                }
            }
            else{
                pikeSequent.push({value: shapes[i].value, date: shapes[i].date});
            }
        }
        for(let shape of shapes){
            for(let pike of pikes){
                if(shape.date == pike.date){
                    shape.color = "#B42CC2";
                    shape.r = 4;
                    shape.pike = true;
                }
            }
        }
        draw_points();
    }
    else{
        pikemodeclear();
    }
}
function clear_chart(){
    slider.style.display = 'none';
    prediction_list_days = [];
    prediction_list_percentage = [];
    finalPikes = [];
    draw_result = [];
    selected_pikes = [];
    selected_pikes_interval_points = [];
    current_selected_pikes = [];
    for(let shape of shapes){
        if(shape.pike){
            shape.color = "#B42CC2";
        }
    }
    draw_points();
}
function pikemodeclear(){
    pike_mode.innerHTML = 'Pike Mode: Off';
    min_pike.style.display = 'none';
    start_search.style.display = 'none';
    slider.style.display = 'none';
    clear_indicated_pattern.style.display = 'none';
    prediction_list_days = [];
    prediction_list_percentage = [];
    finalPikes = [];
    draw_result = [];
    selected_pikes = [];
    selected_pikes_interval_points = [];
    current_selected_pikes = [];
    for(let shape of shapes){
        if(shape.pike){
            shape.color = base_color;
            shape.r = shape_r;
            shape.pike = false;
        }
    }
    draw_points();
}


function getAngleDeg(bx,by) {
    var theta = Math.atan2(by, bx);
    theta *= 180 / Math.PI; 
    if (theta < 0) theta = 360 + theta; 
    return theta;
    
}
let pikes = [];
function percentageBetweenTwoPikes(first, second, selected){
    let TotalDays = days_between_two_date(first.date, second.date);
    y1 = first.value;
    y2 = second.value;

    let y_ = 0;
    let x_ = TotalDays;
    if(y1>y2){y_ = (y2 / y1);}
    else{y_ = (y1 / y2);}
    y_ = 100 - (y_ * 100.0);

    if(y2>y1){y_ *= -1;}

    let angle1 = selected;
    let angle2 = getAngleDeg(x_,y_);
    let percent = 0;

    if(angle1<0 && angle2>0){
        percent = (angle1 * -1) / (angle2 + (angle1 * -1));
        percent = (percent * 100);
    }
    else if(angle1>0 && angle2<0){
        percent = (angle2 * -1) / (angle1 + (angle2 * -1));
        percent = (percent * 100);
    }
    else if(angle1 < 0 && angle2 < 0){
        if(angle1 < angle2){
            percent = angle2 / angle1;
            percent = (percent * 100);
        }
        else{
            percent = angle1 / angle2;
            percent = (percent * 100);
        }
    }
    else{
        if(angle1 < angle2){
            percent = angle1 / angle2;
            percent = (percent * 100);
        }
        else{
            percent = angle2 / angle1;
            percent = (percent * 100);
        }
    }

    return percent;
}
function walkthrough_on_days(startIndex, temporary, selected_pikes_angles, selected_pikes_angles_index){
    let needed = selected_pikes_angles_index;
    for(let i = startIndex+1; i < pikes.length-selected_pikes_angles.length; i++){
        let percent = percentageBetweenTwoPikes(pikes[startIndex], pikes[i], selected_pikes_angles[selected_pikes_angles_index]);
        if(percent > angle_percent){
            temporary.push({index_: i, percent_: percent});
            selected_pikes_angles_index++;

            if(selected_pikes_angles_index < selected_pikes_angles.length){
                walkthrough_on_days(i, temporary, selected_pikes_angles, selected_pikes_angles_index);
            }
            else{
                for(let s of temporary){
                    result_.push(s);
                }
                temporary.pop();
                selected_pikes_angles_index--;
            }
        }
    }
    let diff = selected_pikes_angles_index - needed;
    selected_pikes_angles_index = needed;
    for(let i = 0; i < diff; i++){
        temporary.pop();
    }
}
function search(selected_pikes_angles){
    let startIndexes = [];
    for(let i = 0; i < pikes.length - selected_pikes_angles.length; i++){
        for(let j = i+1; j < pikes.length - selected_pikes_angles.length; j++){
            let percent = percentageBetweenTwoPikes(pikes[i], pikes[j], selected_pikes_angles[0]);
            if(percent > angle_percent){
                startIndexes.push({index: i, percent_: 0});
                startIndexes.push({index: j, percent_: percent});
            }
        }
    }

    //walkthrough_on_days
    let selected_pikes_angles_index = 1;
    for(let i = 0; i < startIndexes.length; i+=2){
        let temporary = [];
        temporary.push({index_: startIndexes[i].index, percent_: startIndexes[i].percent_});
        temporary.push({index_: startIndexes[i+1].index, percent_: startIndexes[i+1].percent_});
        walkthrough_on_days(startIndexes[i+1].index, temporary, selected_pikes_angles, selected_pikes_angles_index);
    }

    //result

}
function getNormalized(min, max, value, o_min, o_max){
    let n_value = (max - min)/(o_max-o_min)*(value - o_max) + max;
    return n_value;
}
function startSearch(){
    let selected_pikes_angles = [];
    let dDays = [];
    result_ = [];
    pikes = [];
    prediction_list_days = [];
    prediction_list_percentage = [];

    for(let i = 0; i < selected_pikes.length-1; i++){
        let TotalDays = days_between_two_date(selected_pikes[i].date, selected_pikes[i+1].date);
        dDays.push(TotalDays);
    }

    for(let i = 0; i < selected_pikes.length-1; i++){
        y1 = selected_pikes[i].value;
        y2 = selected_pikes[i+1].value;

        let y_ = 0;
        let x_ = dDays[i];
        if(y1>y2){y_ = (y2 / y1);}
        else{y_ = (y1 / y2);}
        y_ = 100 - (y_ * 100.0);

        if(y2>y1){y_ *= -1;}

        selected_pikes_angles.push(getAngleDeg(x_,y_));
    }
    for(let i = 0; i<shapes.length; i++){
        if(shapes[i].pike){
            pikes.push(shapes[i]);
        }
    }
    //----------------------
    search(selected_pikes_angles);
    let normalized_values = [];


    //min, max
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

    //add the original pattern
    for(let pike of selected_pikes){
        finalPikes.push(pike);
    }

    //----
    for(let i = 0; i < result_.length; i+=(selected_pikes_angles.length+1)){
        let temporary = [];
        for(let j = i; j < (i + (selected_pikes_angles.length+1)); j++){
            temporary.push(result_[j]);
        }

        //--------
        let max__ = pikes[temporary[0].index_].value;
        let min__ = pikes[temporary[0].index_].value;
        for(let pike of temporary){
            if(pikes[pike.index_].value > max__){max__ = pikes[pike.index_].value;}
            if(pikes[pike.index_].value < min__){min__ = pikes[pike.index_].value;}
        }
        
        let temporaryNormalized = [];
        for(let j = 0; j < temporary.length; j++){
            temporaryNormalized.push(getNormalized(0, 100, pikes[temporary[j].index_].value, min__, max__));
        }
        //-------

        //check wheter the points are between their interval points
        let counter = 0;
        let counter2 = 0;
        for(let j = 0; j < normalized_values.length; j++){
            let max_value = normalized_values[j]+selected_pikes_interval_points[j].array[0].value;
            let min_value = normalized_values[j]+selected_pikes_interval_points[j].array[1].value;

            if(temporaryNormalized[j] > min_value && temporaryNormalized[j] < max_value){
                counter++;
            }
        }
        //------
        //define the max day between two pikes
        for(let j = 0; j < temporary.length-1; j++){
            let TotalDays = days_between_two_date(pikes[temporary[j].index_].date,pikes[temporary[j+1].index_].date);

            if(TotalDays < max_day_){
                counter2++;
            }
        }

        //give the results to "finalPikes" after it was tested wheter it's containing it already or not
        if(counter == temporaryNormalized.length && counter2 == (temporaryNormalized.length-1)){
            let temp = [];
            for(let j = i; j < (i + selected_pikes.length); j++){
                temp.push(pikes[result_[j].index_]);
            }
            let found = false;
            for(let j = 0; j < finalPikes.length; j+=selected_pikes.length){
                let counter3 = 0;
                let index = 0;
                for(let k = j; k < (j + selected_pikes.length); k++){
                    if(finalPikes[k].date == temp[index].date){
                        counter3++;
                    }
                    index++;
                }
                if(counter3 == selected_pikes.length){
                    found = true;
                    break;
                }
            }
            if(!found){
                for(let pike of temp){
                    finalPikes.push(pike);
                }

                let nextPike_value = pikes[get_index_of_date(temp[temp.length-1].date)+1].value;
                let prediction_percentage = 0;
                let prediction_day = 0;

                if(nextPike_value < temp[temp.length-1].value){
                    prediction_percentage = -((nextPike_value / temp[temp.length-1].value))
                }
                else{
                    prediction_percentage = ((temp[temp.length-1].value / nextPike_value))
                }

                prediction_day = days_between_two_date(temp[temp.length-1].date, pikes[get_index_of_date(temp[temp.length-1].date)+1].date)

                prediction_list_percentage.push(prediction_percentage);
                prediction_list_days.push(prediction_day);
            }
            
        }
    }

    //slider
    slider.style.display = 'block';
    var list = document.getElementById('results');
    var slider_ = document.getElementById('fader');

    slider_.step = selected_pikes.length;
    slider_.max = finalPikes.length - selected_pikes.length;

    for(let i = 0; i < list.children.length; i ++){
        list.children[i].remove();
    }

    for(let i = 0; i < finalPikes.length; i += selected_pikes.length){
        var option = document.createElement('option');
        option.value = i;
        list.appendChild(option);
    }
    graph_refresh();
}

let have_tried_again = false;
function search_button(){
    if(selected_pikes.length>3){
        have_tried_again = false;
        startSearch();
    }
    else{
        if(have_tried_again){
            alert('Are you retard?')
        }
        else{
            alert('At least four pikes must be selected!')
        }
        have_tried_again = true;
    }
}