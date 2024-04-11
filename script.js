"use strict";

// JS-9

let divmainePostWraper = document.getElementById("wraperPost");
let overlayDiv = document.getElementById("overlay");
let contentDiv = document.getElementById("content");
let closeIcon = document.getElementById("close");
let addIcon = document.getElementById("add");
let addOverlay = document.getElementById("add-post");
let formEl = document.getElementById("form-post");




function ajax(url,callback) {
    let requist = new XMLHttpRequest();
    requist.open("GET", url);
    requist.addEventListener("load",function () {

        let mosuliInfoJsPosts = JSON.parse(this.responseText);
        // console.log(mosuliInfoJsPosts); // მოსული info js.
        callback(mosuliInfoJsPosts);
    })

    requist.send();
}

ajax("https://jsonplaceholder.typicode.com/posts",function (data) {
    console.log(data); //link-იდან მოსული ინფორმაცია.
    data.forEach(el => {
        createPost(el);
    });
}); 

function createPost(item) {
    let divEl = document.createElement("div");
    divEl.classList.add("post");
    divEl.setAttribute("data-id",item.id); // data-id საშვალებით შეგვილია გავიგოთ რომელ div-ს დააჭირა user-მა

    let h3El = document.createElement("h3");
    h3El.innerText = item.id;

    let h2El = document.createElement("h2");
    h2El.innerText = item.title;

    let btnDelete = document.createElement("button");
    btnDelete.innerText = "Delete This Post";
    btnDelete.setAttribute("data-delete-id",item.id);


    divEl.appendChild(h3El);
    divEl.appendChild(h2El);
    divEl.appendChild(btnDelete);

    btnDelete.addEventListener("click",function (e) {
        e.stopPropagation(); // როდესაც click-მოხდება btnDelete-ღილაკზე ეს event-ი მემკვიდრეობით მშობელზე არ უნდა გადავიდეს.
        console.log(e.target);
        let btnId = e.target.getAttribute("data-delete-id");
        console.log(btnId);
        let btnNewUrl = `https://jsonplaceholder.typicode.com/posts/${btnId}`; 
        console.log(btnNewUrl);
        fetch(btnNewUrl,{
            method: "DELETE",
        }).then(( ) => divEl.remove()) // dom-იდან div-ის წაშლა.


         // სერვერიდან წაშლის მაგალითი.
        // .then((Response) => Response.json())
        // .then((deletePost) => console.log(deletePost));
    });

    divEl.addEventListener("click",function () {
        overlayDiv.classList.add("activeOverlay");
        let postId = this.getAttribute("data-id"); // ამოვიღოთ დაჭერილი div-ის data-id-ის მნიშვნელობა და შევინახოთ postId-ცვლადში.
        console.log("divId =", postId);
        let urlNew = `https://jsonplaceholder.typicode.com/posts/${postId}`; // დაჭერილი div-ის data-id-ის მნიშვნელობას ვუმაგრებთ link-ს.
        console.log(urlNew);
        ajax(urlNew,function (mosulidata) {
            console.log(mosulidata); // ერთი მოსული ობიექტი.
            let p = document.createElement("p");
            p.innerText = mosulidata.body;

            contentDiv.appendChild(p)
        })
    })

    divmainePostWraper.appendChild(divEl);
}

closeIcon.addEventListener("click",function () {
    overlayDiv.classList.remove("activeOverlay");
    contentDiv.innerHTML = " ";
})


// პოსტის დამატება 
addIcon.addEventListener("click",function () {
    addOverlay.classList.add("addActive");
    document.getElementById("title").value = " "; // input-ის წაშლა ღილაკზე დაჭერის შემდეგ.
})

formEl.addEventListener("submit",function (e){
    e.preventDefault();     //auto-refresh-ის გამორთვა.
    // console.log(this); // this-ის მნიშვნელობა ხდება მთლიანი ფორმა.
    // console.log(e.target[0].value);

    let dataNewPost = {
        title:e.target[0].value,
    };
    console.log(dataNewPost);
    

fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: JSON.stringify({
    title: e.target[0].value,
    userId: 11,
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})
  .then((response) => response.json())
  .then((createdNewObject) => {
    createPost(createdNewObject); // 101-ე პოსტის შექმნა dom-ში.
    addOverlay.classList.remove("addActive");
    console.log(createdNewObject)
});
})



