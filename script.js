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
    console.log(str);
    
    LPSarray=LPS(str);
    console.log(LPSarray);
    
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

function highlightFilteredChats(){
    const word=search.value;
    if(word){
        msg.classList.remove("d-none");
        if(invertedIndex[word]==undefined) {
            msg.textContent=`No messages found containing "${word}"`;
            // chats.children[index].children[1].textContent=sentence;

        }
        else{
            let wordFreq=0;
            for(let index of invertedIndex[word])
            {   
                let sentence=chats.children[index].children[1].textContent;
                let position=KMP(word, sentence.toLowerCase());  
                // console.log(position);

                let newSentence=sentence.slice(0, position[0]["start"]);
                for(let i=0;i<position.length;i++){
                    newSentence+=sentence.slice(position[i]["start"], position[i]["end"] +1).fontcolor("yellow");
                    wordFreq++;
                }
                newSentence+=sentence.slice(position[position.length-1]["end"]+1, sentence.length-1);
                chats.children[index].children[1].innerHTML=newSentence;
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
// console.log(chats.children[0].children[1].textContent);




