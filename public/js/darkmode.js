const modeSwitch = document.body.querySelector(".toggle-switch");
let is_it_dark_on = getCookie('darkmode') == 'dark';

modeSwitch.addEventListener("click", () =>{
    document.body.classList.toggle("dark");
    document.cookie = "darkmode="+document.body.className+"; path=http://localhost:3000/*";
});

if(is_it_dark_on) modeSwitch.click();

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
