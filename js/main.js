// need to include your socket/glove module in main html file, as global window, so can have access here.
// var glove = new gloveController();

    var game = new Phaser.Game(800, 566, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });

    function preload() {
        game.load.image('sky', 'assets/sky1.png');
        game.load.image('ground', 'assets/ground.png');
        game.load.image('banana', 'assets/banana_small.png');
        game.load.spritesheet('dino', 'assets/dino.png', 68, 67);
    }

    var player;
    var cursors;
    var bananas;
    var keyboard = Phaser.Keyboard;
    // var score = 0;
    // var scoreText;
    var isGameOver = false;

    function create() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.sprite(0, 0, 'sky');
        platforms = game.add.group();
        platforms.enableBody = true;
        var ground = platforms.create(0, game.world.height - 56, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;
    //  dino
        player = game.add.sprite(32, game.world.height - 150, 'dino');
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0.4;
        player.body.gravity.y = 600;
        player.body.setSize(20, 25, 20, 15);
        player.body.collideWorldBounds = true;
        player.animations.add('left', [0, 1], 10, true);
        player.animations.add('right', [2, 3], 10, true);
        player.animations.add('jump', [1, 3], 10, true);
    //  bananas
        bananas = game.add.group();
        bananas.enableBody = true;
        player.body.setSize(32, 45);
        player.body.collideWorldBounds = true;

        function dropMeteor() {
            var randLoc = Math.random() * (800 - 0) + 0;
            var randVel = Math.random() * (300 - -100) - 100;
            for (var i = 0; i < 1; i++) {
                var banana = bananas.create(randLoc, 0, 'banana');
                banana.body.velocity.x = randVel;
                banana.body.gravity.y = 500;
                banana.body.bounce.y = 0.075 + Math.random() * 0.2;
        }

            }
        timer = game.time.events.loop(1500, dropMeteor, 'banana');
//  score
        // scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

//  controls
        cursors = game.input.keyboard.createCursorKeys();
        // keyboard = game.input.keyboard;
        // jump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        // restartKey = game.input.keyboard.addKey(Phaser.Keyboard.esc);

    }

var mockLeft = false;
var counter = 0;

// setInterval(function (){
//     if (mockLeft) { mockLeft = false;} else {mockLeft = true;}
// },3000);

    function update() {
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(bananas, platforms);

        // counter+=1;
        // if (counter%10 ==0) {console.log("counter: ", counter);}
        // From this test, it look like update() is run every 10ms, or 100 times / second. perfect!

        player.body.velocity.x = 0;

        if (cursors.left.isDown && cursors.up.isDown) {
            // if glove.left....if glove.right. And behind the scenes will check. might be easiest for user.
            // if glove.upSpike --> impulse
            // for continuous up, just hold up above 15 degree angle.

            player.body.velocity.x = -150;
            player.frame = 0
        }
        else if (cursors.right.isDown && cursors.up.isDown) {
            player.body.velocity.x = 150;
            player.frame = 3
        }
        else if ((cursors.left.isDown) 
            || (PowerGlove.left)) {
            player.body.velocity.x = -150;
            player.animations.play('left');
        }
        // } else if (mockLeft) {
        //     player.body.velocity.x = -150;
        //     player.animations.play('left');
        // }
        else if ((cursors.right.isDown) 
            || (PowerGlove.right)) {
            player.body.velocity.x = 150;
            player.animations.play('right');
        }
        else {
            if (player.animations.stop() && player.frame === 2 || 3) {
                player.frame = 2;
            }
            else {
                player.frame = 1;
            }
        };

        if (cursors.up.isDown && player.body.touching.down) {
            player.body.velocity.y = -350;
        }
        // if (keyboard.jump.isDown && player.body.touching.down) {
        //     player.body.velocity.y = -350;
        // }

        if (game.physics.arcade.collide(player, bananas)) {
            gameOver();
        }

        if (isGameOver && cursors.down.isDown) {
            game.state.start(game.state.current);
        }
    };


        function gameOver() {
            game.add.text(300, 283, 'GAME OVER', { fontSize: '32px', fill: '#000' });
            game.add.text(200, 320, 'Press the down arrow to restart.', { fontSize: '2px', fill: '#000' });
            isGameOver = true;
        }
