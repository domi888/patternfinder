const bodymain = document.querySelector("body");
const searchBtn = bodymain.querySelector(".search-box");
let current_coin = 'BTC';
document.getElementById("searchId").value = current_coin;

searchBtn.addEventListener("keydown", function(event){
    if(event.key === "Enter"){
        fetchData(document.getElementById("searchId").value);
    }
});
let fetchData = function(coin){
    fetch('http://localhost:3000/name/'+coin)
    .then(response => response.json()).then(data => check_wheter_coin_existing(coin, data['data'])).catch((error) => alert('Unknown error, please try again!: '+error));;
}
function check_wheter_coin_existing(coin, res){
    if(res.toLowerCase() != 'not_found'){
        current_coin = coin;
        get_screenshots();
        fetch_source();
        fetch_purchase_link()
    }
    else{
        alert("No coin found!");
    }
}
document.addEventListener('DOMContentLoaded', function(){
    get_screenshots();
    fetch_source();
    fetch_purchase_link()
});
function search_image_on_press(event){
    search_among_screenshots(event);
}

function fetch_source(){
    fetch('http://localhost:3000/news/'+current_coin).then(response => response.json()).then(data => rewrite_source(data.data)).catch((error) => alert('Unknown error, please try again!: '+error));;
}
function rewrite_source(link){
    //iframe_news
    document.getElementById("media_source").innerHTML = "Source: "+link;
    document.getElementById("iframe_news").src = link;
}
function fetch_purchase_link(){
    fetch('http://localhost:3000/purchase/'+current_coin).then(response => response.json()).then(data => rewrite_purchase_link(data.data)).catch((error) => alert('Unknown error, please try again!: '+error));;
}
function rewrite_purchase_link(link){
    //iframe_news
    document.getElementById("purchase_span").innerHTML = "You can purchase '"+current_coin+"' here: ";
    document.getElementById("purchase_a").href = link;
    document.getElementById("purchase_a").innerHTML = link;
}