document.body.onload = createCell;
let minePositions = [];
let flagPositions = [];
let stringNeighbours = [];
var countClickLeft = 0, status = 0, nrCellsFilled = 0, nrFlags = 0;
var message = document.getElementById("message");
var reloadButton = document.getElementById("button");

function createCell() { 
	createTenMines();
	for (var i = 1; i <= 9; ++i) {
		for (var j = 1; j <= 9; ++j) {
			var object = document.getElementById("container");
			const div = document.createElement("div");
			div.onmousedown = function() {onclick(event, div)};
			div.setAttribute("id", "C" + i + j);
			object.appendChild(div);
		}
	}
}

function onclick(event, div) {
	if (status == 0) {
		if (event.button == 0) { 
			leftClick(div);
			++countClickLeft;
		} else if (event.button == 2) { 
			rightClick(div);
		}
		checkGameStatus();
	} 
}

function leftClick(div) {
	if (countClickLeft == 0) { //ca pe prima pozitie sa nu ai o mina
		prohibitedFirstClickToBeMine(div);
	} 
	if (div.innerHTML == "") {
		div.style.backgroundColor = "rgb(255, 255, 128)";
		if (verifyElement(div) == true) {
			printMine(div);
			status = 1;
		} else {
			analyzeNumber(div);
		}
	}
}

function rightClick(div) { //am terminat cu acesta 
	if (div.innerHTML == "") {
		printFlag(div);
		flagPositions.push(div.id);
	} else if (div.innerHTML == "F") {
		deleteFlag(div);
	}
}

function checkGameStatus() {
	if (status == 1) {
		checkCorrectFlags();
		printFinalMines();
		message.innerHTML = "GAME OVER";
		reloadButton.style.display = "block";
	} else if (status == 0 && nrFlags == 10 && nrCellsFilled == 71) {
		message.innerHTML = "CONGRATULATIONS! YOU WON THE GAME!";
		reloadButton.style.display = "block";
	}
}

function prohibitedFirstClickToBeMine(div) {
	var toChange = minePositions.indexOf(div.id);
	if (toChange != -1) {
		minePositions.splice(toChange, 1);
		var newPosition = createRandomPosition();
		while (newPosition == div.id) {
			newPosition = createRandomPosition();
		}
		minePositions.push(newPosition);
	}
}

function verifyElement(div) {
	if (minePositions.indexOf(div.id) != -1) {
		return true;
	}
	return false;
}


//FLAG

function checkCorrectFlags() {
	var i = 0;
	while (i < flagPositions.length) {
		var index = minePositions.indexOf(flagPositions[i]);
		if (index == -1) {
			var div = document.getElementById(flagPositions[i]);
			deleteFlag(div);
		} else {
			++i;
		}
	}
}

function printFlag(div) {
	div.style.backgroundColor = "cyan";
	var text = document.createTextNode("F");
	div.appendChild(text);
	++nrFlags;
}

function deleteFlag(div) {
	div.style.backgroundColor = "rgb(179, 255, 102)";
	div.innerHTML = "";
	var deleteFlag = flagPositions.indexOf(div.id);
	flagPositions.splice(deleteFlag, 1);
}

// MINES

function createTenMines() {
	while (minePositions.length < 10) {
		addMine();
	}
}

function addMine() {
	var element = createRandomPosition();
	while (minePositions.indexOf(element) != -1) {
		element = createRandomPosition();
	}
	minePositions.push(element);
}

function createRandomPosition() {
	var digit1 = getRandomNumber(1, 9);
	var digit2 = getRandomNumber(1, 9);
	var position = "C" + digit1 + digit2;
	return position;
}

function getRandomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function printFinalMines() {
	for (var i = 0; i < 10; ++i) {
		var div = document.getElementById(minePositions[i]);
		if (div.innerHTML == "") {
			printMine(div);
		}
	}
}

function printMine(div) {
	div.style.backgroundColor = "plum";
	var text = document.createTextNode("M");
	div.appendChild(text);
}

//NUMBERS

function analyzeNumber(div) {
	printNumber(div);
	if (div.innerHTML == "0") {
		if (stringNeighbours.length == 0) {
			stringNeighbours.push(div.id);
			getNeighbours(div.id);
			getExplosionArea();
		} else {
			getNeighbours(div.id);
		}
	}
}

function printNumber(div) {
	if (div.innerHTML == "" || div.innerHTML == "F") {
		if (div.innerHTML == "F") {
			deleteFlag(div);
		}
		div.style.backgroundColor = "rgb(255, 255, 128)";
		var number = getNrMinesNearby(div);
		var print = document.createTextNode(number);
		div.appendChild(print);
		++nrCellsFilled;
	}
}

function getExplosionArea() {
	for (var i = 0; i < stringNeighbours.length; ++i) {
		var element = document.getElementById(stringNeighbours[i]);
		analyzeNumber(element);
	}
	while (stringNeighbours.length > 0) {
		stringNeighbours.pop();
	}
}

function getNrMinesNearby(div) { 
	var i = parseInt((div.id).charAt(1));
	var j = parseInt((div.id).charAt(2));
	var nrMines = 0;
	for (var k = -1; k < 2; ++k) {
		if (minePositions.indexOf("C" + (i + 1) + (j + k)) != -1) {
			++nrMines;
		}
		if (minePositions.indexOf("C" + (i - 1) + (j + k)) != -1) {
			++nrMines;
		}
	}
	if (minePositions.indexOf("C" + i + (j - 1)) != -1) {
		++nrMines;
	}
	if (minePositions.indexOf("C" + i + (j + 1)) != -1) {
		++nrMines;
	}
	return nrMines;
}

function verifyNeighbour(element) {
	if (stringNeighbours.indexOf(element) != -1) {
		//exista 
		return true;
	} 
	return false;
}

function getNeighbours(position) {
	var x = parseInt(position.charAt(1));
	var y = parseInt(position.charAt(2));
	for (var k = -1; k < 2; ++k) {
		if ((x + 1) <= 9 && (y + k) <= 9 && (y + k) > 0) {
			var v1 = "C" + (x + 1) + (y + k);
			if (verifyNeighbour(v1) == false) {
				stringNeighbours.push(v1);
			}
		}
		if ((x - 1) > 0  && (y + k) <= 9 && (y + k) > 0) {
			var v2 = "C" + (x - 1) + (y + k);
			if (verifyNeighbour(v2) == false) {
				stringNeighbours.push(v2);
			}
		}
	}
	if ((y + 1) <= 9) {
		var v3 = "C" + x + (y + 1);
		if (verifyNeighbour(v3) == false) {
			stringNeighbours.push(v3);
		}
	}
	if ((y - 1) > 0) {
		var v4 = "C" + x + (y - 1);
		if (verifyNeighbour(v4) == false) {
			stringNeighbours.push(v4);
		}
	}
}