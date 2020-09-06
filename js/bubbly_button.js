// Code to send API calls
const xhr = new XMLHttpRequest();
const server_url = "https://link-shrink.glitch.me/";


const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};


function sendNotification(text, type){
  let notify = document.getElementsByClassName("notify")[0];
  let colors = {"info":"#50ff9f", "warn":"#fff9a1", "error":"#ff5c5c"};
  notify.firstElementChild.innerHTML = text;
  notify.style.backgroundColor = colors[type];
  notify.style.display = "block";
  setTimeout(() => {notify.style.display = "none";}, 3000, notify);
}


const getShortUrl = function() {
    let url = document.getElementById("url");
    let shrink_button = document.getElementsByClassName("bubbly-button")[0];
    
    if (shrink_button.id !== "submit"){
      copyToClipboard(url.value);
      sendNotification("URL copied to clipboard", "info");
      return;
    }

    if (url.value){          
      xhr.open("POST", server_url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
              let json = JSON.parse(xhr.responseText);
              url.value = json["url"];
              shrink_button.value = "copy";
              shrink_button.id = "copy";
              copyToClipboard(url.value);
              sendNotification("URL copied to clipboard", "info");
              console.log(json);

          } else if (xhr.status === 400){
            sendNotification("URL not reachable!", "warn");
            console.error(json);
            
          } else if(xhr.status === 0) {
            sendNotification("Connecting to server!", "warn");
          }
      };
      
      let data = JSON.stringify({
        "url":url.value,
        "todo": "short",
        "verify": true
      });
      xhr.send(data);

    } else {
      sendNotification("No URL provided!", "error");
      console.error("No URL provided");
    }
  };
  
var bubblyButton = document.getElementById("submit");
bubblyButton.addEventListener('click', getShortUrl);


// code to reset copy button when input box is cleared
const urlInput = document.getElementById('url');
const shrink_button = document.getElementsByClassName("bubbly-button")[0];
urlInput.addEventListener('input', function() {
    let shrink_button = document.getElementsByClassName("bubbly-button")[0];
    if (shrink_button.id !== "submit"){
        if (!this.value){
          shrink_button.value = "shrink";
          shrink_button.id = "submit";
        }
    }
});

// code to reload the page when logo text is clicked
const logo_text = document.getElementById('logo_text');
logo_text.addEventListener('click', function() {
  location.reload();
});