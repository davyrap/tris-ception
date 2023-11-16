//==============INIZIALIZZAZIONE=======================
function CreaTris(tabId)
{
    buttonId = tabId * 9;
    tabella = "<table id='tab" + tabId + "' class='tab'>"
    for (let i = 0, j; i < 3; i++) {
        tabella += "<tr><div class='hider' id='hid" + tabId + "'></div>";
        for (j = 0; j < 3; j++) {
            tabella += "<td><button id='btn" + buttonId + "' onclick='Write(" + buttonId + ")'></button></td>";
            buttonId++;
        }
        tabella += "</tr>";
    }
    tabella += "</table>";    
    
    return tabella;
}

function CreaGigaTris()
{
    tabella = "<table id='GigaTris'>";
    for (let i = 0, j; i < 3; i++) {
        tabella += "<tr>";
        for (j = 0; j < 3; j++) {
            tabella += "<td>" + CreaTris(i * 3 + j) + "</td>";
        }
        tabella += "</tr>";
    }
    tabella += "</table>"; 
    
    return tabella;
}


function Start()
{
    document.getElementById("musicLoop").play();
    document.getElementById("starter").style.display = "none";
    document.getElementById("tableHolder").classList.add("fadeIn");
    document.getElementById("tableHolder").style.visibility = "visible";
    document.getElementById("apriAudioBtn").classList.add("fadeIn");
    document.getElementById("apriAudioBtn").style.visibility = "visible";
    document.getElementById("turnoDi").classList.add("fadeIn");
    document.getElementById("turnoDi").style.visibility = "visible";
}

function Restart()
{
    window.location = "game.html";
}

window.onload = document.getElementById("tableHolder").innerHTML = CreaGigaTris();

//==============LOGICA DI GIOCO=======================

/*
True = X
False = O
*/
turno = true;
tilesConcluse = [];
gameover = false;
// con nodeJs devo inviare buttonId e tileToActivate
function Write(buttonId, tileToActivate = -1)    // chiamata da ogni button
{
    var button = document.getElementById("btn" + buttonId);
    lblTurno = document.getElementById("turnoDi");
    if(turno){
        button.innerHTML = "X";
        lblTurno.innerHTML = "Scrive O";
    }else{
        button.innerHTML = "O";
        lblTurno.innerHTML = "Scrive X";
    }
    button.disabled = true;
    ClickSFX();

    tileId = Math.floor(buttonId/9);    // calcolo in che tile risiede il bottone premuto

    if(tileToActivate == -1)
    {
        tileToActivate = buttonId%9;
    }
    console.log(tileToActivate);

    victory = CheckForVictory(buttonId);

    if(victory)
    {
        tilesConcluse.push(tileId);
        SetBigTile(tileId, turno);
    }
    else if(IsTileFull(tileId))   // non c'è stato un tris in tab tileId
    {
        tilesConcluse.push(tileId);
        document.getElementById("tab" + tileId).innerHTML = "<div class='winLabel' id='win" + tileId + "'>/</div>";   
        if(useSFX) document.getElementById("simpleTrisFX").play();

        if(tilesConcluse.length == 9)  // se questa casella è l'ultima e non c'è tris-ception
        {
            EndGame()

            // debbo spareggiare
            Spareggio();
        }
    }

    if(!gameover) DisableAllTilesExcept(tileToActivate);

    // qui invia al server buttonId e tileToActivate

    turno = !turno;
}

function DisableAllTilesExcept(tileToEnable)
{
    for(let i = 0; i < 9; i++)      // le disattivo tutte
    {
        if(!tilesConcluse.includes(i))
        {
            document.getElementById("tab" + i).classList.add("blur");
            document.getElementById("hid" + i).style.display = "block";
        }
    }
    
    // attivo solo quella selezionata
    while(tilesConcluse.includes(tileToEnable))     // se sto puntando ad una casella conclusa
    {
        tileToEnable = Math.floor(Math.random() * 9);   // estrai non ne becco una non conclusa
    }

    // abilito solo la tab da giocare
    document.getElementById("tab" + tileToEnable).classList.remove("blur");
    document.getElementById("hid" + tileToEnable).style.display = "none";
}

function IsTileFull(tileIndex)
{
    i = 0;
    isFull = true;
    while(i < 9 && isFull)
    {
        el = document.getElementById("btn" + (tileIndex * 9 + i)).innerHTML;
        if(el != "X" && el != "O") isFull = false   // se c'è un elemento che non è stato ancora premuto
        i++;
    }
    return isFull;
}

function CheckForVictory(buttonId)
{
    isTris = false;
    switch (buttonId % 9) {
        case 0:
            if(btn(buttonId) == btn(buttonId+1) && btn(buttonId) == btn(buttonId+2) && btn(buttonId) != "no") {isTris = true; SetTrisLine(0, -1, 0);}
            else if(btn(buttonId) == btn(buttonId+3) && btn(buttonId) == btn(buttonId+6) && btn(buttonId) != "no") {isTris = true; SetTrisLine(-1, 0, 90);}
            else if(btn(buttonId) == btn(buttonId+4) && btn(buttonId) == btn(buttonId+8) && btn(buttonId) != "no") {isTris = true; SetTrisLine(0, 0, 45);}
        break;
        case 1:
            if(btn(buttonId) == btn(buttonId+1) && btn(buttonId) == btn(buttonId-1) && btn(buttonId) != "no") {isTris = true; SetTrisLine(0, -1, 0);}
            else if(btn(buttonId) == btn(buttonId+3) && btn(buttonId) == btn(buttonId+6) && btn(buttonId) != "no") {isTris = true; SetTrisLine(0, 0, 90);}
        break;
        case 2:
            if(btn(buttonId) == btn(buttonId-1) && btn(buttonId) == btn(buttonId-2) && btn(buttonId) != "no") {isTris = true; SetTrisLine(0, -1, 0);}
            else if(btn(buttonId) == btn(buttonId+3) && btn(buttonId) == btn(buttonId+6) && btn(buttonId) != "no") {isTris = true; SetTrisLine(1, 0, 90);}
            else if(btn(buttonId) == btn(buttonId+2) && btn(buttonId) == btn(buttonId+4) && btn(buttonId) != "no") {isTris = true; SetTrisLine(0, 0, -45);}
        break;
        case 3:
            if(btn(buttonId) == btn(buttonId+1) && btn(buttonId) == btn(buttonId+2) && btn(buttonId) != "no") {isTris = true; SetTrisLine(0, 0, 0);}
            else if(btn(buttonId) == btn(buttonId-3) && btn(buttonId) == btn(buttonId+3) && btn(buttonId) != "no") {isTris = true; SetTrisLine(-1, 0, 90);}
        break;
        case 4:
            if(btn(buttonId) == btn(buttonId+1) && btn(buttonId) == btn(buttonId-1) && btn(buttonId) != "no") {isTris = true; SetTrisLine(0, 0, 0);}
            else if(btn(buttonId) == btn(buttonId+3) && btn(buttonId) == btn(buttonId-3) && btn(buttonId) != "no") {isTris = true; SetTrisLine(0, 0, 90);}
            else if(btn(buttonId) == btn(buttonId+4) && btn(buttonId) == btn(buttonId-4) && btn(buttonId) != "no") {isTris = true; SetTrisLine(0, 0, 45);}
            else if(btn(buttonId) == btn(buttonId+2) && btn(buttonId) == btn(buttonId-2) && btn(buttonId) != "no") {isTris = true; SetTrisLine(0, 0, -45);}
        break;
        case 5:
            if(btn(buttonId) == btn(buttonId-1) && btn(buttonId) == btn(buttonId-2) && btn(buttonId) != "no") {isTris = true; SetTrisLine(0, 0, 0);}
            else if(btn(buttonId) == btn(buttonId+3) && btn(buttonId) == btn(buttonId-3) && btn(buttonId) != "no") {isTris = true; SetTrisLine(1, 0, 90);}
        break;
        case 6:
            if(btn(buttonId) == btn(buttonId+1) && btn(buttonId) == btn(buttonId+2) && btn(buttonId) != "no") {isTris = true; SetTrisLine(0, 1, 0);}
            else if(btn(buttonId) == btn(buttonId-3) && btn(buttonId) == btn(buttonId-6) && btn(buttonId) != "no") {isTris = true; SetTrisLine(-1, 0, 90);}
            else if(btn(buttonId) == btn(buttonId-2) && btn(buttonId) == btn(buttonId-4) && btn(buttonId) != "no") {isTris = true; SetTrisLine(0, 0, -45);}
        break;
        case 7:
            if(btn(buttonId) == btn(buttonId-1) && btn(buttonId) == btn(buttonId+1) && btn(buttonId) != "no") {isTris = true; SetTrisLine(0, 1, 0);}
            else if(btn(buttonId) == btn(buttonId-3) && btn(buttonId) == btn(buttonId-6) && btn(buttonId) != "no") {isTris = true; SetTrisLine(0, 0, 90);}
        break;
        case 8:
            if(btn(buttonId) == btn(buttonId-1) && btn(buttonId) == btn(buttonId-2) && btn(buttonId) != "no") {isTris = true; SetTrisLine(0, 1, 0);}
            else if(btn(buttonId) == btn(buttonId-3) && btn(buttonId) == btn(buttonId-6) && btn(buttonId) != "no") {isTris = true; SetTrisLine(1, 0, 90);}
            else if(btn(buttonId) == btn(buttonId-4) && btn(buttonId) == btn(buttonId-8) && btn(buttonId) != "no") {isTris = true; SetTrisLine(0, 0, 45);}
        break;
    }
    return isTris;
}

function SetBigTile(tileId, winner)
{
    simbolo = "";
    if(winner) simbolo = "X";
    else simbolo = "O";
    document.getElementById("tab" + tileId).innerHTML = "<div class='winLabel' id='win" + tileId + "'>" + simbolo + "</div>";
    if(useSFX) document.getElementById("simpleTrisFX").play();

    checkFor = "win";
    victory = CheckForVictory(tileId)
    checkFor = "btn";

    if(victory)
    {
        document.getElementById("turnoDi").innerHTML = "Vince " + simbolo + "!";
        EndGame();
        gameover = true;
    }

    else if(tilesConcluse.length == 9)  // non c'è stato un tris nel grande tris
    {
        EndGame()

        // debbo spareggiare
        Spareggio();
    }
}

function Spareggio()
{
    xVictories = 0;
    oVictories = 0;
    for(i = 0; i < 9; i++)
    {
        if(document.getElementById("win" + i).innerHTML == "X") xVictories++;
        else if(document.getElementById("win" + i).innerHTML == "O") oVictories++
    }

    if(xVictories > oVictories)
    {
        document.getElementById("turnoDi").innerHTML = "X vince allo spareggio! Ha conquistato più riquadri!";
    }
    else if(oVictories > xVictories)
    {
        document.getElementById("turnoDi").innerHTML = "O vince allo spareggio! Ha conquistato più riquadri!";
    }
    else
    {
        document.getElementById("turnoDi").innerHTML = "È un pareggio!";
    }

    gameover = true;
}

function EndGame()
{
    for(i = 0; i < 9; i++)
        {
            document.getElementById("hid" + i).style.display = "block"; // blocco tutto così non si gioca più
            document.getElementById("tab" + i).classList.remove("blur");
        }
    document.getElementById("musicLoop").pause();
    document.getElementById("endgameSong").play();
    document.getElementById("restartBtn").style.display = "block";
}

checkFor = "btn";
function btn(id)
{
    ret = "";
    try{
        ret = document.getElementById(checkFor + id).textContent;
        if(ret == "/") ret = "no";
    }
    catch{
        ret = "no";
    }
    return ret
}

function SetTrisLine(xMultiplier, yMultiplier, orientationOffset)
{
    if(checkFor == "win")   // ovvero "fallo solo per il super tris"
    {
        xOffset = 11.55;
        yOffset = 11.5;
        if(IsMobileDevice())
        {
            xOffset = 29.5;
            yOffset = 29.5;
        }
        linea = document.getElementById("line");
        linea.style.translate = xMultiplier * xOffset + "vw " + yMultiplier * yOffset + "vw";
        linea.style.transform = "rotate(" + orientationOffset + "deg)";
        linea.style.display = "block";
        linea.classList.add("trisAnimation");
    }
}

//====================AUDIO MANAGEMENT=================
useSFX = true;

function SetAudioVisibility(visibility)
{
    document.getElementById("blurrer").style.display = visibility;
    document.getElementById("audioManager").style.display = visibility;
}

function ToggleSFX()
{
    useSFX = !useSFX;
}

function ChangeVolume()
{
    document.getElementById("musicLoop").volume = document.getElementById("volSlider").value / 100;
    document.getElementById("endgameSong").volume = document.getElementById("volSlider").value / 100;
}

function ClickSFX()
{
    if(useSFX) document.getElementById("buttonClickFX").play();
}


//===================MOBILE DETECTION==================

function IsMobileDevice()
{
    if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i))
        {
            return true;
        }
    return false
}