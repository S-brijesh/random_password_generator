//fetching element by using custom attribute
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.? /';

let password ="";
let passwordLength = 10;
let checkCount =0;
handleSlider();
//set strength circle to grey
setIndicator("#ccc");

function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min))+ "% 100%";

}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    // indicator.style.boxShadow ='0 0 12px 1px ${color}';
    
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}
function getRndInteger(min, max){
    return Math.floor(Math.random() * (max-min))+min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);

}
function generateLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function generateSymbol(){
    const randNum = getRndInteger(0,Symbol.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasSymbol = false;
    let hasNumber = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNumber = true;
    if(symbolsCheck.checked) hasSymbol = true;

    if(hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength>=8){

        setIndicator("#0f0");
    } else if(
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength>=6
    ){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{

        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");
    setTimeout(()=> {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    //Fisher Yates Method
    for(let i=array.length-1;i>0;i--){
        var j = Math.floor(Math.random() * (i+1));
        var temp = array[i];
        array[i]=array[j]
        array[j=temp]
    }
    let str = "";
    array.forEach((el)=>(str+=el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });
    //specail condition
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

// allCheckBox.forEach( (checkbox) => {
//     checkbox.addEventListener('change', handleCheckBoxChange);
// })
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
},false)

generateBtn.addEventListener('click',()=>{
    if(checkCount==0){
        return;
    }

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    console.log("Starting the journey");
    password="";
    let funcArr=[];
    
    if(uppercaseCheck.checked)
        funcArr.push(generateUppercase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowercase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0;i<funcArr.length;i++)
            password+=funcArr[i]();
    console.log("compulosry addition done");

    //remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex = getRndInteger(0,funcArr.length);
        password+=funcArr[randIndex]();
    }
    console.log("shuffling done");
    //shuffle passowrd 
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;
    console.log("UI addition done");
    //calculate strength
    calcStrength(); 

})