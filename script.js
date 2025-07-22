// const { Children } = require("react");


const messages=[]; // array of strings
const invertedIndex={} // map of words, set of indices

const search=document.querySelector("#search");
const msg=document.querySelector("#msg");
const chats=document.querySelector("#chats");

const msgSentAudio=new Audio("./public/audio/messages-sent.mp3");

function tokenization(){
    messages.forEach((sentence, index)=>{
        words=sentence.toLowerCase().trim().split(/[\s\W]+/).filter(Boolean);
        words.forEach((word)=>{
            if(!invertedIndex[word]) invertedIndex[word] = new Set();
            invertedIndex[word].add(index);
        })
    });
}
    
function LPS(str){ // return the LPS array for the given string
    const LPSarray=new Array(str.length);    
    LPSarray[0]=0;
    for(let i=1;i<str.length;i++){
        let x=LPSarray[i-1];
        while(str.charAt(i)!==str.charAt(x)){
            if(x==0){
                x=-1;
                break; 
            } 
            x=LPSarray[x-1];
        }
        LPSarray[i]=x+1;
    }
    return LPSarray;
}

function KMP(pattern, sentence) {
    let str=pattern+'@'+sentence, m=pattern.length;    
    // console.log(str);
    
    LPSarray=LPS(str);
    // console.log(LPSarray);
    
    position=[];
    LPSarray.forEach((val, ind)=>{
        if(val==m) {
            position.push({"start": ind-2*m, "end":ind-m-1});
        }
    });
    position.sort((a,b)=>{
        return a["start"]-b["start"];
    });
    return position;
}

function highlightedText(sentence, position, identifier){    
    let color=(identifier=="alice")? "yellow":"green";
    let newSentence=sentence.slice(0, position[0]["start"]);
    for(let i=0;i<position.length;i++){
        newSentence+=sentence.slice(position[i]["start"], position[i]["end"] +1).fontcolor(color).bold();
        if(i+1<position.length) newSentence+=sentence.slice(position[i]["end"]+1, position[i+1]["start"]);
    }
    newSentence+=sentence.slice(position[position.length-1]["end"]+1);
    return newSentence;
}
let timer;
function debounce(fn){
    clearTimeout(timer);
    timer=setTimeout(fn, 300);
}

function highlightFilteredChats(){
    const word=search.value.trim().toLowerCase();
    updateData();
    if(word){
        msg.classList.remove("d-none");
        chats.style.height="55vh";
        if(invertedIndex[word]==undefined) {
            msg.textContent=`No messages found containing "${word}"`;
        }
        else{
            let wordFreq=0;
            for(let index of invertedIndex[word])
            {   
                let identifier=chats.children[index].id;
                let sentence=chats.children[index].children[1].innerHTML;   
                let position=KMP(word, sentence.toLowerCase());  
                wordFreq+=position.length;
                chats.children[index].children[1].innerHTML=highlightedText(sentence, position, identifier);
           }           
            msg.textContent=`${wordFreq} messages found containing "${word}"`;
        }
    }
}

(function loadData(){
    for(let child of chats.children){
        messages.push(child.children[1].textContent);
    }
    tokenization();
})()

function updateData(){
    messages.forEach((sentence, index)=>{
        chats.children[index].children[1].innerHTML=sentence;
    })
    msg.classList.add("d-none");
    chats.style.height="61.5vh";
}

const newChat=document.querySelector("#newChat");
const footerInput=document.querySelector("#footerInput");
const footerInputBtn=document.querySelector("#footerInputBtn");

function genAliceChat(){
    const aliceDiv=document.createElement("div");    
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm=now.getHours()>=12 ? "PM":"AM";
    aliceDiv.id="alice";
    aliceDiv.className="mb-3";
    aliceDiv.innerHTML=`<h3>Alice</h3>
                <p>${footerInput.value}</p>
                <span class="bi bi-check2-all text-primary"></span>
                <span>${hours}:${minutes} ${ampm}</span>`;
    chats.appendChild(aliceDiv);
    messages.push(newChat.value +footerInput.value);
    tokenization();
    newChat.value="";
    footerInput.value="";
    highlightFilteredChats();
    footerInput.placeholder="Type a message as bob...";
    flag=true;
    msgSentAudio.play();
    aliceDiv.scrollIntoView({behavior:"smooth", block:"center"});
}

function genBobChat(){
    const bobDiv=document.createElement("div");
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm=now.getHours()>=12 ? "PM":"AM";
    bobDiv.id="bob";
    bobDiv.className="bg-white mb-3";
    bobDiv.innerHTML=`<h3>Bob</h3>
                <p>${newChat.value+footerInput.value}</p>
                <span class="bi bi-check2-all text-primary"></span>
                <span>${hours}:${minutes} ${ampm}</span>`;
    chats.appendChild(bobDiv);
    messages.push(newChat.value + footerInput.value);
    tokenization();
    newChat.value="";
    footerInput.value="";   
    highlightFilteredChats();
    footerInput.placeholder="Type a message as Alice...";
    flag=false;
    msgSentAudio.play();
    bobDiv.scrollIntoView({behavior:"smooth", block:"center"});
}

function validateText(){    
    if(newChat.value.trim().length>0) {
        document.querySelectorAll(".modal-footer button").forEach((btn)=>btn.disabled=false);
    }
    else{
        document.querySelectorAll(".modal-footer button").forEach((btn)=>btn.disabled=true);
    }
}

let flag=true; // Bob-> true, Alice ->False
function toggle(){
    if(flag){
        genBobChat();
    }
    else {
        genAliceChat();
    }
}