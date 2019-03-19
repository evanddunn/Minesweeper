/*
 * Written by: Evan D Dunn      11/18/18
 * Summary:    Web-based minsweeper implementation using jQuery and JavaScript. 
 */
$(document).ready(function() {

    // declare global variables 
    let height, width, bombNum, sqsLeft, bombsLeft, timer, enable, firstClick, highscore; 

    // intialize hieght, width, and number of bombs, number of squares left and score.
    // initialize enable and first click flags to true
    height = 8;
    width = 8;
    bombNum = 15;
    sqsLeft = (height * width) - bombNum;
    enable = true;
    firstClick = true;
    highscore = 0;
    bombsLeft= bombNum;
    draw(); // draw a new board with initial values
    run();  // run the game

    // reset wen "reset" button is clicked
    $('button.reset-button').click(function() {reset();}); 

    // handlers for running the game including timer set up, mouse down and up functions, and clicking a square
    function run () {
        // reset timer on new game
        clearInterval(timer);
        $('p.timer').empty();
        $('p.timer').append('Time: ' +0);
        
        // suprised face on mousedown
        $('button.game-button').mousedown(function (){
            if (enable) {
                $('p.face').empty();
                $('p.face').append('<i class="far fa-surprise"></i>');
            }
        });

        // smile face on mouse back up
        $('button.game-button').mouseup(function (){
            if (enable) {
                $('p.face').empty();
                $('p.face').append('<i class="far fa-smile-beam"></i>');
            }
        });
        
        // handle first click of the game, flagging, and revealing squares
        $('button.game-button').click(function(e) {
            if (enable) {
                if(firstClick == true) { // start timer with first click on game board
                    clearInterval(timer);
                    let s = 0;
                    timer = setInterval(function myTimer() {
                        s++;
                        $('p.timer').empty();
                        $('p.timer').append('Time: ' + s);
                    }, 1000);
                    firstClick = false;
                }
                // handlers for flagging, revealing swuares around already revealed squares, 
                // and revealing a square respectively
                if(e.shiftKey) buttonFlagged($(this));
                else if($(this).data('checked') == true) buttonChecked($(this), $(this).attr('id'));
                else buttonHandler($(this), $(this).attr('id'));
            }
        })
    }
    
    // draw a gameboard with new values
    function draw() {
        let sqnumdat = 0;
        // max and minimum size requrements
        height = (height <= 30) ? height : 30;
        height = (height <  8)  ? 8      : height;
        width  = (width <= 40)  ? width  : 40;
        width  = (width  <  8)  ? 8      : width;
        // number of bombs can equal height*width - 1 at max
        bombNum = (bombNum >= (height*width)) ? (height*width) - 1 : bombNum;
        bombNum = (bombNum < 1) ? 1 : bombNum;
        bombsLeft = bombNum;
        sqsLeft = (height * width) - bombNum;
        // reset the number of bombs left to number of bombs
        $('p.bombsleft').empty();
        $('p.bombsleft').append('Bombs Left: ' +bombsLeft);
        $('div.game-body').empty();
        // build new board with all flags set to false
        for(let c = height; c > 0; c--) {
            for(let i = width; i > 0; i--) {
                $('div.game-body').append('<button class="game-button" id="gb' + sqnumdat + '">'+'-'+'</button>');
                $('button.game-button#gb' + sqnumdat +'').data('hasbomb', false);
                $('button.game-button#gb' + sqnumdat +'').data('checked', false);
                $('button.game-button#gb' + sqnumdat +'').data('flagged', false);
                sqnumdat++;
            }
            $('div.game-body').append('<br>')
        }
        // randomize bombs in the field
        for(let b = bombNum; b > 0; b--) {
            let rndm = Math.floor(Math.random() * (height * width));
            let button = $('button.game-button#gb' + rndm + '');
            let flag = $(button).data('hasbomb');
            if(flag == false) $(button).data('hasbomb', true);
            else b++;
            //$(button).css('background-color', 'red'); //show bombs for debuggin; usually comment
        }
        
        // asssign number values for all squares
        $('button.game-button').each(function() {
            let count = 0;
            id = $(this).attr('id');
            id = id.substring(2, id.length);
            id = parseInt(id);
            width = parseInt(width);
            height = parseInt(height);
            if($(this).data('hasbomb') == false){
                let leftbutt = $('button.game-button#gb' + (id - 1) +'');
                let rightbutt = $('button.game-button#gb' + (id + 1) +'');
                let topbutt = $('button.game-button#gb' + (id - width) +'');
                let topleftbutt = $('button.game-button#gb' + (id - width - 1) +'');
                let toprightbutt = $('button.game-button#gb' + (id - width + 1) +'');
                let botbutt = $('button.game-button#gb' + (id + width) +'');
                let botleftbutt = $('button.game-button#gb' + (id + width - 1) +'');
                let botrightbutt = $('button.game-button#gb' + (id + width + 1) +'');
                if(id % width == (width - 1)) {
                    toprightbutt = $(this);
                    rightbutt = $(this);
                    botrightbutt = $(this);
                }
                if(id % width == 0) {
                    topleftbutt = $(this);
                    leftbutt = $(this);
                    botleftbutt = $(this);
                }
                if( $(leftbutt).data('hasbomb') == true ) count++;        //left bomb
                if( $(rightbutt).data('hasbomb') == true ) count++;        //right bomb
                if( $(topbutt).data('hasbomb') == true ) count++;    //top bob
                if( $(topleftbutt).data('hasbomb') == true ) count++;//topleft bomb
                if( $(toprightbutt).data('hasbomb') == true ) count++;//topright bomb
                if( $(botbutt).data('hasbomb') == true ) count++;    //bot bomb
                if( $(botleftbutt).data('hasbomb') == true ) count++;//botleft bomb
                if( $(botrightbutt).data('hasbomb') == true ) count++;//botrightbomb
    
                $(this).data('bombcount', count);
            } else $(this).data('bombcount', -1);
        });
    }
    
    // handler for checking unchecked and unflagged squares
    function buttonHandler(button, id) {
        // return if button is null, has already beem revealved (checked), or flagged
        if(button == null) return;
        if($(button).data('flagged') == true) return;
        if($(button).data('checked') == true) return;
        else {$(button).data('checked', true); sqsLeft--;} // set square to checked
        if (sqsLeft <= 0) { //end game on last square
            endGame();
        }
        let count = $(button).data('bombcount'); // number of surrounding bombs
        id = id.substring(2, id.length);
        id = parseInt(id);
        let buttonArray = [ //store surrounding buttons
        $('button.game-button#gb' + (id - width - 1) +''), //topleftbutt
        $('button.game-button#gb' + (id - width) +''), //topbutt
        $('button.game-button#gb' + (id - width + 1) +''), //toprightbutt
        $('button.game-button#gb' + (id - 1) +''), //leftbutt
        $('button.game-button#gb' + (id + 1) +''),  //rightbutt
        $('button.game-button#gb' + (id + width - 1) +''), //botleftbutt
        $('button.game-button#gb' + (id + width) +''), // botbutt
        $('button.game-button#gb' + (id + width + 1) +'') //botrightbutt
        ];
        if(id < width) { //edge detection
            buttonArray[0] = null;
            buttonArray[1] = null;
            buttonArray[2] = null;
        }
        if (id >= ((width * height) - width)) {
            buttonArray[5] = null;
            buttonArray[6] = null;
            buttonArray[7] = null;
        }
        if (id % width == 0) {
            buttonArray[0] = null;
            buttonArray[3] = null;
            buttonArray[5] = null;
        } else if ((id + 1) % width == 0) {
            buttonArray[2] = null;
            buttonArray[4] = null;
            buttonArray[7] = null;
        }
        if(count > 0){       // if surrounding bombs > 0 reveal number and return
            $(button).text(count);
            return;
        } else if (count == 0){ // else if count == 0, recursively check all 8 surrounding squares
            $(button).text('\0');
            for (let i = 0; i < 8; i++) {
                id = $(buttonArray[i]).attr('id');
                if($(buttonArray[i]).data('bombcount') > 0){
                    $(buttonArray[i]).text($(buttonArray[i]).data('bombcount'));
                    if($(buttonArray[i]).data('checked') == false) {
                        $(buttonArray[i]).data('checked', true); 
                        sqsLeft--;
                    }
                }
                else if ($(buttonArray[i]).data('bombcount') == 0) {
                    $(buttonArray[i]).text('\0');
                    buttonHandler(buttonArray[i], id);
                } else if ($(buttonArray[i]).data('bombcount') < 0) {
                    return;
                }
            }
        } else if (count < 0) { // if square is bomb, end game
            if($(button).data('hasbomb') == true) { 
                endGame();
                return;
            }
        }
    }
    
    // handler for flagging square
    function buttonFlagged(button) {
            if($(button).data('checked') == true) return; // if already revealed return
        if($(button).data('flagged')){ // if already flagged, unflag
            $(button).text('-');
            $(button).data('flagged', false);
            bombsLeft++;
        } else { //else flag square
            if (bombsLeft > 0) {
                $(button).text('\0');
                $(button).append('<i class="fab fa-font-awesome-flag"></i>');
                bombsLeft--;
                $(button).data('flagged', true);
            }
        }
        if(bombsLeft == 0 && sqsLeft == 0) {
            endGame();
        }
        $('p.bombsleft').empty(); // display num of bombs left
        $('p.bombsleft').append('Bombs Left: ' +bombsLeft);
    }
    
    // handler for checking the surrounding squares of am already checked square
    function buttonChecked(button, id) {
        id = id.substring(2, id.length);
        id = parseInt(id);
        let buttonArray = [ //get 8 surrounding buttons
            $('button.game-button#gb' + (id - width - 1) +''), //topleftbutt
            $('button.game-button#gb' + (id - width) +''), //topbutt
            $('button.game-button#gb' + (id - width + 1) +''), //toprightbutt
            $('button.game-button#gb' + (id - 1) +''), //leftbutt
            $('button.game-button#gb' + (id + 1) +''),  //rightbutt
            $('button.game-button#gb' + (id + width - 1) +''), //botleftbutt
            $('button.game-button#gb' + (id + width) +''), // botbutt
            $('button.game-button#gb' + (id + width + 1) +'') //botrightbutt
            ];
            let count = 0;
        // if number of surrounding buttons == number on checked square, reveal surrounding squares
        // works even if flags are incorrect and would cause user to lose game!
        for(let i = 0; i < 8; i++){
            if($(buttonArray[i]).data('flagged') == true) count++;
        }
        if(count == $(button).data('bombcount')) {
            for(let i = 0; i < 8; i++) {
                buttonHandler($(buttonArray[i]), $(buttonArray[i]).attr('id'));
            }
        }

    }

    // ending a game both for winning and losing
    function endGame() {
        // reveal bombs
        for(let i = 0; i < (height * width); i++) {
            if($('button.game-button#gb' + i +'').data('hasbomb') == true) {
                $('button.game-button#gb' + i +'').css('background', 'red');
                $('button.game-button#gb' + i +'').text('\0');
                $('button.game-button#gb' + i +'').append('<i class="fas fa-bomb"></i>');
            }
        }
        // if all non-bomb squares revealed, you win!
        if(sqsLeft == 0){
            //alert('Wowo you won! Click OK to Reset');

            // freeze board and timer
            clearInterval(timer);
            enable = false;
            let score = $('p.timer').text();
            score = score.substring(5, score.length);
            score = parseInt(score);
            // set new highscore
            if(highscore == 0) { 
                highscore = score;
                $('p.highscore').empty();
                $('p.highscore').append('Highscore: ' + highscore);
            } else if(score < highscore) {
                highscore = score;
                $('p.highscore').empty();
                $('p.highscore').append('Highscore: ' + highscore);
            }
            // grinning face emoji for win
            $('p.face').empty();
            $('p.face').append('<i class="far fa-grin-stars"></i>');
            $('button.reset-button').click(function() {reset();});
        } else { // else you lose the game
            //alert('You lost :( Click OK to Reset')

            // freeze board and timer
            clearInterval(timer);
            enable = false;
            // dead face emoji for loss
            $('p.face').empty();
            $('p.face').append('<i class="far fa-dizzy"></i>');
            $('button.reset-button').click(function() {reset();});
        }
    }
    
    // handler for reseting the game
    function reset() {
        // reset timer and face emoji
        $('p.timer').empty();
        $('p.timer').append(0);
        $('p.face').empty();
        $('p.face').append('<i class="far fa-smile-beam"></i>');
        // get new values for board
        height = $('input.height').focus().val();
        width = $('input.width').focus().val();
        bombNum = $('input.bombNum').focus().val();
        // reset enable and first click flags
        firstClick = true;
        enable = true;
        // draw and run new game
        draw();
        run();
    }

});