/**
 * Created by dragon on 2017/5/11.
 */

$(function(){
    $("#imageCode").css("cursor","pointer");

})

function getImgCode(){
    var dt = new Date().getTime();
    var url = ctx + "/imageCode?dt="+dt;
    $.get(url,function(result){
        $("#imageCode").attr("src",url);
    });
}


//登录校验
function onSubmit(flag){
    return flag;
}


$(function () {

    $("#loginform").click(function () {

        var ACCOUNT  = $("#ACCOUNT").val();
        var PASSWORD = $("#PASSWORD").val();

        if(!ACCOUNT || ACCOUNT ==''){
            return onSubmit(false);
        }

        if(!PASSWORD || PASSWORD ==''){
            return onSubmit(false);
        }

        alert("hah")

        return onSubmit(true);
    });

});




