// const { Children } = require("react");

const subjects = ['I', 'You', 'He', 'She', 'We', 'They', 'My friend', 'The team', 'Our teacher'];
const verbs = ['like', 'hate','love', 'saw', 'built', 'fixed', 'found', 'lost', 'sent', 'received', 'remember'];
const objects = ['a book', 'the message', 'the code', 'the dog', 'my phone', 'a solution', 'the error', 'a file'];


const messages=[]; // array of strings
const invertedIndex={} // map of words, set of indices

const search=document.querySelector("#search");

// for(let sub of subjects){
//     for (let verb of verbs){
//         for(let obj of objects){
//             sentence=sub+" "+verb+" "+obj;
//             messages.push(sentence);
//         }
//     }
// }

// messages.push("I hate hate so much");

// messages.push("I hate hate so much hate");

function tokenization(){

    messages.forEach((sentence, index)=>{
        words=sentence.split(" ");
        words.forEach((word)=>{
            if(!invertedIndex[word]) invertedIndex[word] = new Set();
            invertedIndex[word].add(index);
        })
    });
}
    

const suggestions=document.querySelector("#suggestions");

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
    LPSarray=LPS(str);
    position=[], filteredChats=[];
    LPSarray.forEach((val, ind)=>{
        if(val==m) {
            position.push({"start": ind-2*m, "end":ind-m-1});
        }
    });
    position.sort((a,b)=>{
        return a["start"]-b["start"];
    });
    filteredChats.push(sentence, position);
    // console.log(filteredChats);
    // console.log("\n");
    
    
    return filteredChats;
}

function generateFilteredChats(){
    const word=search.value;
    if(invertedIndex[word]==undefined) console.log("Word not present");
    else{
        let filteredChats=[];
        for(let index of invertedIndex[word])
        {
            filteredChats.push(KMP(word, messages[index], filteredChats));
        }
        // console.log(filteredChats[0]);
        
        filteredChats.sort((a,b)=>{
            return b[1].length-a[1].length;
        });
                // console.log(filteredChats[0]);

        for(chats of filteredChats){
            let div=document.createElement("div");
            let p=document.createElement("p");
            let chat=chats[0];
            p.className="my-auto fw-semibold";
            // console.log(chats.slice(0, chats[1][0][0]));
            // console.log(chats[1][0]);
            
            p.innerHTML=chat.slice(0, chats[1][0]["start"]);     
            console.log(p.textContent);
                   
            for(let i=0;i<chats[1].length;i++){
                startIndex=chats[1][i]["start"];
                endIndex=chats[1][i]["end"];
                span=document.createElement("span");
                span.textContent=chat.slice(startIndex, endIndex+1);
                span.className="text-success";
                console.log(span);
                p.append(span);
                p.innerHTML+=chat.slice(endIndex+1, chats[1][i+1]?.["start"]??chat[1].end);
            }

            div.append(p);
            let btn=document.createElement("button");
            btn.className="btn btn-primary rounded-pill";
            btn.textContent=`${chats[1].length} frequency`;
            div.append(btn);
            div.className="rounded rounded-4 mt-2 p-3 d-flex justify-content-between shadow";
            suggestions.append(div);
        }

        
    }
}

const chats =document.querySelector("#chats");
console.log(chats);

(function loadData(){
    for(let child of chats.children){
        messages.push(child.innerText);
    }
    tokenization();
})()
console.log(messages);




