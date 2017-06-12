/**
 * Created by leejohn on 17/6/2.
 */
/**
 * 创建webSocket
 * @constructor
 */

exports.socketInit = function(server){

	var io = require('socket.io')(server);
	
	/**
	 * 在线用户
	 * json格式: { '1496826605615198': { userId: '1496826605615198', userName: 'ff', roomId: '001' },'1496826612693737': { userId: '1496826612693737', userName: 'gg', roomId: '001' } }
	 */
	var onlineUsers = {};
	//当前在线人数
	var onlineCount = 0;

	/**
	 * 房间信息和房间人数
	 * json格式: { '001':[ {userId: '1496826161806193', userName: 'ljm', socketId: 'kIiL1FlAzJdp--IYAAAD' },{ userId: '1496826168730555', userName: 'vv', socketId: 'fAF7hzqwKO5WwOA2AAAE' } ] }
	 */

	var rooms = {};

	//WebSocket连接监听
	io.on('connection',function(socket){

		//通知客户端已经连接
		socket.emit('open');

		//打印握手信息
		//console.log(socket.handshake);

		/**
		 * 监听新用户登录
		 */
		socket.on('login',function(obj){
			socket.name = obj.userId;

			//检查在线用户,如果不在里面就加入
			if(!onlineUsers.hasOwnProperty(obj.userId)){

				onlineUsers[obj.userId] = {userId: obj.userId,userName: obj.userName,roomId: null};
				onlineCount++;
			}

			//向所有客户端广播用户加入
			io.emit('login', {onlineUsers:onlineUsers, onlineCount:onlineCount, user: obj});
			console.log(obj.userName+'加入了聊天室');
		});

		/**
		 * 监听用户进入房间
		 */
		socket.on('get into room',function(room){
			//将socket.id存入user信息中,用于私聊时传输信息
			room.user.socketId = socket.id;
			if(rooms[room.roomId]){
				rooms[room.roomId].push(room.user);
			}else{
				rooms[room.roomId] = []; //先初始化为一个数组
				rooms[room.roomId].push(room.user);
			}

			//加入房间
			socket.join(room.roomId);

			onlineUsers[room.user.userId].roomId = room.roomId;
			
			//广发当前房间的在线人数和当前进入的用户
			io.to(room.roomId).emit('get into room',{roomOnlineUsers : rooms[room.roomId],user: room.user,roomId: room.roomId});
			//io.sockets.in(roomId).emit('request_list_ans',socketList[roomId] );
		});

		/**
		 * 监听用户退出房间
		 */
		socket.on('get out room',function(room){
			//踢出房间
			socket.leave(room.roomId);
			//将用户从房间移除
			for(var i in rooms[room.roomId]){
				if(rooms[room.roomId][i].userId === room.user.userId){
					rooms[room.roomId].pop(rooms[room.roomId][i])
				}
			}

			var roomOnlineUsers = rooms[room.roomId];

			//向所有客户端广播用户退出
			io.to(room.roomId).emit('get out room', {roomOnlineUsers : roomOnlineUsers,user: room.user,roomId: room.roomId});
			console.log(room.user.userName+'退出了'+room.roomId+'房间');
		});

		/**
		 * 监听用户退出
		 */
		socket.on('disconnect',function(){
			//socket.leave(data.room)
			//将退出的用户从在线列表中删除
			if(onlineUsers.hasOwnProperty(socket.name)){
				//退出用户的信息
				var obj = {userId: socket.name, userName: onlineUsers[socket.name].userName};
				var roomId = onlineUsers[socket.name].roomId;

				//踢出房间
				socket.leave(roomId);
				//删除
				delete onlineUsers[socket.name];
				//将用户从房间移除
				for(var i in rooms[roomId]){
					if(rooms[roomId][i].userId === obj.userId){
						rooms[roomId].pop(rooms[roomId][i])
					}
				}
				var roomOnlineUsers = rooms[roomId]
				//在线人数-1
				onlineCount--;

				//向所有客户端广播用户退出
				io.emit('logout', {roomOnlineUsers : roomOnlineUsers,user: obj,roomId: roomId});
				console.log(obj.userName+'退出了聊天室');

			}
		});

		socket.on('logout',function(){
			console.log(socket.name);
		});

		
		/**
		 * 监听用户发布聊天内容
		 */
		socket.on('message',function(obj){
			if(obj.socketId){ //私聊
				io.to(obj.socketId).emit('message', obj);
			}else{
				io.to(obj.roomId).emit('message', obj);
				console.log(obj.username+'说：'+obj.content);
			}

		});
		
	});
}



