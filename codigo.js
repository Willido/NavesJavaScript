function initCanvas(){
    var ctx = document.getElementById('my_canvas').getContext('2d');
    var backgroundImage = new Image();
    var naveImage   = new Image(); // nave
    var enemiespic1  = new Image(); // enemigo 1
    var enemiespic2 = new Image(); // enemigo 2

   
    backgroundImage.src = "imagenes/background-galaxia.jpg"; 
    naveImage.src       = "imagenes/spaceship-pic.png"; 
    // Enemigos fotos
    enemiespic1.src     = "imagenes/enemigo1.png";
    enemiespic2.src     = "imagenes/enemigo2.png"; 
    
    // ancho y alto (canvas)
    var cW = ctx.canvas.width; // 750px 
    var cH = ctx.canvas.height;// 590px

    // plantilla para naves
    var enemyTemplate = function(options){
        return {
            id: options.id || '',
            x: options.x || '',
            y: options.y || '',
            w: options.w || '',
            h: options.h || '',
            image: options.image || enemiespic1
        }
    }

    // Para reducir una función repetitiva o dos, se realizan algunos cambios en la forma de crear enemigos.
    var enemies = [
                   new enemyTemplate({id: "enemigo1", x: 100, y: -20, w: 50, h: 30}),
                   new enemyTemplate({id: "enemigo2", x: 225, y: -20, w: 50, h: 30}),
                   new enemyTemplate({id: "enemigo3", x: 350, y: -20, w: 80, h: 30}),
                   new enemyTemplate({id: "enemigo4", x: 100, y: -70, w: 80, h: 30}),
                   new enemyTemplate({id: "enemigo5", x: 225, y: -70, w: 50, h: 30}),
                   new enemyTemplate({id: "enemigo6", x: 350, y: -70, w: 50, h: 30}),
                   new enemyTemplate({id: "enemigo7", x: 475, y: -70, w: 50, h: 30}),
                   new enemyTemplate({id: "enemigo8", x: 600, y: -70, w: 80, h: 30}),
                   new enemyTemplate({id: "enemigo9", x: 475, y: -20, w: 50, h: 30}),
                   new enemyTemplate({id: "enemigo10",x: 600, y: -20, w: 50, h: 30}),

                   // Segundo grupo de enemigos
                   new enemyTemplate({ id: "enemigo11", x: 100, y: -220, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemigo12", x: 225, y: -220, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemigo13", x: 350, y: -220, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemigo14", x: 100, y: -270, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemigo15", x: 225, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemigo16", x: 350, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemigo17", x: 475, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemigo18", x: 600, y: -270, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemigo19", x: 475, y: -200, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemigo20", x: 600, y: -200, w: 50, h: 30, image: enemiespic2 })
                  ];
    // Esto permite representar más enemigos sin necesidad de una función por conjunto de enemigos.

    // Esto también obliga a los enemigos a comprobar si están golpeando al jugador.
    var renderEnemies = function (enemyList) {
        for (var i = 0; i < enemyList.length; i++) {
            console.log(enemyList[i]);
            ctx.drawImage(enemyList[i].image, enemyList[i].x, enemyList[i].y += .5, enemyList[i].w, enemyList[i].h);
            // Detecta cuando las naves alcanzan un nivel inferior
            launcher.hitDetectLowerLevel(enemyList[i]);
        }
    }

    function Launcher(){
        //ubicación de balas
        this.y = 500, 
        this.x = cW*.5-25, 
        this.w = 100, 
        this.h = 100,   
        this.direccion, 
        this.bg="white", //color de las balas
        this.misiles = [];

         // Si desea utilizar diferentes fuentes o mensajes para el jugador que pierde, puede cambiarlo en consecuencia.
         this.gameStatus = {
            over: false, 
            message: "",
            fillStyle: 'red',
            font: 'italic bold 36px Arial, sans-serif',
        }

        this.render = function () {
            if(this.direccion === 'left'){
                this.x-=5;
            } else if(this.direccion === 'right'){
                this.x+=5;
            }else if(this.direccion === "downArrow"){
                this.y+=5;
            }else if(this.direccion === "upArrow"){
                this.y-=5;
            }
            ctx.fillStyle = this.bg;
            ctx.drawImage(backgroundImage, 10, 10); 
            ctx.drawImage(naveImage,this.x,this.y, 100, 90); // Necesitamos asegurarnos de que la nave espacial esté en la misma ubicación que las balas.

            for(var i=0; i < this.misiles.length; i++){
                var m = this.misiles[i];
                ctx.fillRect(m.x, m.y-=5, m.w, m.h); //dirección de las balas
                this.hitDetect(this.misiles[i],i);
                if(m.y <= 0){ // Si un misil sobrepasa los límites del canvas, retírelo.
                    this.misiles.splice(i,1); // empalmar ese misil array de misiles 
                }
            }
            // Esto pasa si ganas
            if (enemies.length === 0) {
                clearInterval(animateInterval); // Detener el bucle de animación del juego
                ctx.fillStyle = 'yellow';
                ctx.font = this.gameStatus.font;
                ctx.fillText('Ganaste!', cW * .5 - 80, 50);
            }
        }
        // Detectar impacto de las balas
        this.hitDetect = function (m, mi) {
            console.log('crush');
            for (var i = 0; i < enemies.length; i++) {
                var e = enemies[i];
                if(m.x+m.w >= e.x && 
                   m.x <= e.x+e.w && 
                   m.y >= e.y && 
                   m.y <= e.y+e.h){
                    this.misiles.splice(this.misiles[mi],1); // Retire el misil
                    enemies.splice(i, 1); // Elimina al enemigo que golpeó el misil
                    document.querySelector('.barra').innerHTML = "Destruido el "+ e.id+ " ";
                }
            }
        }
        // Preguntar a la nave del jugador si un enemigo ha pasado o ha golpeado la nave del jugador
        this.hitDetectLowerLevel = function(enemy){
            // Si la ubicación del enemigo es superior a 550, sabemos que pasó el nivel inferior
            if(enemy.y > 550){
                this.gameStatus.over = true;
                this.gameStatus.message = 'Dejaste pasar el enemigo!';
            }
            // Esto detecta un choque de la nave con enemigos
            //console.log(this);
            // this.y -> dónde está la ubicación de la nave espacial
            if(enemy.id === 'enemy3'){
                
                console.log(this.x);
            }
            // a) si enemy y es mayor que this.y - 25 => entonces sabemos que hay una colisión
            // b) si enemy x es menor que this.x + 45 && enemy x > this.x - 45 entonces sabemos que hay una colisión
            if ((enemy.y < this.y + 25 && enemy.y > this.y - 25) &&
                (enemy.x < this.x + 45 && enemy.x > this.x - 45)) { // Comprobando si el enemigo está a la izquierda o derecha de la nave espacial
                    this.gameStatus.over = true;
                    this.gameStatus.message = 'Perdiste!'
                }

            if(this.gameStatus.over === true){  
                clearInterval(animateInterval); // detener el bucle de animación
                ctx.fillStyle = this.gameStatus.fillStyle; // establecer el color del texto
                ctx.font = this.gameStatus.font;
                // mostrar texto en canvas
                ctx.fillText(this.gameStatus.message, cW * .5 - 80, 50); // texto x , y
            }
        }
    }
    
    var launcher = new Launcher();
    function animate(){
        ctx.clearRect(0, 0, cW, cH);
        launcher.render();
        renderEnemies(enemies);
    }
    var animateInterval = setInterval(animate, 6);
    
    var left_btn  = document.getElementById('left_btn');
    var right_btn = document.getElementById('right_btn');
    var fire_btn  = document.getElementById('fire_btn'); 

   document.addEventListener('keydown', function(event) {
        if(event.keyCode == 37) // flecha hacia la izquierda
        {
         launcher.direccion = 'left';  
            if(launcher.x < cW*.2-130){
                launcher.x+=0;
                launcher.direccion = '';
            }
       }    
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 37)
        {
         launcher.x+=0;
         launcher.direccion = '';
        }
    }); 

    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 39) // flecha hacia la derecha
        {
         launcher.direccion = 'right';
         if(launcher.x > cW-110){
            launcher.x-=0;
            launcher.direccion = '';
         }
        
        }
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 39) // flecha hacia la derecha
        {
         launcher.x-=0;   
         launcher.direccion = '';
        }
    }); 

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 38) // flecha hacia la derecha
         {
           launcher.direccion = 'upArrow';  
           if(launcher.y < cH*.2-80){
              launcher.y += 0;
              launcher.direccion = '';
            }
         }
    });

    document.addEventListener('keyup', function(event){
         if(event.keyCode == 38) // flecha hacia la derecha
         {
           launcher.y -= 0;
           launcher.direccion = '';
         }
    });

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 40) // flecha hacia abajo
         {
           launcher.direccion = 'downArrow';  
          if(launcher.y > cH - 110){
            launcher.y -= 0;
            launcher.direccion = '';
           }
         }
    });
    document.addEventListener('keyup', function(event){
         if(event.keyCode == 40) // flecha hacia abajo
         {
           launcher.y += 0;
           launcher.direccion = '';
         }
    });

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 80) // reinicio del juego
         {
          location.reload();
         }
    });

    // botones de control
    left_btn.addEventListener('mousedown', function(event) {
        launcher.direccion = 'left';
    });

    left_btn.addEventListener('mouseup', function(event) {
        launcher.direccion = '';
    });

    right_btn.addEventListener('mousedown', function(event) {
        launcher.direccion = 'right';
    });

    right_btn.addEventListener('mouseup', function(event) {
        launcher.direccion = '';
    });
    //código para disparar las balas
    fire_btn.addEventListener('mousedown', function(event) {
        launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3, h: 10});
    });
    // Esto se activa al hacer clic en el botón de espacio del teclado
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 32) {
           launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3,h: 10});
        }
    });
}

window.addEventListener('load', function(event) {
    initCanvas();
});
