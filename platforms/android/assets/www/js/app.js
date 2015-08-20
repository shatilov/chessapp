/**
 * Created by mihai_000 on 19.08.2015.
 */

var chess_app = {
    div_class:"app",
    init:function(div_class){
        this.div_class = div_class;
        $('.'+this.div_class).html('loading...')
        this.loadProfilePage();
    },
    getUserGames:function(user_id){
            var auth_key = ''
            $("#user_games").append('<div colspan="5" align="center"><img width="30px" src="http://topchess.ru/vk/img/preloader.gif"/></div>')
            var get_user_games_url = window.location.protocol+'//topchess.ru/api/?go=get_user_games'

            $.ajax({
                type: "GET",
                cache: false,
                random: new Date().getTime(),
                url: get_user_games_url,
                dataType: 'jsonp',
                data:{ user_id : user_id , auth_key:auth_key } ,
                success:function( data ) {
                    alert('success');
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

                                if(item.opponent_id == viewer_id)
                                {
                                    opponent_id = item.owner_id
                                    viewer_color = item.owner_color == 'w' ? 'b' : 'w'
                                }
                                else
                                {
                                    opponent_id = item.opponent_id
                                    viewer_color = item.owner_color
                                }

                                if(opponent_id)opponent_ids.push(parseInt(opponent_id))

                                $("#user_games").append('<div class="game_item" id="'+item.game_id+'">'+item.game_id+'</div>')
                            })
                        }
                        else
                        {
                            $('#user_games').html('<h3>У вас нет игр</h3><p>Вы можете пригласить друга для игры, а также войти или создать партию со случайным шахматистом</p>')
                        }
                    }
                }
            });
    },
    loadProfilePage:function()
    {
        this.loadPage("app/profile.html")
    },
    loadPage:function(url){
        var $contentDiv = $('.'+this.div_class)
        $.ajax({
            url: url,
        }).done(function (data) {
            $contentDiv.html(data)
        }).fail(function(){
            alert('Ошибка приложния. Обратитесь к разработчику');
        });
    }

};
