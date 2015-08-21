/**
 * Created by mihai_000 on 19.08.2015.
 */
var STATE_DRAFT = 'draft';
var STATE_GAME = 'game';

var chess_app = {
    div_class:"app",
    opponent_ids:[],
    init:function(div_class){
        this.div_class = div_class;
        $('.'+this.div_class).html('loading...')
        this.loadProfilePage();
    },
    getUserGames:function(user_id){
            var viewer_id = user_id
            $("#user_games").html('<div colspan="5" align="center"><img width="30px" src="img/preloader.gif"/></div>')
            var get_user_games_url = 'http://topchess.ru/api/?go=get_user_games'

            $.ajax({
                type: "GET",
                dataType: "jsonp",
                cache: false,
                random: new Date().getTime(),
                url: get_user_games_url,
                data: {user_id: user_id }
            }).done(function( data ) {
                    $("#user_games").html("")
                    if(data.error)
                    {
                          $("#user_info").append("error");
                    }
                    else
                    {
                        if(data.length)
                        {
                            data.forEach(function(item){
                                var opponent_id , viewer_color

                                if(item.opponent_id == user_id)
                                {
                                    opponent_id = item.owner_id
                                    viewer_color = item.owner_color == 'w' ? 'b' : 'w'
                                }
                                else
                                {
                                    opponent_id = item.opponent_id
                                    viewer_color = item.owner_color
                                }
                                item.viewer_color = viewer_color

                                item.text_status = item.text_status ?item.text_status:'';

                                if(item.status == 'wdraw') item.text_status += ' - белые предлагают ничью';
                                if(item.status == 'bdraw') item.text_status += ' - черные предлагают ничью';
                                if(item.status == 'draw') item.text_status += ' - ничья';

                                if(item.status == 'wdown') item.text_status += ' - белые сдались';
                                if(item.status == 'bdown') item.text_status += ' - черные сдались';

                                var state_text = "";
                                if(item.state == STATE_GAME)
                                {
                                    if(item.last_color == viewer_color)
                                    {
                                        state_text = item.text_status;
                                    }
                                    else
                                    {
                                        state_text = '<b>Ваш ход</b> '+item.text_status;
                                    }
                                }
                                else
                                {
                                    state_text = item.text_status;
                                }

                                //if(opponent_id) this.opponent_ids.push(parseInt(opponent_id))
                                html_str = '';
                                html_str = $('.templates .game_item').clone();
                                html_str.attr('id' , item.game_id);

                                $('.game_id' , html_str).html( '#' + item.game_id);
                                $('.opponent_name' , html_str).html('user id'+item.opponent_id).attr('id' , item.opponent_id);
                                $('.game_state' , html_str).html(state_text);
                                $('.date_last_turn' , html_str).html(item.date_last_turn?item.date_last_turn:'---');

                                $(html_str).click(function(){
                                    chess_app.loadGame(item.game_id)
                                })
                                $("#user_games").append(html_str)
                            })
                        }
                        else
                        {
                            $('#user_games').html('<h3>У вас нет игр</h3><p>Вы можете пригласить друга для игры, а также войти или создать партию со случайным шахматистом</p>')
                        }
                    }
                }).fail(function(){
                    console.log('fail')
                })

    },
    loadGame:function(game_id)
    {
        this.loadPage("app/game.html#"+game_id)
    },
    loadProfilePage:function()
    {
        this.loadPage("app/profile.html" , function() {})
    },
    loadPage:function(url , onload){
        var $contentDiv = $('.'+this.div_class)
        $.ajax({
            url: url,
        }).done(function (data) {
            $contentDiv.html(data)
            onload();
        }).fail(function(){
            alert('Ошибка приложния. Обратитесь к разработчику');
        });
    }

};
