let my_screenshots = [];
let current_link = '';
function get_screenshots(){
    fetch('http://localhost:3000/get_shots').then(response => response.json())
        .then(data => create_enumeration(data))
        .catch((error) => alert('Unknown error, please try again!: '+error));
}
function share_screenshot(){
    const url = canvas.toDataURL("image/jpeg", 0.4);
    //document.getElementById('test_image').src = url;
    const url2 = url.split('data:image/jpeg;base64,')[1]+"<no_nickname_yet>";
    let body_ = {url2}

    const option = {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body_)
    }
    fetch('http://localhost:3000/post_shot', option).then(response => response.json()).catch((error) => alert('Unknown error, please try again!: '+error));

    let myModal = new bootstrap.Modal(document.getElementById('myModal'), {});
    current_link = url;
    document.getElementById('modal_img_id').src=url;
    document.getElementById('modal_title').value="You successfully posted: "+get_hash(url);
    my_screenshots.push(get_hash(url));
    myModal.show();
    document.getElementById('myModal').className = 'modal show';

    let allScreen = get_hash(url)+'#';
    let cookie_screens = getCookie('screenshots').split('#');
    cookie_screens.forEach((shot) => {
        allScreen += shot+'#';
    });
    document.cookie = "screenshots="+allScreen+"; path=http://localhost:3000/news.html";
}
function create_enumeration(links){
    let images = links["schreenshot"].split(';');
    images.length = images.length-1;

    
    let list = document.getElementById("myList");

    //e.firstElementChild can be used.
    var child = list.lastElementChild; 
    while (child) {
        list.removeChild(child);
        child = list.lastElementChild;
    }
    //<a href="#" class="nav-text" id="Pattern" onclick="get_Prompt(this.id)">Pattern</a>
    //data-target="#myModal"   type="button" class="btn btn-info btn-lg"
    let myModal = new bootstrap.Modal(document.getElementById('myModal'), {});
    
    let item_counter = 1;
    images.forEach((item)=>{
        let name_of = item.split('<');
        const link = name_of[0];
        let name_of_link = link;
        if(!name_of[1].includes('no_nickname_yet')){
            name_of_link = name_of[1].split('>')[0];
        }

        let li = document.createElement("li");
        let list_i = document.createElement("span");
        list_i.style.float = 'left';
        let list_i_icon = document.createElement("i");
        list_i_icon.style.float = 'right'; // ne mindenhol legyen ikon csak a sajátnál
        list_i_icon.className = "bx bxs-message-square-x";
        let li_hr = document.createElement("hr");
        //<i class='bx bx-moon icon moon' ></i>
        
        list_i.setAttribute("href", "#");
        list_i.setAttribute("data-target", "#myModal");
        list_i.setAttribute("type", "button");
        if(name_of_link == link){
            list_i.innerText = item_counter+". Screenshot: "+get_hash(name_of_link);
        }
        else{
            list_i.innerText = item_counter+". Screenshot: "+name_of_link;
        }
        
        list_i.onclick = function(){
            current_link = link;
            document.getElementById('modal_img_id').src='data:image/jpeg;base64,'+link;
            if(name_of_link == link){
                document.getElementById('modal_title').value="Screenshot: "+get_hash(name_of_link);
            }
            else{
                document.getElementById('modal_title').value="Screenshot: "+name_of_link;
            }
            myModal.show();
        }
        list_i.appendChild(li_hr);
        li.appendChild(list_i);
        if(is_it_my_screenshot(link)){
            list_i_icon.onclick = function(){
                const option = {
                    method: 'DELETE',
                    headers:{
                        'Content-Type': 'application/json'
                    }
                }
                fetch('http://localhost:3000/delete_shot/'+get_hash(link), option)
                .then(response => delete_finished(response.status))
                .catch((error) => alert('Unknown error, please try again!: '+error));
            }
            li.appendChild(list_i_icon);
        }
        list.appendChild(li);

        item_counter++;
    });
}
function delete_finished(status_of_delete){
    if(status_of_delete == 200){
        get_screenshots();
    }
    else{
        alert('It is not possible!');
    }
}
function is_it_my_screenshot(item){
    for(let i = 0; i < my_screenshots.length; i++){
        if(get_hash(item) == my_screenshots[i]){return true;}
    }
    return false;
}
function get_hash(text){
    let hash = '';
    for(let i = text.length-8; i < text.length; i++){
        hash+=text[i];
    }
    let hash2 = hash.replaceAll('/', '$');
    return hash2;
}
function search_among_screenshots(ele) {
    if(ele.key === 'Enter') {
        let list = document.getElementById("myList");

        let found = false;
        for(let i = 0; i < list.childElementCount; i++){
            if(list.children[i].innerHTML.split('Screenshot: ')[1].split('<')[0].includes(document.getElementById("search_image").value)){
                list.children[i].getElementsByTagName('span')[0].onclick.apply(list.children[i]);
                found = true;
            }
        }
        if(!found){
            alert("Not found!: "+document.getElementById("search_image").value);
        }
    }
}
document.addEventListener('DOMContentLoaded', function(){
    get_my_screenshots();
    document.getElementById('modal_title').onkeyup = function(key){
        if(key.code == "Enter" && is_it_my_screenshot(current_link)){
            let modal_title = document.getElementById('modal_title');
            let nickname = modal_title.value;
    
            if(modal_title.value.includes("Screenshot: ")){
                nickname = modal_title.value.split("Screenshot: ")[1];
            }
            if(modal_title.value.includes("Screenshot:")){
                nickname = modal_title.value.split("Screenshot:")[1];
            }
    
            const body_ = {nickname}
            const option = {
                method: 'PATCH',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body_)
            }
            if(document.URL.split('//')[1].split('/')[1].split('.')[0] === 'news'){
                fetch('http://localhost:3000/patch_shot/'+get_hash(current_link), option).then(() => {
                    get_screenshots();
                })
                .catch((error) => alert('Unknown error, please try again!: '+error));
            }
            else{
                fetch('http://localhost:3000/patch_shot/'+get_hash(current_link), option)
                .catch((error) => alert('Unknown error, please try again!: '+error));
            }
        }
    }
    document.getElementById('modal_title').onclick = function(){
        let modal_title = document.getElementById('modal_title');
        if(modal_title.value.includes("Screenshot: ")){
            modal_title.value = modal_title.value.split("Screenshot: ")[1];
        }
        else if(modal_title.value.includes("Screenshot:")){
            modal_title.value = modal_title.value.split("Screenshot:")[1];
        }
        else if(modal_title.value.includes("You successfully posted: ")){
            modal_title.value = modal_title.value.split("You successfully posted: ")[1];
        }
    }
});
function get_my_screenshots(){
    my_screenshots = getCookie('screenshots').split('#');
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
