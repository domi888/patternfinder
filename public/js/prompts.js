    document.getElementById("probability_table").style.display = 'none';
    let global_prompt = "Pattern";
    get_Prompt(global_prompt);

function get_Prompt(prompt_id){
    console.log(prompt_id);
    global_prompt = prompt_id;
    if(global_prompt=="Pattern"){
        pattern_prompt();
    }
    else if(global_prompt=="Probability"){
        probability_prompt();
    }
    else if(global_prompt=="News"){
        news_prompt();
    }
}
function news_prompt(){
    document.getElementById("canvas").style.display = 'none';
    document.getElementById("pike_mode_table").style.display = 'none';
    document.getElementById("probability_table").style.display = 'none';
    document.getElementById("news_prompt").style.display = 'block';
    document.getElementById("search_image").value = "";

    get_screenshots();
}
function probability_prompt(){
    context.clearRect(0,0,canvas.width,canvas.height);
    document.getElementById("canvas").style.display = 'block';
    document.getElementById("pike_mode_table").style.display = 'none';
    document.getElementById("probability_table").style.display = 'block';
    document.getElementById("how_many_days").value = shapes.length;
    document.getElementById("news_prompt").style.display = 'none';

    probability_func();
}
function pattern_prompt(){
    fetchData(current_coin);
    document.getElementById("canvas").style.display = 'block';
    document.getElementById("pike_mode_table").style.display = 'block';
    document.getElementById("probability_table").style.display = 'none';
    document.getElementById("news_prompt").style.display = 'none';
    
    is_it_going = false;
    document.getElementById("start_probability").disabled = false;
    document.getElementById("end_probability").disabled = true;
}
function fetch_source(){
    fetch('http://localhost:3000/news/'+current_coin).then(response => response.json()).then(data => rewrite_source(data.data));
}
function rewrite_source(link){
    //iframe_news
    document.getElementById("media_source").innerHTML = "Source: "+link;
    document.getElementById("iframe_news").src = link;
}
function fetch_purchase_link(){
    fetch('http://localhost:3000/purchse/'+current_coin).then(response => response.json()).then(data => rewrite_purchase_link(data.data));
}
function rewrite_purchase_link(link){
    //iframe_news
    document.getElementById("purchase_span").innerHTML = "You can purchase '"+current_coin+"' here: ";
    document.getElementById("purchase_a").href = link;
    document.getElementById("purchase_a").innerHTML = link;
}
