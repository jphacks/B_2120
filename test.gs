var FindSubject = 'subject:() ';
function myFunction() {
  var now = new Date();

  //指定した件名のスレッドを検索して取得 
  var myThreads = GmailApp.search(FindSubject, 0, 1);
  //スレッドからメールを取得し二次元配列に格納
  var myMessages = GmailApp.getMessagesForThreads(myThreads);
  
  for(var j in myMessages[0]){
    if(!myMessages[0][j].isStarred()){
      
      var strDate　=　myMessages[0][j].getDate();
      var elapsedTime = now.getTime() - strDate.getTime();
      var mins = elapsedTime / (1000 * 60);
	  
      if (mins <= 5){
        console.log("if文クリア");
        var strSubject　=　myMessages[0][j].getSubject();
        var strMessage　=　myMessages[0][j].getPlainBody().slice(0,200);
        var password = main(strSubject, strMessage);
        console.log(password);

        //処理済みのメッセージをスターをつける
        // var copyPage = HtmlService.createTemplateFromFile('copied');
        // copyPage.values = "aaa";
        // copyPage.name = "コピー";
        // copyPage.evaluate();
        sendLine(password);
        myMessages[0][j].star();
      }
      console.log("終了！");
    }
  }
}


function main(title, content){
	if (isCode(title)){
		var code = reliability(extract(content));
		console.log(code);
		return code;
	}
}

function isCode(title){
	var array=[
		"コード",
		"認証",
		"確認",
		"verify",
		"verification",
		"code",
		"confirmation"
	];
	for (let i = 0; i < array.length; i++){
		if (title.toLowerCase().indexOf(array[i]) != -1){
			return true;
		}
		console.log(array[i]);
	}
	return false;
}


function extract(message){
	var message_array = message.split("");
	var code = "";
	for (let i = 0; i < message_array.length; i++){
		if (Number(message_array[i]) > 0 || message_array[i] == "-"){
			code += message_array[i];
		}else{
			if (code.slice(-1) != " "){
				code += " ";
			}
		}
	}
	var nonExtractedArray = code.split(" ");
	var extractedArray = [];
	for (let i = 0; i < nonExtractedArray.length; i++){
		if (nonExtractedArray[i] != ""){
			extractedArray.push(nonExtractedArray[i]);
		}
	}
	return extractedArray;
}


function reliability(array){
	code = "";
	var _array = array[0].split("-");
	for (let i = 0; i < _array.length; i++){
		code += _array[i];
	}
	return code;
}

function sendLine(password){
  //Lineに送信するためのトークン
  //以下にトークンを入力する
  var strToken = "";
  var options =
  {
    "method"  : "post",
    "payload" : "message=" + "\n"+password,
    "headers" : {"Authorization" : "Bearer "+ strToken}

  };

  UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options);
}