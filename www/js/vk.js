
var vk = {

    user_id: false,

    init:function(force){
        plugin_vk.auth(force);
        this.user_id = window.localStorage.getItem("plugin_vk_user_id")
    },

    getUserId:function() {
        return this.user_id;
    }
};

var plugin_vk = {
    wwwref: false,
    plugin_perms: "friends,wall,photos,messages,wall,offline,notes",

    auth: function (force) {
        if (!window.localStorage.getItem("plugin_vk_token") || force || window.localStorage.getItem("plugin_vk_perms")!=plugin_vk.plugin_perms) {
            var authURL="https://oauth.vk.com/authorize?client_id=5038680&scope="+this.plugin_perms+"&redirect_uri=http://oauth.vk.com/blank.html&display=touch&response_type=token";
            this.wwwref = window.open(encodeURI(authURL), '_blank', 'location=no');
            this.wwwref.addEventListener('loadstop', this.auth_event_url);
        }
    },
    auth_event_url: function (event) {
        var tmp=(event.url).split("#");
        if (tmp[0]=='https://oauth.vk.com/blank.html' || tmp[0]=='http://oauth.vk.com/blank.html') {
            plugin_vk.wwwref.close();
            var tmp=url_parser.get_args(tmp[1]);
            window.localStorage.setItem("plugin_vk_token", tmp['access_token']);
            window.localStorage.setItem("plugin_vk_user_id", tmp['user_id']);
            window.localStorage.setItem("plugin_fb_exp", tmp['expires_in']);
            window.localStorage.setItem("plugin_vk_perms", plugin_vk.plugin_perms);
        }
    }
};

var url_parser={
    get_args: function (s) {
        var tmp=new Array();
        s=(s.toString()).split('&');
        for (var i in s) {
            i=s[i].split("=");
            tmp[(i[0])]=i[1];
        }
        return tmp;
    },
    get_args_cookie: function (s) {
        var tmp=new Array();
        s=(s.toString()).split('; ');
        for (var i in s) {
            i=s[i].split("=");
            tmp[(i[0])]=i[1];
        }
        return tmp;
    }
};