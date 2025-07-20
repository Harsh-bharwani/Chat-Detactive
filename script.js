// const { Children } = require("react");


const messages=[]; // array of strings
const invertedIndex={} // map of words, set of indices

const search=document.querySelector("#search");
const msg=document.querySelector("#msg");
const chats=document.querySelector("#chats");

function tokenization(){
    messages.forEach((sentence, index)=>{
        words=sentence.toLowerCase().split(/[\s\W]+/).filter(Boolean);
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

function highlightedText(sentence, position, index){
    let color=(index%2==0)? "yellow":"green";
    let newSentence=sentence.slice(0, position[0]["start"]);
    for(let i=0;i<position.length;i++){
        newSentence+=sentence.slice(position[i]["start"], position[i]["end"] +1).fontcolor(color).bold();
        if(i+1<position.length) newSentence+=sentence.slice(position[i]["end"]+1, position[i+1]["start"]);
    }
    newSentence+=sentence.slice(position[position.length-1]["end"]+1, sentence.length-1);
    return newSentence;
}

function highlightFilteredChats(){
    const word=search.value.trim();
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
                let sentence=chats.children[index].children[1].innerHTML;   
                let position=KMP(word, sentence.toLowerCase());  
                wordFreq+=position.length;
                chats.children[index].children[1].innerHTML=highlightedText(sentence, position, index);
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
}

// function generateChat(){

// }

// function newmessage