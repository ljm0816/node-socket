(function () {
    var d = document,
        w = window,
        p = parseInt,
        dd = d.documentElement,
        db = d.body,
        dc = d.compatMode == 'CSS1Compat',
        dx = dc ? dd: db,
        ec = encodeURIComponent;


    w.CHAT = {
        socket: null,
        msgObj:d.getElementById("message"),
        user: {
            userId : null,
            userName: null
        },

        room: {
            roomId: null,
            user: null,
            onlineUsers: null
        },



		/**
         * 初始化聊天
         */
        init: function(){
            //链接websocket后端服务器
            this.socket = io("http://localhost:3000");
            
            //告诉服务器有用户登录
            this.socket.emit("login",this.user);
            
            
            this.socket.on("login",function(socket){
                //console.log(socket);
            });

            //监听进入房间信息
            this.socket.on("get into room",function(obj){
                d.getElementById("showuserName").innerText = CHAT.user.userName;
                d.getElementById("showRoomId").innerText = "退出"+CHAT.room.roomId+"号房间";
                CHAT.room.onlineUsers = obj.roomOnlineUsers;
                CHAT.getRoomOnline(obj.roomOnlineUsers);
                CHAT.getUserNotice(obj.roomId,obj.user,"get into room");
            });

            //监听进入房间信息
            this.socket.on("get out room",function(obj){
                CHAT.getRoomOnline(obj.roomOnlineUsers);
                CHAT.getUserNotice(obj.roomId,obj.user,"get out room");
            });

            this.socket.on("message",function(obj){
                CHAT.getConent(obj);
            });

            //监听用户退出
            this.socket.on('logout', function(obj){
                CHAT.getRoomOnline(obj.roomOnlineUsers);
                CHAT.getUserNotice(obj.roomId,obj.user);
            });
        },
		/**
         * 用户登录
         */
        loginSubmit: function(){
            if(d.getElementById("userName").value){
                this.user.userId = this.getAutoUserId();
                this.user.userName = d.getElementById("userName").value;
                d.getElementById("loginbox").style.display = "none";
                d.getElementById("roombox").style.display = "block";

                this.init();
            }else{
                alert("请输入用户名登录");
            }
            
            
        },

		/**
		 * 进入房间
         */
        getIntoRoom: function(roomId){
            if(roomId){
                this.room.roomId = roomId;
                this.room.user = this.user;
                d.getElementById("roombox").style.display = "none";
                d.getElementById("chatbox").style.display = "block";

                var sectionList = this.msgObj.getElementsByTagName("section");
                var len = sectionList.length;
                if(sectionList.length >0){
                    for(var i=0;i< len; i++){
                        this.msgObj.removeChild(sectionList[0]); //进入聊天页面时,先清空
                    }
                }
                this.socket.emit("get into room",this.room);

            }else{
                alert("请选择你要进入的房间");
            }
        },

		/**
         * 退出房间
         */
        getOutRoom: function(){
            d.getElementById("roombox").style.display = "block";
            d.getElementById("chatbox").style.display = "none";
            this.socket.emit("get out room",this.room);
        },
        
		/**
		 * 提交聊天信息
         */
        chatSubmit: function(){
            var content = d.getElementById("content").value;
            if(content != ''){
                var obj = {
                    userId: this.user.userId,
                    userName: this.user.userName,
                    content: content,
                    roomId: this.room.roomId
                };
                this.socket.emit('message', obj);
                d.getElementById("content").value = '';
            }
            return false;
            this.socket.emit("message",content);
        },

		/**
		 * 提交私聊信息
         */
        privateChatSubmit: function(){
            var content = d.getElementById("private-content").value;
            var socketId = d.getElementById("socket-id").value;
            if(content != ''){
                var obj = {
                    userId: this.user.userId,
                    userName: this.user.userName,
                    content: content,
                    roomId: this.room.roomId,
                    socketId: socketId
                };
                this.socket.emit('message', obj);
                d.getElementById("private-content").value = '';
            }
            return false;
            this.socket.emit("message",content);
        },
        
		/**
		 * 生成随机的用户id
         */
        getAutoUserId: function(){
            return new Date().getTime()+""+Math.floor(Math.random()*899+100);
        },

		/**
		 * 显示当前房间的在线人数
         */
        getRoomOnline: function(roomOnlineUsers){
            var usersHtml = "";
            if(roomOnlineUsers){
                for(var i=0;i<roomOnlineUsers.length;i++){
                    var socketId = roomOnlineUsers[i].socketId;
                    var chatModal = "CHAT.chatModal('"+socketId+"')";
                    usersHtml += '<a href=javascript:; onclick="'+chatModal+'">'+roomOnlineUsers[i].userName+'</a>&nbsp;';
                }
                d.getElementById("onlinecount").innerHTML = '当前共有 '+roomOnlineUsers.length+' 人在线，在线列表：'+usersHtml;
            }
        },

		/**
         * 用户进入房间和离开房间的通知信息
         */
        getUserNotice: function(roomId,user,action){
            //添加系统消息
            var html = '';
            html += '<div class="msg-system">';
            html += user.userName;
            html += (action == 'get into room') ? ' 加入了'+roomId+"号房间" : ' 退出了'+roomId+"号房间";
            html += '</div>';
            var section = d.createElement('section');
            section.className = 'system J-mjrlinkWrap J-cutMsg';
            section.innerHTML = html;
            d.getElementById("message").appendChild(section);
            this.scrollToBottom();
            this.socket.emit("something","hahah");
        },

		/**
		 * 获取用户的聊天信息
         */
        getConent(obj){
            var isme = (obj.userId == CHAT.user.userId) ? true : false;
            var contentDiv = '<div>'+obj.content+'</div>';
            var userNameDiv = '<span>'+obj.userName+'</span>';

            var section = d.createElement('section');
            if(isme){
                section.className = 'user';
                section.innerHTML = contentDiv + userNameDiv;
            } else {
                section.className = 'service';
                section.innerHTML = userNameDiv + contentDiv;
            }
            d.getElementById("message").appendChild(section);
            this.scrollToBottom();
        },

		/**
         * 让浏览器滚动条保持在最低部
         */

        scrollToBottom: function(){
            w.scrollTo(0, this.msgObj.clientHeight);
        },

		/**
         * 弹出私人聊天窗口
         */
        chatModal: function(socketId){
            d.getElementById("modal").style.display = "block";
            var onlineUser = this.room.onlineUsers;
            var user = null;
            for(var i in onlineUser){
                if(onlineUser[i].socketId === socketId){
                    user = onlineUser[i];
                    break;
                }
            }
            d.getElementById("somebody").innerText = user.userName;
            d.getElementById("socket-id").value = socketId;
        },

		/**
         * 关闭私人聊天窗口
         */
        closeModal: function(){
            d.getElementById("modal").style.display = "none"
        }

    };
    
    //通过“回车”提交用户名
    // d.getElementById("userName").onkeydown = function(e) {
    //     e = e || event;
    //     if (e.keyCode === 13) {
    //         CHAT.userNameSubmit();
    //     }
    // };
    // //通过“回车”提交信息
    // d.getElementById("content").onkeydown = function(e) {
    //     e = e || event;
    //     if (e.keyCode === 13) {
    //         CHAT.submit();
    //     }
    // };
})();