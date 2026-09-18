class TextSource {
  constructor(_name) {
    this.title = _name;
    this.url = "./texts/" + _name.replace(/ /g, "").toLowerCase() + ".txt";
    this.text = "";
    $.get(
      this.url,
      data => {
        this.text = data;
      },
      "text"
    );
    var btn = document.createElement("BUTTON");
    btn.type = "button";
    btn.setAttribute("onClick", "getText('" + this.title + "');");
    //btn.onclick = function(){getText(this.title)}
    var textnode = document.createTextNode("+" + this.title);
    btn.appendChild(textnode);
    document.getElementById("mySpan").appendChild(btn);
  }
}
var titles = [
  "Avengers",
  "Batman",
  "Beatles",
  "blobfish",
  "Coen Bros",
  "Frozen",
  "Harry Potter",
  "Hunger Games",
  "Indiana Jones",
  "John Hughes",
  "MCU",
  "Mike Judge",
  "Shrek",
  "Star Trek",
  "Star Wars",
  "The Office",
  "Tim Burton",
  "Toy Story",
  "walrus",
  "Wes Anderson"
];
var library = [];
for(var each of titles){
  library.push(new TextSource(each))
}

var ngrams = {};
var paragraphSizes = [];
var input, button, textoutput, oSlider;
oSlider = document.getElementById("myslider");
var order = oSlider.value;
textoutput = document.getElementById("textgoeshere");
var customText = "";

var txt = "";
var recipeArray = [];

//ngrams = buildMarkovChain(order, txt);
// ////console.log(ngrams);
// generateText()

function buildMarkovChain(order, txt) {
  order = parseInt(order);
  for (var i = 0; i < txt.length - order + 1; i++) {
    var gram = txt.substring(i, i + order);
    if (!ngrams[gram]) {
      ngrams[gram] = [];
    }
    ngrams[gram].push(txt.charAt(i + order));
  }
  generateText();
  return ngrams;
}

function changeOrder() {
  order = oSlider.value;
  document.getElementById("orderNumber").innerHTML = order;
  //document.getElementById('textInput').value=order;
  ngrams = [];
  ngrams = buildMarkovChain(order, txt);
}

function generateText() {
  hidePreviousParagraphs();
  var currentGram = "foobar";
  for (var i = 0; i < 1000; i++) {
    if (currentGram.substr(0, 2) == ". ") {
      break;
    }
    //console.log(currentGram[0])
    //console.log(order)
    currentGram = txt.substr(
      Math.floor(Math.random() * txt.length - order - 1),
      order
    );
    //console.log(currentGram)
  }
  if (currentGram.substr(0, 2) != ". ") {
    currentGram = txt.substr(0, order);
  }
  var result = currentGram;
  //console.log(result)
  for (var i = 0; i < Math.floor(5000); i++) {
    var possibilities = ngrams[currentGram];
    if (!possibilities) {
      break;
    }
    var next = randomChoice(possibilities);
    result += next;
    currentGram = result.substring(result.length - order, result.length);
  }
  // //console.log(result);
  if (result.substr(0, 2) == ". ") {
    result = result.substring(2);
  }
  generateParagraphs(result);
}

function generateParagraphs(result) {
  paragraphSizes = [randNum(0, 3) + randNum(1, 4)];
  // split result into array based on periods
  var myarray = result.match(
    /(((Mr|Ms|Mrs|Dr|Capt|Col|Lt|St)\.\s+[A-Z])|["’“A-Z]).*?((Mr|Ms|Mrs|Dr|Capt|Col|Lt|St)\.\s+[A-Z].*?)?[.?!]+["’”]?(\s(?=[A-Z"])|$)/g
  );
  // for
  while (myarray.length != 0) {
    var numSentences = randNum(0, 3) + randNum(1, 4);
    // check if same size as last paragraph
    while (numSentences == paragraphSizes[paragraphSizes.length - 1]) {
      numSentences = randNum(0, 3) + randNum(1, 4);
    }
    paragraphSizes.push(numSentences);
    // new paragraph
    var paraText = "";
    for (var sentence = 0; sentence < numSentences; sentence++) {
      if (myarray.length > 0) {
        paraText += myarray[0];
        myarray.splice(0, 1);
      }
    }
    var node = document.createElement("P");
    node.className = "indented";
    var textnode = document.createTextNode(paraText);
    node.appendChild(textnode);
    textoutput.appendChild(node);
  }
}

function hidePreviousParagraphs() {
  var myarray = document.getElementsByClassName("indented");
  for (var each of myarray) {
    each.style.display = "none";
  }
}

function randomChoice(myArray) {
  return myArray[Math.floor(Math.random() * myArray.length)];
}

function randNum(lo, hi) {
  return Math.floor(Math.random() * hi - lo) + lo;
}

function getCustomText() {
  customText = prompt("Input your text here:");
  if (customText.length < 1) {
    return;
  }
  addToRecipe("Custom");
  txt += " " + customText;
  ngrams = buildMarkovChain(order, customText);
  ////console.log(ngrams);
}

function getText(someText) {
  for (var each of library) {
    if (someText == each.title) {
      txt += " " + each.text;
      break;
    }
  }
  addToRecipe(someText);
  ngrams = buildMarkovChain(order, txt);
  if (someText == "Blobfish") {
    console.log(ngrams);
  }
}

function addToRecipe(someText) {
  recipeArray.push(someText);
  var intro;
  if (recipeArray.length > 1) {
    intro = "Source texts: ";
  } else {
    intro = "Source text: ";
  }
  document.getElementById("myRecipe").innerHTML =
    intro + recipeArray.join(" + ");
}

function reset() {
  recipeArray = [];
  document.getElementById("myRecipe").innerHTML =
    "Click the buttons above (+Avengers, for example) to get started";
  ngrams = {};
  txt = "";
  generateText();
}
