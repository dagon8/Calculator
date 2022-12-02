const number = document.getElementById("numbers")
const operators = document.getElementById("operators")
const screen = document.getElementById("screen")
const clearBtn = document.getElementById("AC")
const evalBtn = document.getElementById("=")
const delBtn = document.getElementById("DEL")
const dotBtn = document.getElementById(".")


number.addEventListener('click', (e)=>{handleNum(e.target.id)})
operators.addEventListener('click', (e)=>{handleOp(e.target.id)})
clearBtn.addEventListener('click', (e)=>{handleClear()})
evalBtn.addEventListener('click', (e)=>{handleEval()})
delBtn.addEventListener('click', (e)=>{handleDel()})
dotBtn.addEventListener('click', (e)=>{handleDot()})


const NUMBERS = "1234567890."
const OPERATORS = "+-*/"
let inputStack = []
let allowFloat = false
let allowOp = false

const updateScreen = (value) => {
    screen.innerText += value
}

const handleNum = (value) => {
    if (value === "."){
        return
    }
    if (NUMBERS.includes(value)){
        updateScreen(value)
        inputStack.push(value)
        allowOp = true
        allowFloat = dotExists(inputStack.map((x) => x).reverse())
    }
}

const dotExists = (iStack) => {
    for (let i = 0; i < iStack.length; i++){
        let char = iStack[i]
        if (OPERATORS.includes(char)){
            break
        }
        if (char === "."){
            return false
        }
    }
    return true
}

const handleOp = (value) => {
    if (OPERATORS.includes(value) && allowOp){
        updateScreen(value)
        inputStack.push(value)
        allowOp = false
        allowFloat = false
    }
}

const handleClear = () => {
    screen.innerText = ""
    inputStack = []
    allowFloat = false
    allowOp = false
}

const handleDel = () => {
    let x = inputStack.pop()
    screen.innerText = (screen.innerText).slice(0, -1)
    if (OPERATORS.includes(x)){
        allowOp = true
    }
    if (x === "."){
        allowFloat = true
    }
    if ((screen.innerText).length === 0){
        allowFloat = false
    }
}

const handleDot = () => {
    if (allowFloat){
        updateScreen(".")
        inputStack.push(".")
        allowFloat = false
        allowOp = false
    }
}

const handleEval = () => {
    let stacks = parser()
    if (stacks === "Error: Invalid input"){
        screen.innerText = "Error: Invalid input"
        return
    }
    let numStack = stacks[0]
    numStack.reverse()
    let opStack = stacks[1]

    let result = eval(numStack, opStack)
    screen.innerText = result

    allowFloat = dotExists(result.toString().split(""))
    allowOp = true
}

const parser = () => {
    let numStack = []
    let opStack = []
    let n = ""
    for (let i = 0; i < inputStack.length; i++){
        let char = inputStack[i]
        
        if (NUMBERS.includes(char)){
            n += inputStack[i]
        }
        else if (OPERATORS.includes(char)){
            if (n.includes(".")) {
                numStack.push(parseFloat(n))
            }else{
                numStack.push(parseInt(n))
            }
            
            n = ""

            opStack.push(char)
        }
        else{
            return "Error: Invalid input"
        }
    }
    
    if (n !== ""){
        if (n.includes(".")) {
            numStack.push(parseFloat(n))
        }else{
            numStack.push(parseInt(n))
        }
    }
    
    return [numStack, opStack]
}

const eval = (numStack,opStack) => {
    if (numStack.length < 2){
        return numStack.pop()
    }

    for (let i = 0; i < opStack.length; i++) {
        let op = opStack[i]
        let x = numStack.pop()
        let y = numStack.pop()
        numStack.push(evalAux(x,y,op))
    }

    return numStack[0]
}


const evalAux = (x,y,op) => {
    switch(op) {
        case "+":
            return x + y
        case "-":
            return x - y
        case "*":
            return x * y
        break;
        case "/":
            return x / y
        default:
          return "Error: Not valid operation"
      }
}






