document.addEventListener('DOMContentLoaded', () => {
    let isGameOver = false;
    let platformCount = 5;
    let platforms = []
    let isJumping = true;
    //only jump if jumping is false
    let startPoint = 150;
    let upTimerID
    let downTimerID
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let doodlerLeftSpace = 50
    let doodlerBottomSpace = startPoint;
    let isGoingLeft
    let isGoingRight
    let leftTimerID
    let rightTimerID
    let score = 0;
    //class to create platforms 
    class Platform {
        constructor(newPlatformBottom){
            this.bottom = newPlatformBottom;
            this.left = Math.random() * 315;
            this.visual = document.createElement('div')

            const visual = this.visual;
            visual.classList.add('platform');
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    function moveLeft() {
        if(isGoingRight){
            clearInterval(rightTimerID)
            isGoingRight = false
        }
        isGoingLeft = true

        leftTimerID = setInterval(function (){
            if(doodlerLeftSpace >= 0){
                doodlerLeftSpace -= 5
            doodler.style.left = doodlerLeftSpace + 'px'
            }
            else {
                moveRight()
            }
        }, 30)
    }

    function moveStraight(){

        clearInterval(rightTimerID)
        clearInterval(leftTimerID)
        isGoingRight = false
        isGoingLeft = false
    }

    function moveRight() {
        if(isGoingLeft){
            clearInterval(leftTimerID)
            isGoingLeft = false
        }
        isGoingRight = true

        rightTimerID = setInterval(function (){
            if(doodlerLeftSpace <= 340){
            doodlerLeftSpace += 5
            doodler.style.left = doodlerLeftSpace + 'px'
        }
        else {
            moveLeft()
        }
        }, 30)
    }
    function createPlatforms(){
        for(let i = 0; i < platformCount; i++){
            let platformGap = 600 / platformCount;
            let newPlatformBottom = 100 + i * platformGap;
            let newPlatform = new Platform(newPlatformBottom);
            platforms.push(newPlatform)

        }
    }

    
  
    function jump(){
        //timer id is how to stop interval 
        isJumping = true;
        clearInterval(downTimerID)
        upTimerID = setInterval(function (){
            doodlerBottomSpace += 20
            doodler.style.bottom = doodlerBottomSpace + 'px'

            if(doodlerBottomSpace > startPoint + 200){
                fall()
            }
        }, 30)
    }

    function fall(){
        isJumping = false;
        clearInterval(upTimerID)
        downTimerID = setInterval(function () {
            doodlerBottomSpace -= 5;
            doodler.style.bottom = doodlerBottomSpace + 'px'
            if(doodlerBottomSpace <= 0){
                gameOver()
            }
            platforms.forEach(platform => {
                if( (doodlerBottomSpace >= platform.bottom)&& 
                (doodlerBottomSpace <= platform.bottom + 15) &&
                ((doodlerLeftSpace + 60) >= platform.left) && 
                (doodlerLeftSpace <= (platform.left + 85)) && !isJumping
                ){
                    console.log("landed")
                    startPoint = doodlerBottomSpace
                    jump()

                }

            })
        }, 30)
    }

    function createDoodler(){
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        //move elements
        doodlerLeftSpace = platforms[0].left //get the left
        doodler.style.left = doodlerLeftSpace + 'px'
        doodler.style.bottom = doodlerBottomSpace + 'px'
    }

    function movePlatforms(){
        //if doodler is in a certain position 
        if (doodlerBottomSpace > 200){
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if(platform.bottom < 10){
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    score++;
                    let newPlatform = new Platform(600) //BOTTOM SPACE appear at top of grid
                    platforms.push(newPlatform)
                }
            })
        }
        
    }

    function control(e){
        if(e.key === "ArrowLeft"){
            moveLeft()
        }
        else  if(e.key === "ArrowRight"){
            moveRight()
        }
        else if(e.key === "ArrowUp"){
            moveStraight()
        }
    }



    function gameOver(){
        console.log("game over")
        isGameOver = true;

        while (grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score;
        clearInterval(upTimerID)
        clearInterval(downTimerID)
        clearInterval(leftTimerID)
        clearInterval(rightTimerID)
        isGoingRight = false
        isGoingLeft = false
    }
    function start() {
        if(!isGameOver){
            createPlatforms()

            createDoodler()
            setInterval(movePlatforms, 30)
            jump()
            document.addEventListener('keyup', control)
        }
    }

    start()
})