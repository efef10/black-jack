 // var index = $(function () {
    var playerInTurn = 1;
    var round = 1;
    var totalScore1 = 0;
    var totalScore2 = 0;

    function start(){
        round = 1;
        totalScore1 = 0;
        totalScore2 = 0;
        $(".score").html("Total Score: 0");
        $("#newGame").prop("disabled",true);
        initBoard();
        $.ajax({
            type:"GET",
            url:"http://localhost:3000/room/123",
            success: function (data) {
                if(Object.keys(data).length === 2){
                    $(".join").attr("disabled",true);
                }
                if(Object.keys(data).length !== 0){
                    $(".left h2").append(data.players[0].name);
                    $(".right h2").append(data.players[1].name);
                }
            },
            error: function () {
                console.log("failed");
            }

        });
    }

    function checkWinner(){
        var winner;
        var sum1 =  Number($("#sum1").text());
        var sum2 =  Number($("#sum2").text());
        if(sum1>21 || sum2===21){
            winner = "2";
            totalScore2++;
            $("#score2").text("Total Score: "+totalScore2);
        }
        else if(sum2>21 || sum1 === 21){
            winner = "1";
            totalScore1++;
            $("#score1").text("Total Score: "+totalScore1);
        }
        if(!!winner){
            $(".player1btn").attr("disabled","true");
            $(".player2btn").attr("disabled","true");
            if(round == 3){
                var theWinner = totalScore1>totalScore2 ? 1 : 2;
                $("#message").html(`game over. player ${theWinner} won`);
                $("#newGame").prop("disabled",false);
            }
            else {
                $("#message").html(`player${winner} won!`);
                round += 1;
                playerInTurn = Number(winner);
                $("#btnAnother").prop("disabled",false);
            }
        }
    }

    function initiatePlayers(){
        $.ajax({
            type:"POST",
            url :"http://localhost:3000/room/123/initiate",
            success:function(){
                console.log("room 123 initiated successfully");
            },
            error:function(){
                console.log("failed to initiate");

            }
        });
    }

    function initBoard(){
        $("#btnAnother").attr("disabled","true");
        $("#message").html("");
        $("#round").html("Round: "+ round);
        $("#sum1").html("0");
        $("#sum2").html("0");
        $(".added-li").remove();
        $(".player"+playerInTurn+"btn").prop( "disabled", false );
        $.ajax({
            type:"GET",
            url:"http://localhost:3000/room/123",
            success: function(data){
                if(Object.keys(data).length !== 0){
                    initiatePlayers();
                }
            },
            error: function() {
                console.log("failed");
                return null;
            }
        });
    }

    function turnChange(){
        $(".player1btn").prop('disabled', function(i, v) { return !v; });
        $(".player2btn").prop('disabled', function(i, v) { return !v; });
        if(playerInTurn == 1){
            playerInTurn = 2;
        }else{
            playerInTurn = 1;
        }
    }

    function addNewListItem(ulName,card){
        // var li = $("<li><img src='"+"./2C.png"+"'/></li>");
        var li = $("<li>"+card+"</li>");
        li.css("list-style-type","none");
        li.addClass("added-li")
        var ul = $("#"+ulName);
        ul.append(li);
    }

    function draw(){
        $.ajax({
            type:"GET",
            url:"http://localhost:3000/room/123",
            success: function(data){
                var players = data.players;
                $.ajax({
                    type:"POST",
                    url:"http://localhost:3000/room/123/players/"+players[playerInTurn-1].name+"/draw",
                    success: function(data){
                        addNewListItem("cards"+playerInTurn, data.newCard);
                        var sum = data.score;
                        $("#sum"+playerInTurn).html(sum.toString());
                        turnChange();
                        checkWinner();
                    },
                    error: function() {
                        console.log("failed");
                    }

                });
            },
            error: function() {
                console.log("failed");
            }
        });
    }

    function stay(){
        turnChange();
    }

    $(".join").on('click', function(e){
     e.preventDefault();
     var name = $("input[type=text]");
     $.ajax({
         type:"POST",
         url:"http://localhost:3000/room/123/players/"+name.val(),
         success: function (data) {
             console.log("success");
             name.val("");
             if(data.players.length === 2){
                 $(".join").attr("disabled",true);
                 $(".left h2").append(data.players[0].name);
                 $(".right h2").append(data.players[1].name);
             }
         },
         error: function () {
             console.log("failed");
         }

     });

 });


     // return start;
 // });