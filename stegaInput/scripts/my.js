/**
 * 
 * @OriginalAuthor Johnson，598465252@qq.com
 * @ModAuthor Nelson 
 * @version 3
 * 
 * @name 隐写输入法（AES）
 *  *将掩码常数替换为密钥变量，并可从用户界面更换密钥
 */
/* ===========================免责申明======================================================
 * ===========================该程序仅供技术交流使用===========================================
 * ===========================请勿用于商业用途================================================
 * ===========================否则后果自行承担================================================
 * ========================================================================================
 */

/* ===========================感谢作者：sym233 提供编码器代码==================================
 * ==============================原版编码器源码地址：https://github.com/sym233/core-values-encoder
 * ==============================修改：增加随机编码功能===========================================
 * ========================================================================================
 * ========================================================================================
 */


var Arr0 = ['富强', '民主', '文明', '和谐', '自由', '平等', '公正', '法治', '爱国', '敬业', '诚信', '友善'];
//var Arr0=['不会','什么','这样','那种','事情','可能','真好','厉害','可以','好吧','当真','真假'];
var Arr1 = [].concat(Arr0); //var b = [].concat(a)
//alert(Arr1.join(''));

var Arr2 = []; //用于处理明文切割

var Color_background = "#0E748D"; //"#E3CBE3";//淡红藤//"#5B434B"//"#EFCACC"//"#76B4E1"
//预设控件
var Color_front = "#0E748D"; //"#E3CBE3";//淡红藤//"#EFCACC";//"#76B4E1"

//读取预设的转子
//var mJson=$.ajax({url:"setting.json",async:false});
//var myJson=$include('setting.json');
//var temp=JSON.parse(myJson);
//alert(temp.defaultSymmetricKey);
//var SymmetricKey=$setting.defaultSymmetricKey;
var SymmetricKey = '';
SymmetricKey = readJsonKey("setting.json", "defaultSymmetricKey");
var values; //价值观

var pwd = SymmetricKey; //ofer Pwd for AES


var numbers = "1234567890";
var Matrix_kb = {
    type: "matrix",
    props: {
        id: "matrix_kb",
        scrollEnabled: false,
        columns: 10,
        spacing: 5,
        itemHeight: 25,
        bgcolor: $color("#CFD3DA"),
        data: dataPush(numbers),
        template: {
            props: {},
            views: [{
                type: "label",
                props: {
                    id: "label",
                    textColor: $color("black"),
                    bgcolor: $color("white"),
                    radius: 10,
                    align: $align.center,
                    font: $font(20)
                },
                layout: $layout.fill
            }]
        }
    },
    layout: function(make, view) {
        make.edges.insets($insets(0, 0, 0, 0))

    },
    events: {
        didSelect: function(sender, indexPath, data) {
            //morseCode(data.label.text)
        }
    }
};



//用菜单控件定义混淆码转子
var Menu1 = {
    type: "menu",
    props: {
        id: "menu1",
        //items: ["1", "2", "3", "4", "5", "6", "7", "8", "9","0","1", "2", "3", "4", "5", "6", "7", "8", "9","0"]
        items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "A", "a", "B", "b", "C", "c", "D", "d", "E", "e", "F", "f", "G", "g", "H", "h", "I", "i", "J", "j", "K", "k", "L", "l", "M", "m", "N", "n", "O", "o", "P", "p", "Q", "q", "R", "r", "S", "s", "T", "t", "U", "u", "V", "v", "W", "w", "X", "x", "Y", "y", "Z", "z", "$", "(", ")", ":", ",", ".", "?", "!", "'", "+", "-", "*", "/", "~", "%", "^", "=", "<", ">", "€", "£", "¥", "&", "@"]
    },
    layout: function(make) {
        //make.left.top.right.equalTo(0)
        make.top.bottom.inset(4)
        make.left.right.inset(30)
            //make.height.equalTo(44)
    },
    events: {

        changed: function(sender) {
            $keyboard.playInputClick();
            var items = sender.items
            var index = sender.index
                //$ui.toast(index + ": " + items[index]);
            $('label_key').text = $("label_key").text + items[index];

            $keyboard.insert(items[index]);


            //触发价值观变化
            //if($("text_value").text==""){alert("你没有价值观")};
            /*
            Arr1=[].concat(Arr0);          
            Arr1=[].concat(ArrShuffleEncrypt(Arr1,parseInt(items[index])));
            //alert(Arr1.join(''));
            values=Arr1.join('');
            $('text_value').text= values;
            */
            initValue();

            //触发明文乱序
            /*
            Arr2=$("original_text").text.split("");
            Arr2=ArrShuffleEncrypt(Arr2,parseInt(items[index]));
          
            $("original_text").text=Arr2.join("");
            */

        }

    }
};

//用菜单控件定义图片密文加密转子
var Menu2 = {
    type: "menu",
    props: {
        id: "menu2",
        items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "A", "a", "B", "b", "C", "c", "D", "d", "E", "e", "F", "f", "G", "g", "H", "h", "I", "i", "J", "j", "K", "k", "L", "l", "M", "m", "N", "n", "O", "o", "P", "p", "Q", "q", "R", "r", "S", "s", "T", "t", "U", "u", "V", "v", "W", "w", "X", "x", "Y", "y", "Z", "z", "$", "(", ")", ":", ",", ".", "?", "!", "'", "+", "-", "*", "/", "~", "%", "^", "=", "<", ">", "€", "£", "¥", "&", "@"]
    },
    layout: function(make) {
        //make.left.top.right.equalTo(0)
        make.top.bottom.inset(4)
        make.left.right.inset(30)
            //make.height.equalTo(44)
    },
    events: {

        changed: function(sender) {
            $keyboard.playInputClick();
            var items = sender.items
            var index = sender.index
                //$ui.toast(index + ": " + items[index]);
            $keyboard.insert(items[index]);
            $('label2').text = $("label2").text + items[index];
        }

    }
};

//用于显示混淆码转子
var label_key = {
    type: "label",
    props: {
        id: "label_key",
        //text: "",
        align: $align.center
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super).dividedBy(3) //multipliedBy(1.5)//
        make.centerY.equalTo(view.super) //.multipliedBy(1.5)//dividedBy(2)              
        make.width.equalTo(view.super).dividedBy(3)
        make.height.equalTo(view.super) //.dividedBy(2) 
    },
    events: {

        ready() {
            $('label_key').text = SymmetricKey
        },

        //触发价值观变化
        //label没有该回调，input的回调为changed，text的回调为didChange
        //回调只能由键盘输入触发，直接改.text值无效？
        changed: function(sender) {
            alert('检测到变化');
            initValue();
        },

        tapped() {
            $clipboard.text = $('label_key').text;
            $ui.toast($l10n("已复制密码"))
        },
    }
};

//用于显示图片密码
var Label2 = {
    type: "label",
    props: {
        id: "label2",
        text: "",
        align: $align.center
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super) //.dividedBy(2) //multipliedBy(1.5)//
        make.centerY.equalTo(view.super) //.multipliedBy(1.5)//dividedBy(2)              
        make.width.equalTo(view.super).dividedBy(2)
        make.height.equalTo(view.super) //.dividedBy(1.1) 
    },
    events: {
        ready() {
            //$('label2').text = $app.info.defaultSymmetricKey            
        },
        tapped() {
            $clipboard.text = $('text_value').text;
            $ui.toast($l10n("已复制密码"))
        },
    }
};

var keyboardBn = {
    type: "button",
    props: {
        id: "keyboardBn",
        type: 1,
        icon: $icon("010", $color("#666666"), $size(30, 30))
    },
    layout(make, view) {
        make.centerX.equalTo(view.super) //.dividedBy(2) //multipliedBy(1.5)//
            //make.left.inset(0)
        make.centerY.equalTo(view.super)
    },
    events: {
        tapped(sender) {
            $input.text({
                //type: $kbType.number,
                placeholder: "Input a number",
                text: $clipboard.text,
                handler: function(text) {
                    //alert(text);
                    $('label_key').text = text;
                    initValue();
                }
            })
        }
    }
};


var SaveRotorsBtn = { //按钮：保存转子数
    type: 'button',
    props: {
        id: 'save_rotors_btn',
        title: '记住价值观',
        bgcolor: $color(Color_front)

    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super).multipliedBy(1.5) //dividedBy(2) //
        make.centerY.equalTo(view.super) //.multipliedBy(1.5)//dividedBy(2)              
        make.width.equalTo(view.super).dividedBy(3)
        make.height.equalTo(view.super) //.dividedBy(2) 
    },
    events: {
        tapped() {
            writeJsonKey("setting.json", "defaultSymmetricKey", $("label_key").text);
        }
    },
};

var GenValueBtn = { //按钮：随机生成价值观
    type: 'button',
    props: {
        id: 'gen_value_btn',
        title: '今日价值观',
        bgcolor: $color(Color_front)

    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super).multipliedBy(0.5) //dividedBy(3) //
        make.centerY.equalTo(view.super) //.multipliedBy(1.5)//dividedBy(2)              
        make.width.equalTo(view.super).dividedBy(3)
        make.height.equalTo(view.super) //.dividedBy(2) 
    },
    events: {
        tapped() {
            /*
            Arr1=[].concat(Arr0);
            Arr1.sort(randomsort);
            values=Arr1.join('');
            $('text_value').text= values;
            $clipboard.text=values;//$('text_value').text;
            $ui.toast($l10n("已复制价值观"));
            */
            $('label_key').text = scram(19);
            initValue();
        }
    },
};

var ValueText = { //文本框：密钥
    type: "text",
    props: {
        id: "text_value",
        placeholder: '点击发给朋友，或输入朋友的价值观',
        borderWidth: 1,
        borderColor: $color('#999'),
        radius: 10,
        accessoryView: completeTool('text_value')
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super).multipliedBy(1.2) //.dividedBy(2)//
        make.centerY.equalTo(view.super) //.multipliedBy(1.5)//dividedBy(2)              
        make.width.equalTo(view.super).dividedBy(1.8)
        make.height.equalTo(view.super) //.dividedBy(2) 
    },
    events: {
        ready() {
            //$('text_value').text = $clipboard.text
            initValue();
        },
        tapped() {
            $clipboard.text = $('text_value').text;
            $ui.toast($l10n("已复制价值观"))
        }
    },
};

var Swh2Value = { //按钮：utf8
    type: 'switch',
    props: {
        id: 'swh_value',
        title: 'B64',
        on: false,
        //bgcolor:$color(Color_front)
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super).multipliedBy(2) //dividedBy(3) //
        make.centerY.equalTo(view.super) //.multipliedBy(1.5)//dividedBy(2)              
        make.width.equalTo(view.super).dividedBy(3.5)
        make.height.equalTo(view.super) //.dividedBy(2) 
    },
    events: {
        changed: function(sender) {

            if ($("swh_value").on) {
                //alert("on")
                /*$("original_text").text=$text.base64Encode($("original_text").text);*/
                /*
                values=$('text_value').text;
                $('original_text').text = valuesEncode($('original_text').text);
                //$('original_text').blur();
                */
            } else {
                //alert("off")
                /*$("original_text").text=$text.base64Decode($("original_text").text);*/

                /*
                values=$('text_value').text;
                      $('original_text').text = valuesDecode($('original_text').text);
                      //$('original_text').blur();
                */

            }
        },
        tapped() {

            /*
            if (charCodeAt("$('original_text').text")=="UTF-8")
            {
            $('original_text').text=utf82str($('original_text').text);
            }
            else
            {
              $('original_text').text=str2utf8($('original_text').text);
            }
            $ui.toast($l10n("已复制"));
            //$keyboard.text;
            */
        }
    },
};


var ClearBtn = { //按钮：清空文本框
    type: 'button',
    props: {
        id: 'clear_btn',
        title: '清空',
        bgcolor: $color(Color_front)
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super).dividedBy(4) //multipliedBy(1.5)//
        make.centerY.equalTo(view.super) //.multipliedBy(1.5)//dividedBy(2)              
        make.width.equalTo(view.super).dividedBy(3.5)
        make.height.equalTo(view.super) //.dividedBy(2) 
    },
    events: {
        tapped() {
            $('original_text').text = '';
            //$("label_key").text="";
            //$("text_value").text="";
            //当第二页尚未渲染时，以下语句无效并报错:
            $("label2").text = "";

        }
    },
};

var PasteBtn = { //按钮：粘贴剪贴板内容
    type: 'button',
    props: {
        id: 'paste_btn',
        title: '粘贴',
        bgcolor: $color(Color_front)
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super).dividedBy(1.4) //multipliedBy(1.5)//
        make.centerY.equalTo(view.super) //.multipliedBy(1.5)//dividedBy(2)              
        make.width.equalTo(view.super).dividedBy(3.5)
        make.height.equalTo(view.super) //.dividedBy(2) 
    },
    events: {
        tapped() {
            $('original_text').text = $clipboard.text;
            $keyboard.insert($clipboard.text)
        }
    },
};

var CopyObtn = { //按钮：拷贝原文
    type: 'button',
    props: {
        id: 'copyO_btn',
        title: '拷贝',
        bgcolor: $color(Color_front)
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super).multipliedBy(1.25) //dividedBy(3) //
        make.centerY.equalTo(view.super) //.multipliedBy(1.5)//dividedBy(2)              
        make.width.equalTo(view.super).dividedBy(3.5)
        make.height.equalTo(view.super) //.dividedBy(2) 
    },
    events: {
        tapped() {
            $clipboard.text = $('original_text').text;
            $ui.toast($l10n("已复制"));
            //$keyboard.text;
        }
    },
};

var RsaBtn = {
    type: 'button',
    props: {
        id: 'rsa_btn',
        title: '私聊',
        bgcolor: $color(Color_front)
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super).multipliedBy(1.75) //dividedBy(3) //
        make.centerY.equalTo(view.super) //.multipliedBy(1.5)//dividedBy(2)              
        make.width.equalTo(view.super).dividedBy(3.5)
        make.height.equalTo(view.super) //.dividedBy(2) 
    },
    events: {
        tapped() {
            renderWebPageRSA();
        }
    }
};



var OriginalText = { //文本框：明文或密文
    type: "text",
    props: {
        id: "original_text",
        placeholder: '输入需要编码或解码的文字',
        borderWidth: 1,
        borderColor: $color('#999'),
        radius: 10,
        accessoryView: completeTool('original_text')
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super) //.dividedBy(3) //multipliedBy(1.5)//
        make.centerY.equalTo(view.super) //.multipliedBy(1.5)//dividedBy(2)              
        make.width.equalTo(view.super) //.dividedBy(3.5)
        make.height.equalTo(view.super) //.dividedBy(2)     
    },
    events: {
        ready() {
            $('original_text').text = $clipboard.text
        },
        /*tapped () {
            $clipboard.text=$('original_text').text;
            $ui.toast($l10n("已复制"))
        },*/

    },
};

var EncodeBtn = {
    type: 'button',
    props: {
        id: 'encode_btn',
        title: '编码',
        bgcolor: $color(Color_front),
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super).dividedBy(4) //multipliedBy(1.5)//
        make.centerY.equalTo(view.super) //.multipliedBy(1.5)//dividedBy(2)              
        make.width.equalTo(view.super).dividedBy(3.5)
        make.height.equalTo(view.super) //.dividedBy(2) 
    },
    events: {
        tapped() {
            if ($("label_key").text == "") { alert("请先设置转子数"); };
            //alert自带中断执行的功能

            /*
            $("original_text").text=str2utf8($("original_text").text);//报错"undefined"是因为没有设置转子数
            //$("original_text").text=$text.base64Encode($("original_text").text);
            $("original_text").text=strShuffleEncrypt($("original_text").text,$("label_key").text);
            */

            //AES
            pwd = $("label_key").text;
            $("original_text").text = Encrypt($("original_text").text);

            if ($("swh_value").on) {
                values = $('text_value').text;
                $('original_text').text = valuesEncode($('original_text').text);
                //$('original_text').blur();
            };
        }
    }
};

var DecodeBtn = {
    type: 'button',
    props: {
        id: 'decode_btn',
        title: '解码',
        bgcolor: $color(Color_front)
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super).dividedBy(1.4) //.multipliedBy(1.66)//dividedBy(3) //
        make.centerY.equalTo(view.super) //.multipliedBy(1.5)//dividedBy(2)              
        make.width.equalTo(view.super).dividedBy(3.5)
        make.height.equalTo(view.super) //.dividedBy(2) 
    },
    events: {
        tapped() {
            if ($("swh_value").on) {
                values = $('text_value').text;
                $('original_text').text = valuesDecode($('original_text').text);
                //$('original_text').blur();
            };

            /*      
            $("original_text").text=strShuffleDecrypt($("original_text").text,$("label_key").text);
            $("original_text").text=utf82str($("original_text").text)
            //$("original_text").text=$text.base64Decode($("original_text").text);
            */
            //AES
            pwd = $("label_key").text;
            $("original_text").text = Decrypt($("original_text").text);
        }
    }
};

var CoverImgBtn = { //按钮：选择掩图
    type: 'button',
    props: {
        id: 'cover_img_btn',
        title: '图片',
        bgcolor: $color(Color_front)

    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super).multipliedBy(1.25) //multipliedBy(1.5)//
        make.centerY.equalTo(view.super) //.multipliedBy(1.5)//dividedBy(2)              
        make.width.equalTo(view.super).dividedBy(3.5)
        make.height.equalTo(view.super) //.dividedBy(2) 
    },
    events: {
        tapped: function() {
            renderWebPageImage();
        },
    },
};

var SendBtn = {
    type: 'button',
    props: {
        id: 'send_btn',
        title: '发送',
        bgcolor: $color(Color_front)
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super).multipliedBy(1.75) //dividedBy(3) //
        make.centerY.equalTo(view.super) //.multipliedBy(1.5)//dividedBy(2)              
        make.width.equalTo(view.super).dividedBy(3.5)
        make.height.equalTo(view.super) //.dividedBy(2) 
    },
    events: {
        tapped() {
            $keyboard.send()
        }
    }
};

/*
      {
        type: 'button',
        props: {
          id: 'copy_result_btn',
          title: '拷贝结果'
        },
        layout (make, view) {
          make.height.equalTo(view.super)
          make.width.equalTo(100)
          make.left.equalTo($('decode_btn').right).offset(10)
        },
        events: {
          tapped () {
            $clipboard.copy({
              text: $('processed_text').text,
              ttl: 60 * 10,
              locally: false
            })
            $ui.toast('结果已拷贝')
          }
        }
      },
*/

var ControlBar = { //控件框
    type: 'view',
    props: {
        id: 'control_bar'
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super) //.dividedBy(3) //multipliedBy(1.5)//
        make.centerY.equalTo(view.super) //.multipliedBy(1.5)//dividedBy(2)              
        make.width.equalTo(view.super) //.dividedBy(3.5)
        make.height.equalTo(view.super) //.dividedBy(2) 
    },
    views: [
        EncodeBtn,
        DecodeBtn,
        CoverImgBtn,
        SendBtn,


    ]
};


var Web0 = {
    type: "web",
    props: {
        showsProgress: true, //false,
        //url:"http://tools.jb51.net/aideddesign/img_add_info"
        //url:"http://tool.aerfo.com/steganography"
        //url:"https://stylesuxx.github.io/steganography/"
        //url:"https://futureboy.us/stegano/"
        url: "https://www.beautifyconverter.com/image-steganography.php"

        //html:index,//+about+js1+js2+css1,
        /*
        `
         <html>
           <head>
             <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1.0, user-scalable=no">
           </head>
           <body>
          哈哈哈，我是一个网页，牛逼吧？
           </body>
         </html>
         `
         */
        //style:css1,

        /*
        script: function() {
                  js1
                  
                  }
        */

    },
    //layout:$layout.fill
    layout: function(make, view) {
        make.centerX.equalTo(view.super) //.dividedBy(3) //multipliedBy(1.5)//
        make.centerY.equalTo(view.super) //.multipliedBy(1.5)//dividedBy(2)              
        make.width.equalTo(view.super) //.dividedBy(3.5)
        make.height.equalTo(view.super) //.dividedBy(2) 
    },

}

let index1 = $file.read("assets/steganography1/index.html").string
var Web1 = {
    type: "web",
    props: {
        html: index1
    },
    layout: $layout.fill,
}


let index2 = $file.read("assets/steganography2/index.html").string
var Web2 = {
    type: "web",
    props: {
        html: index2
    },
    layout: $layout.fill,
}

let index3 = $file.read("assets/rsa/rsa_panel.html").string
var Web3 = {
    type: "web",
    props: {
        html: index3
    },
    layout: $layout.fill,
}

var Copybtn = { //按钮：拷贝选中内容
    type: 'button',
    props: {
        id: 'copy_btn',
        title: '拷贝选中',
        bgcolor: $color(Color_front)
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super).multipliedBy(1.25) //dividedBy(3) //
        make.centerY.equalTo(view.super) //.multipliedBy(1.5)//dividedBy(2)              
        make.width.equalTo(view.super).dividedBy(3.5)
        make.height.equalTo(view.super) //.dividedBy(2) 
    },
    events: {
        tapped() {
            $clipboard.text = $('original_text').text;
            $ui.toast($l10n("已复制"));
            //$keyboard.text;
        }
    },
};


/*
var ProcessedText=
{
    type: "text",
    props: {
        id: "processed_text",
        placeholder: '',
        borderWidth: 1,
        borderColor: $color('#999'),
        radius: 10,
        editable: false
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super)
        make.top.equalTo($('control_bar').bottom).offset(10)
        make.left.right.inset(10)
        make.height.equalTo(150)
    },
    events: {
        ready () {
        }
    }
};
*/



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var ViewBackGround = {
    type: "image",
    props: {
        data: $file.read("assets/background.PNG")
    },
    layout: $layout.fill,
};

var View0 = {
    type: "view",
    props: {
        id: "view0",
        //bgcolor:$color("#FF0000")
        bgcolor: $color(Color_background)
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super)
        make.top.equalTo(view.super).offset(10)
        make.left.right.inset(10)
        make.height.equalTo(30)
    },
    views: [
        //Matrix1,
        Menu1,
    ]
};



var View1 = {
    type: "view",
    props: {
        id: "view1",
        //bgcolor:$color("#FF0000")
        bgcolor: $color("clear")
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super)
            //make.top.equalTo($('view0').bottom).offset(10)
        make.top.equalTo(view.super).offset(10)
        make.left.right.inset(10)
        make.height.equalTo(30)
    },
    views: [
        GenValueBtn,
        keyboardBn,
        SaveRotorsBtn,
    ]
};

var View2 = {
    type: "view",
    props: {
        id: "view2",
        //bgcolor:$color("#FF0000")
        bgcolor: $color(Color_background)
    },
    layout: function(make, View1) {
        make.centerX.equalTo(View1)
        make.top.equalTo($('view1').bottom).offset(10)
        make.left.right.inset(10)
        make.height.equalTo(30)
    },
    views: [
        label_key,
        ValueText,
        Swh2Value,
    ]
};
var View3 = {
    type: "view",
    props: {
        id: "view3",
        bgcolor: $color(Color_background)
    },
    layout: function(make, View2) {
        make.centerX.equalTo(View2)
        make.top.equalTo($('view2').bottom).offset(10)
        make.left.right.inset(10)
        make.height.equalTo(30)
    },
    views: [
        ClearBtn,
        PasteBtn,
        CopyObtn,
        RsaBtn,
    ]
};


var View4 = {
    type: "view",
    props: {
        id: "view4",
        bgcolor: $color(Color_background)
    },
    layout: function(make, View3) {
        make.centerX.equalTo(View3)
        make.top.equalTo($('view3').bottom).offset(10)
        make.left.right.inset(10)
            //make.height.equalTo(60)
        make.bottom.inset(45)
    },
    views: [
        OriginalText,

    ]
};

var View5 = {
    type: "view",
    props: {
        id: "view5",
        bgcolor: $color(Color_background)
    },
    layout: function(make, View4) {
        make.centerX.equalTo(View4)
        make.top.equalTo($('view4').bottom).offset(10)
        make.left.right.inset(10)
        make.height.equalTo(30)
    },
    views: [
        ControlBar,

    ]
};

//////////////////////


var View2_0 = {
    type: "view",
    props: {
        id: "view2_0",
        //bgcolor:$color("#FF0000")
        bgcolor: $color(Color_background)
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super)
        make.top.equalTo(view.super).offset(10)
        make.left.right.inset(10)
        make.height.equalTo(30)
    },
    views: [
        //Matrix1,
        Menu2,
    ]
};

var View2_1 = {
    type: "view",
    props: {
        id: "view2_1",
        //bgcolor:$color("#FF0000")
        bgcolor: $color("clear")
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super)
        make.top.equalTo($('view2_0').bottom).offset(5)
        make.left.right.inset(10)
        make.height.equalTo(15)
    },
    views: [
        Label2,
    ]
};


var View2_3 = {
    type: "view",
    props: {
        id: "view2_3",
        bgcolor: $color(Color_background)
    },
    layout: function(make, view) {
        make.centerX.equalTo(view)
        make.top.equalTo($('view2_1').bottom).offset(5)
        make.left.right.inset(10)
        make.height.equalTo(30)
    },
    views: [
        ClearBtn,
        PasteBtn,
        CopyObtn,
        //Utf8Btn,

    ]
};


var ViewWebImage = {
    type: "view",
    props: {
        id: "view_web_image",
        bgcolor: $color(Color_background)
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super)
            //make.top.equalTo($('view3').bottom).offset(10)
        make.top.inset(100)
        make.bottom.inset(0)
        make.left.right.equalTo(view.super)
            //make.height.equalTo(view.super)
    },
    views: [
        Web2,

    ]
};

var ViewWebRSA = {
    type: "view",
    props: {
        id: "view_web_rsa",
        bgcolor: $color(Color_background)
    },
    layout: function(make, view) {
        make.centerX.equalTo(view.super)
            //make.top.equalTo($('view3').bottom).offset(10)
        make.top.inset(100)
        make.bottom.inset(0)
        make.left.right.equalTo(view.super)
            //make.height.equalTo(view.super)
    },
    views: [
        Web3,

    ]
};

/////////////////////////////////////////////////////////////////////////////////////////////
$ui.render({
    props: {
        title: "隐写输入法",
        bgcolor: $color(Color_background),
        // navBarHidden: true,
    },
    views: [
        ViewBackGround,
        //View0,
        View1,
        View2,
        View3,
        View4,
        View5,

    ]
});



function assert(...express) {
    const l = express.length;
    const msg = (typeof express[l - 1] === 'string') ? express[l - 1] : 'Assert Error';
    for (let b of express) {
        if (!b) {
            throw new Error(msg);
        }
    }
}

function randBin() {
    return Math.random() >= 0.5;
}




function str2utf8(str) {
    // return in hex

    const notEncoded = /[A-Za-z0-9\-\_\.\!\~\*\'\(\)]/g;
    const str1 = str.replace(notEncoded, c => c.codePointAt(0).toString(16));
    let str2 = encodeURIComponent(str1);
    const concated = str2.replace(/%/g, '').toUpperCase();
    return concated;
}

function utf82str(utfs) {
    assert(typeof utfs === 'string', 'utfs Error');

    const l = utfs.length;

    assert((l & 1) === 0);

    const splited = [];

    for (let i = 0; i < l; i++) {
        if ((i & 1) === 0) {
            splited.push('%');
        };
        splited.push(utfs[i]);
    };

    return decodeURIComponent(splited.join(''));
};

function hex2duo(hexs) {
    // duodecimal in array of number

    // '0'.. '9' -> 0.. 9
    // 'A'.. 'F' -> 10, c - 10    a2fFlag = 10
    //          or 11, c - 6      a2fFlag = 11
    assert(typeof hexs === 'string')

    const duo = [];

    for (let c of hexs) {
        const n = Number.parseInt(c, 16);
        if (n < 10) {
            duo.push(n);
        } else {
            if (randBin()) {
                duo.push(10);
                duo.push(n - 10);
            } else {
                duo.push(11);
                duo.push(n - 6);
            };
        };
    };
    return duo;
}

function duo2hex(duo) {
    assert(duo instanceof Array);

    const hex = [];

    const l = duo.length;

    let i = 0;

    while (i < l) {
        if (duo[i] < 10) {
            hex.push(duo[i]);
        } else {
            if (duo[i] === 10) {
                i++;
                hex.push(duo[i] + 10);
            } else {
                i++;
                hex.push(duo[i] + 6);
            }
        }
        i++;
    }
    return hex.map(v => v.toString(16).toUpperCase()).join('');
}


function duo2values(duo) {
    return duo.map(d => values[2 * d] + values[2 * d + 1]).join('');
}

function valuesDecode(encoded) {
    const duo = [];

    for (let c of encoded) {
        const i = values.indexOf(c);
        if (i === -1) {
            continue;
        } else if (i & 1) {
            continue;
        } else {
            // i is even
            duo.push(i >> 1);
        }
    }

    const hexs = duo2hex(duo);

    assert((hexs.length & 1) === 0);

    let str;
    try {
        str = utf82str(hexs);
    } catch (e) {
        throw e;
    }
    return str;
}

function valuesEncode(str) {
    return duo2values(hex2duo(str2utf8(str)));
}
/* ========================================================================================
 * ========================================================================================
 */

function completeTool(input_id) {
    return {
        type: "view",
        props: {
            height: 44
        },
        views: [{
            type: 'button',
            props: {
                title: '完成'
            },
            layout: function(make, view) {
                make.height.equalTo(32)
                make.width.equalTo(60)
                make.right.inset(10)
                make.centerY.equalTo(view.super)
            },
            events: {
                tapped(sender) {
                    $(input_id).blur()
                }
            }
        }]
    }
}
/* ========================================================================================
 * ========================================================================================
 */
function randomsort(a, b) {
    return Math.random() > .5 ? -1 : 1;
}

function dataPush(data) {
    var dataX = []
    for (var i in data) {
        dataX.push({
            label: {
                text: data[i]
            }
        })
    }
    return dataX
}

function ArrShuffleEncrypt(ArrX, Rotor) {
    var n = ArrX.length;
    var LeadNum = Rotor % n; //求得新数组的起始元素,即:转子数除以数组长度所得余数
    var Arr2 = [];
    for (var i = 0; i <= (n - 2) / 2; i++) { Arr2[2 * i] = ArrX[(LeadNum + i + n) % n]; };
    for (i = 1; i <= n / 2; i++) { Arr2[i + (i - 1)] = ArrX[(LeadNum - i + n) % n]; };

    return Arr2;
}

function ArrShuffleDecrypt(ArrX, Rotor) {
    var n = ArrX.length;
    var LeadNum = Rotor % n; //求得新数组的起始元素,即:转子数除以数组长度所得余数
    var Arr2 = [];
    for (var i = 0; i <= (n - 2) / 2; i++) { Arr2[(LeadNum + i + n) % n] = ArrX[2 * i]; };
    for (i = 1; i <= n / 2; i++) { Arr2[(LeadNum - i + n) % n] = ArrX[i + (i - 1)]; };

    return Arr2;
}


//数组无法直接重新赋值
function strShuffleEncrypt(str, Rotors) {
    //alert("开始加密");
    var ArrStr = [].concat(str.split(""));
    var ArrStr2 = [].concat(ArrStr);
    var strX;
    var ArrRotors = [].concat(Rotors.split(""));
    var n = ArrRotors.length;
    for (let i = 0; i <= n - 1; i++) {

        strX = ArrShuffleEncrypt(ArrStr2, ArrRotors[i]).join("");
        ArrStr2 = [];
        ArrStr2 = [].concat(strX.split(""));
    };
    return strX;
};

function strShuffleDecrypt(str, Rotors) {
    var ArrStr = [].concat(str.split(""));
    var ArrStr2 = [].concat(ArrStr);
    var strX;
    var ArrRotors = [].concat(Rotors.split(""));
    var n = ArrRotors.length;
    for (let i = n - 1; i >= 0; i--) {

        strX = ArrShuffleDecrypt(ArrStr2, ArrRotors[i]).join("");
        ArrStr2 = [];
        ArrStr2 = [].concat(strX.split(""));
    };
    return strX;
};



function renderWebPageImage() {
    var KbOldHeight = $keyboard.height;
    //储存键盘原始高度以便调整后可以还原
    $ui.push({
        //push与render效果相当，但是具有滑入和滑出功能
        props: {
            title: "离线网页", //term
            bgcolor: $color(Color_background)
        },
        views: [
            View2_0,
            View2_1,
            View2_3,
            ViewWebImage,
        ],
        layout: $layout.fill,
        events: {
            appeared: function() {
                $keyboard.height = 500;
            },
            disappeared: function() {
                $keyboard.height = KbOldHeight;
            },
            dealloc: function() {

            }
        }
    });
};

function renderWebPageRSA() {
    var KbOldHeight = $keyboard.height;
    //储存键盘原始高度以便调整后可以还原
    $ui.push({
        //push与render效果相当，但是具有滑入和滑出功能
        props: {
            title: "离线网页", //term
            bgcolor: $color(Color_background)
        },
        views: [
            View2_0,
            View2_1,
            View2_3,
            ViewWebRSA,
        ],
        layout: $layout.fill,
        events: {
            appeared: function() {
                $keyboard.height = 500;
            },
            disappeared: function() {
                $keyboard.height = KbOldHeight;
            },
            dealloc: function() {

            }
        }
    });
};


function readJsonKey(fileName, keyName) {
    if ($file.exists(fileName) == false) { alert("未找到文件"); } else {
        //alert("true");
        var jsonFile = $file.read(fileName);
        //var jsonObj = JSON.parse(jsonFile.string);
        var jsonObj = eval("(" + jsonFile.string + ")");
        //alert(jsonObj[keyName]);
        return jsonObj[keyName];
    };
};



function writeJsonKey(fileName, keyName, keyValue) {
    if ($file.exists(fileName) == false) { alert("未找到文件"); } else {
        //alert("true");
        var jsonFile = $file.read(fileName);
        //var jsonObj = JSON.parse(jsonFile.string);
        var jsonObj = eval("(" + jsonFile.string + ")");
        //alert(jsonObj[keyName]);
        jsonObj[keyName] = keyValue;
        //$file.write(jsonObj);
        $file.write({
            data: $data({ string: JSON.stringify(jsonObj) }),
            path: fileName,
        });
        alert(keyName + "的值修改为" + readJsonKey(fileName, keyName));
        return;
    };
};

function initValue() {
    //alert("初始化中");
    var num = $("label_key").text.replace(/[^0-9]/ig, "");
    var ArrRotors = num.split("");
    var n = ArrRotors.length;
    Arr1 = [].concat(Arr0);
    for (var i = 0; i <= n - 1; i++) {
        Arr1 = ArrShuffleEncrypt(Arr1, ArrRotors[i])
    };
    $("text_value").text = Arr1.join("");
};

//随机乱码
function scram(sybol_length) {
    var str;
    var x;
    var i;
    if (sybol_length > 20) {
        alert("Too many symbols, change " + sybol_length + " to a lesser value, 20 or under.");
        //document.cow.noyey.focus();
    } else {
        i = 0;
        str = "";
        while (i < sybol_length) {
            x = Math.round(Math.random() * 100)
            if (x < 33 || x > 255) {} else {
                i++;
                str += String.fromCharCode(x);
            }
        }
        return str;
    }
};

/*
//layout
var layout_center=
{
  make.centerX.equalTo(view.super),
  make.centerY.equalTo(view.super)           
  make.width.equalTo(view.super)
  make.height.equalTo(view.super)
};

var layout_left=
{
  make.left.equalTo(view.super)
  make.centerY.equalTo(view.super)//.multipliedBy(1.5)//dividedBy(2)              
  make.width.equalTo(view.super).dividedBy(2)
  make.height.equalTo(view.super)//.dividedBy(2) 
};

var layout_right=
{
  make.right.equalTo(view.super)
  make.centerY.equalTo(view.super)//.multipliedBy(1.5)//dividedBy(2)              
  make.width.equalTo(view.super).dividedBy(2)
  make.height.equalTo(view.super)
}

var layout_1of2=
{
  make.centerX.equalTo(view.super).dividedBy(2) //multipliedBy(1.5)//
  make.centerY.equalTo(view.super)//.multipliedBy(1.5)//dividedBy(2)              
  make.width.equalTo(view.super).dividedBy(2)
  make.height.equalTo(view.super)//.dividedBy(2) 
};

var layout_2of2=
{
  make.centerX.equalTo(view.super).multipliedBy(1.5)//
  make.centerY.equalTo(view.super)//.multipliedBy(1.5)//dividedBy(2)              
  make.width.equalTo(view.super).dividedBy(2)
  make.height.equalTo(view.super)//.dividedBy(2) 
};

var layout_1of3=
{
  make.centerX.equalTo(view.super).dividedBy(3) //multipliedBy(1.5)//
  make.centerY.equalTo(view.super)//.multipliedBy(1.5)//dividedBy(2)              
  make.width.equalTo(view.super).dividedBy(3.5)
  make.height.equalTo(view.super)//.dividedBy(2)     
}

var layout_2of3=
{
  make.centerX.equalTo(view.super)//.dividedBy(3) //multipliedBy(1.5)//
  make.centerY.equalTo(view.super)//.multipliedBy(1.5)//dividedBy(2)              
  make.width.equalTo(view.super).dividedBy(3.5)
  make.height.equalTo(view.super)//.dividedBy(2)     
};

var layout_3of3=
{
  make.centerX.equalTo(view.super).multipliedBy(1.5)//
  make.centerY.equalTo(view.super)//.multipliedBy(1.5)//dividedBy(2)              
  make.width.equalTo(view.super).dividedBy(3.5)
  make.height.equalTo(view.super)//.dividedBy(2)     
};

var layout_1of4=
{
  make.centerX.equalTo(view.super).dividedBy(4) //multipliedBy(1.5)//
  make.centerY.equalTo(view.super)//.multipliedBy(1.5)//dividedBy(2)              
  make.width.equalTo(view.super).dividedBy(3.5)
  make.height.equalTo(view.super)//.dividedBy(2) 
};

var layout_2of4=
{
  make.centerX.equalTo(view.super).dividedBy(1.4) //.multipliedBy(1.66)//dividedBy(3) //
  make.centerY.equalTo(view.super)//.multipliedBy(1.5)//dividedBy(2)              
  make.width.equalTo(view.super).dividedBy(3.5)
  make.height.equalTo(view.super)//.dividedBy(2) 
};

var layout_3of4=
{
  make.centerX.equalTo(view.super).multipliedBy(1.25) //multipliedBy(1.5)//
  make.centerY.equalTo(view.super)//.multipliedBy(1.5)//dividedBy(2)              
  make.width.equalTo(view.super).dividedBy(3.5)
  make.height.equalTo(view.super)//.dividedBy(2) 
};

var layout_4of4=
{
  make.centerX.equalTo(view.super).multipliedBy(1.75)//dividedBy(3) //
  make.centerY.equalTo(view.super)//.multipliedBy(1.5)//dividedBy(2)              
  make.width.equalTo(view.super).dividedBy(3.5)
  make.height.equalTo(view.super)//.dividedBy(2) 
};
*/



//############################
//AES
function Encrypt(word) {
    return CryptoJS.AES.encrypt(word, pwd).toString();
};

function Decrypt(word) {
    return CryptoJS.AES.decrypt(word, pwd).toString(CryptoJS.enc.Utf8);
};

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS = CryptoJS || function(u, p) {
    var d = {},
        l = d.lib = {},
        s = function() {},
        t = l.Base = {
            extend: function(a) {
                s.prototype = this;
                var c = new s;
                a && c.mixIn(a);
                c.hasOwnProperty("init") || (c.init = function() { c.$super.init.apply(this, arguments) });
                c.init.prototype = c;
                c.$super = this;
                return c
            },
            create: function() {
                var a = this.extend();
                a.init.apply(a, arguments);
                return a
            },
            init: function() {},
            mixIn: function(a) {
                for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]);
                a.hasOwnProperty("toString") && (this.toString = a.toString)
            },
            clone: function() { return this.init.prototype.extend(this) }
        },
        r = l.WordArray = t.extend({
            init: function(a, c) {
                a = this.words = a || [];
                this.sigBytes = c != p ? c : 4 * a.length
            },
            toString: function(a) { return (a || v).stringify(this) },
            concat: function(a) {
                var c = this.words,
                    e = a.words,
                    j = this.sigBytes;
                a = a.sigBytes;
                this.clamp();
                if (j % 4)
                    for (var k = 0; k < a; k++) c[j + k >>> 2] |= (e[k >>> 2] >>> 24 - 8 * (k % 4) & 255) << 24 - 8 * ((j + k) % 4);
                else if (65535 < e.length)
                    for (k = 0; k < a; k += 4) c[j + k >>> 2] = e[k >>> 2];
                else c.push.apply(c, e);
                this.sigBytes += a;
                return this
            },
            clamp: function() {
                var a = this.words,
                    c = this.sigBytes;
                a[c >>> 2] &= 4294967295 <<
                    32 - 8 * (c % 4);
                a.length = u.ceil(c / 4)
            },
            clone: function() {
                var a = t.clone.call(this);
                a.words = this.words.slice(0);
                return a
            },
            random: function(a) { for (var c = [], e = 0; e < a; e += 4) c.push(4294967296 * u.random() | 0); return new r.init(c, a) }
        }),
        w = d.enc = {},
        v = w.Hex = {
            stringify: function(a) {
                var c = a.words;
                a = a.sigBytes;
                for (var e = [], j = 0; j < a; j++) {
                    var k = c[j >>> 2] >>> 24 - 8 * (j % 4) & 255;
                    e.push((k >>> 4).toString(16));
                    e.push((k & 15).toString(16))
                }
                return e.join("")
            },
            parse: function(a) {
                for (var c = a.length, e = [], j = 0; j < c; j += 2) e[j >>> 3] |= parseInt(a.substr(j,
                    2), 16) << 24 - 4 * (j % 8);
                return new r.init(e, c / 2)
            }
        },
        b = w.Latin1 = {
            stringify: function(a) {
                var c = a.words;
                a = a.sigBytes;
                for (var e = [], j = 0; j < a; j++) e.push(String.fromCharCode(c[j >>> 2] >>> 24 - 8 * (j % 4) & 255));
                return e.join("")
            },
            parse: function(a) { for (var c = a.length, e = [], j = 0; j < c; j++) e[j >>> 2] |= (a.charCodeAt(j) & 255) << 24 - 8 * (j % 4); return new r.init(e, c) }
        },
        x = w.Utf8 = { stringify: function(a) { try { return decodeURIComponent(escape(b.stringify(a))) } catch (c) { throw Error("Malformed UTF-8 data"); } }, parse: function(a) { return b.parse(unescape(encodeURIComponent(a))) } },
        q = l.BufferedBlockAlgorithm = t.extend({
            reset: function() {
                this._data = new r.init;
                this._nDataBytes = 0
            },
            _append: function(a) {
                "string" == typeof a && (a = x.parse(a));
                this._data.concat(a);
                this._nDataBytes += a.sigBytes
            },
            _process: function(a) {
                var c = this._data,
                    e = c.words,
                    j = c.sigBytes,
                    k = this.blockSize,
                    b = j / (4 * k),
                    b = a ? u.ceil(b) : u.max((b | 0) - this._minBufferSize, 0);
                a = b * k;
                j = u.min(4 * a, j);
                if (a) {
                    for (var q = 0; q < a; q += k) this._doProcessBlock(e, q);
                    q = e.splice(0, a);
                    c.sigBytes -= j
                }
                return new r.init(q, j)
            },
            clone: function() {
                var a = t.clone.call(this);
                a._data = this._data.clone();
                return a
            },
            _minBufferSize: 0
        });
    l.Hasher = q.extend({
        cfg: t.extend(),
        init: function(a) {
            this.cfg = this.cfg.extend(a);
            this.reset()
        },
        reset: function() {
            q.reset.call(this);
            this._doReset()
        },
        update: function(a) {
            this._append(a);
            this._process();
            return this
        },
        finalize: function(a) { a && this._append(a); return this._doFinalize() },
        blockSize: 16,
        _createHelper: function(a) { return function(b, e) { return (new a.init(e)).finalize(b) } },
        _createHmacHelper: function(a) {
            return function(b, e) {
                return (new n.HMAC.init(a,
                    e)).finalize(b)
            }
        }
    });
    var n = d.algo = {};
    return d
}(Math);
(function() {
    var u = CryptoJS,
        p = u.lib.WordArray;
    u.enc.Base64 = {
        stringify: function(d) {
            var l = d.words,
                p = d.sigBytes,
                t = this._map;
            d.clamp();
            d = [];
            for (var r = 0; r < p; r += 3)
                for (var w = (l[r >>> 2] >>> 24 - 8 * (r % 4) & 255) << 16 | (l[r + 1 >>> 2] >>> 24 - 8 * ((r + 1) % 4) & 255) << 8 | l[r + 2 >>> 2] >>> 24 - 8 * ((r + 2) % 4) & 255, v = 0; 4 > v && r + 0.75 * v < p; v++) d.push(t.charAt(w >>> 6 * (3 - v) & 63));
            if (l = t.charAt(64))
                for (; d.length % 4;) d.push(l);
            return d.join("")
        },
        parse: function(d) {
            var l = d.length,
                s = this._map,
                t = s.charAt(64);
            t && (t = d.indexOf(t), -1 != t && (l = t));
            for (var t = [], r = 0, w = 0; w <
                l; w++)
                if (w % 4) {
                    var v = s.indexOf(d.charAt(w - 1)) << 2 * (w % 4),
                        b = s.indexOf(d.charAt(w)) >>> 6 - 2 * (w % 4);
                    t[r >>> 2] |= (v | b) << 24 - 8 * (r % 4);
                    r++
                }
            return p.create(t, r)
        },
        _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    }
})();
(function(u) {
    function p(b, n, a, c, e, j, k) { b = b + (n & a | ~n & c) + e + k; return (b << j | b >>> 32 - j) + n }

    function d(b, n, a, c, e, j, k) { b = b + (n & c | a & ~c) + e + k; return (b << j | b >>> 32 - j) + n }

    function l(b, n, a, c, e, j, k) { b = b + (n ^ a ^ c) + e + k; return (b << j | b >>> 32 - j) + n }

    function s(b, n, a, c, e, j, k) { b = b + (a ^ (n | ~c)) + e + k; return (b << j | b >>> 32 - j) + n }
    for (var t = CryptoJS, r = t.lib, w = r.WordArray, v = r.Hasher, r = t.algo, b = [], x = 0; 64 > x; x++) b[x] = 4294967296 * u.abs(u.sin(x + 1)) | 0;
    r = r.MD5 = v.extend({
        _doReset: function() { this._hash = new w.init([1732584193, 4023233417, 2562383102, 271733878]) },
        _doProcessBlock: function(q, n) {
            for (var a = 0; 16 > a; a++) {
                var c = n + a,
                    e = q[c];
                q[c] = (e << 8 | e >>> 24) & 16711935 | (e << 24 | e >>> 8) & 4278255360
            }
            var a = this._hash.words,
                c = q[n + 0],
                e = q[n + 1],
                j = q[n + 2],
                k = q[n + 3],
                z = q[n + 4],
                r = q[n + 5],
                t = q[n + 6],
                w = q[n + 7],
                v = q[n + 8],
                A = q[n + 9],
                B = q[n + 10],
                C = q[n + 11],
                u = q[n + 12],
                D = q[n + 13],
                E = q[n + 14],
                x = q[n + 15],
                f = a[0],
                m = a[1],
                g = a[2],
                h = a[3],
                f = p(f, m, g, h, c, 7, b[0]),
                h = p(h, f, m, g, e, 12, b[1]),
                g = p(g, h, f, m, j, 17, b[2]),
                m = p(m, g, h, f, k, 22, b[3]),
                f = p(f, m, g, h, z, 7, b[4]),
                h = p(h, f, m, g, r, 12, b[5]),
                g = p(g, h, f, m, t, 17, b[6]),
                m = p(m, g, h, f, w, 22, b[7]),
                f = p(f, m, g, h, v, 7, b[8]),
                h = p(h, f, m, g, A, 12, b[9]),
                g = p(g, h, f, m, B, 17, b[10]),
                m = p(m, g, h, f, C, 22, b[11]),
                f = p(f, m, g, h, u, 7, b[12]),
                h = p(h, f, m, g, D, 12, b[13]),
                g = p(g, h, f, m, E, 17, b[14]),
                m = p(m, g, h, f, x, 22, b[15]),
                f = d(f, m, g, h, e, 5, b[16]),
                h = d(h, f, m, g, t, 9, b[17]),
                g = d(g, h, f, m, C, 14, b[18]),
                m = d(m, g, h, f, c, 20, b[19]),
                f = d(f, m, g, h, r, 5, b[20]),
                h = d(h, f, m, g, B, 9, b[21]),
                g = d(g, h, f, m, x, 14, b[22]),
                m = d(m, g, h, f, z, 20, b[23]),
                f = d(f, m, g, h, A, 5, b[24]),
                h = d(h, f, m, g, E, 9, b[25]),
                g = d(g, h, f, m, k, 14, b[26]),
                m = d(m, g, h, f, v, 20, b[27]),
                f = d(f, m, g, h, D, 5, b[28]),
                h = d(h, f,
                    m, g, j, 9, b[29]),
                g = d(g, h, f, m, w, 14, b[30]),
                m = d(m, g, h, f, u, 20, b[31]),
                f = l(f, m, g, h, r, 4, b[32]),
                h = l(h, f, m, g, v, 11, b[33]),
                g = l(g, h, f, m, C, 16, b[34]),
                m = l(m, g, h, f, E, 23, b[35]),
                f = l(f, m, g, h, e, 4, b[36]),
                h = l(h, f, m, g, z, 11, b[37]),
                g = l(g, h, f, m, w, 16, b[38]),
                m = l(m, g, h, f, B, 23, b[39]),
                f = l(f, m, g, h, D, 4, b[40]),
                h = l(h, f, m, g, c, 11, b[41]),
                g = l(g, h, f, m, k, 16, b[42]),
                m = l(m, g, h, f, t, 23, b[43]),
                f = l(f, m, g, h, A, 4, b[44]),
                h = l(h, f, m, g, u, 11, b[45]),
                g = l(g, h, f, m, x, 16, b[46]),
                m = l(m, g, h, f, j, 23, b[47]),
                f = s(f, m, g, h, c, 6, b[48]),
                h = s(h, f, m, g, w, 10, b[49]),
                g = s(g, h, f, m,
                    E, 15, b[50]),
                m = s(m, g, h, f, r, 21, b[51]),
                f = s(f, m, g, h, u, 6, b[52]),
                h = s(h, f, m, g, k, 10, b[53]),
                g = s(g, h, f, m, B, 15, b[54]),
                m = s(m, g, h, f, e, 21, b[55]),
                f = s(f, m, g, h, v, 6, b[56]),
                h = s(h, f, m, g, x, 10, b[57]),
                g = s(g, h, f, m, t, 15, b[58]),
                m = s(m, g, h, f, D, 21, b[59]),
                f = s(f, m, g, h, z, 6, b[60]),
                h = s(h, f, m, g, C, 10, b[61]),
                g = s(g, h, f, m, j, 15, b[62]),
                m = s(m, g, h, f, A, 21, b[63]);
            a[0] = a[0] + f | 0;
            a[1] = a[1] + m | 0;
            a[2] = a[2] + g | 0;
            a[3] = a[3] + h | 0
        },
        _doFinalize: function() {
            var b = this._data,
                n = b.words,
                a = 8 * this._nDataBytes,
                c = 8 * b.sigBytes;
            n[c >>> 5] |= 128 << 24 - c % 32;
            var e = u.floor(a /
                4294967296);
            n[(c + 64 >>> 9 << 4) + 15] = (e << 8 | e >>> 24) & 16711935 | (e << 24 | e >>> 8) & 4278255360;
            n[(c + 64 >>> 9 << 4) + 14] = (a << 8 | a >>> 24) & 16711935 | (a << 24 | a >>> 8) & 4278255360;
            b.sigBytes = 4 * (n.length + 1);
            this._process();
            b = this._hash;
            n = b.words;
            for (a = 0; 4 > a; a++) c = n[a], n[a] = (c << 8 | c >>> 24) & 16711935 | (c << 24 | c >>> 8) & 4278255360;
            return b
        },
        clone: function() {
            var b = v.clone.call(this);
            b._hash = this._hash.clone();
            return b
        }
    });
    t.MD5 = v._createHelper(r);
    t.HmacMD5 = v._createHmacHelper(r)
})(Math);
(function() {
    var u = CryptoJS,
        p = u.lib,
        d = p.Base,
        l = p.WordArray,
        p = u.algo,
        s = p.EvpKDF = d.extend({
            cfg: d.extend({ keySize: 4, hasher: p.MD5, iterations: 1 }),
            init: function(d) { this.cfg = this.cfg.extend(d) },
            compute: function(d, r) {
                for (var p = this.cfg, s = p.hasher.create(), b = l.create(), u = b.words, q = p.keySize, p = p.iterations; u.length < q;) {
                    n && s.update(n);
                    var n = s.update(d).finalize(r);
                    s.reset();
                    for (var a = 1; a < p; a++) n = s.finalize(n), s.reset();
                    b.concat(n)
                }
                b.sigBytes = 4 * q;
                return b
            }
        });
    u.EvpKDF = function(d, l, p) {
        return s.create(p).compute(d,
            l)
    }
})();
CryptoJS.lib.Cipher || function(u) {
    var p = CryptoJS,
        d = p.lib,
        l = d.Base,
        s = d.WordArray,
        t = d.BufferedBlockAlgorithm,
        r = p.enc.Base64,
        w = p.algo.EvpKDF,
        v = d.Cipher = t.extend({
            cfg: l.extend(),
            createEncryptor: function(e, a) { return this.create(this._ENC_XFORM_MODE, e, a) },
            createDecryptor: function(e, a) { return this.create(this._DEC_XFORM_MODE, e, a) },
            init: function(e, a, b) {
                this.cfg = this.cfg.extend(b);
                this._xformMode = e;
                this._key = a;
                this.reset()
            },
            reset: function() {
                t.reset.call(this);
                this._doReset()
            },
            process: function(e) { this._append(e); return this._process() },
            finalize: function(e) { e && this._append(e); return this._doFinalize() },
            keySize: 4,
            ivSize: 4,
            _ENC_XFORM_MODE: 1,
            _DEC_XFORM_MODE: 2,
            _createHelper: function(e) { return { encrypt: function(b, k, d) { return ("string" == typeof k ? c : a).encrypt(e, b, k, d) }, decrypt: function(b, k, d) { return ("string" == typeof k ? c : a).decrypt(e, b, k, d) } } }
        });
    d.StreamCipher = v.extend({ _doFinalize: function() { return this._process(!0) }, blockSize: 1 });
    var b = p.mode = {},
        x = function(e, a, b) {
            var c = this._iv;
            c ? this._iv = u : c = this._prevBlock;
            for (var d = 0; d < b; d++) e[a + d] ^=
                c[d]
        },
        q = (d.BlockCipherMode = l.extend({
            createEncryptor: function(e, a) { return this.Encryptor.create(e, a) },
            createDecryptor: function(e, a) { return this.Decryptor.create(e, a) },
            init: function(e, a) {
                this._cipher = e;
                this._iv = a
            }
        })).extend();
    q.Encryptor = q.extend({
        processBlock: function(e, a) {
            var b = this._cipher,
                c = b.blockSize;
            x.call(this, e, a, c);
            b.encryptBlock(e, a);
            this._prevBlock = e.slice(a, a + c)
        }
    });
    q.Decryptor = q.extend({
        processBlock: function(e, a) {
            var b = this._cipher,
                c = b.blockSize,
                d = e.slice(a, a + c);
            b.decryptBlock(e, a);
            x.call(this,
                e, a, c);
            this._prevBlock = d
        }
    });
    b = b.CBC = q;
    q = (p.pad = {}).Pkcs7 = {
        pad: function(a, b) {
            for (var c = 4 * b, c = c - a.sigBytes % c, d = c << 24 | c << 16 | c << 8 | c, l = [], n = 0; n < c; n += 4) l.push(d);
            c = s.create(l, c);
            a.concat(c)
        },
        unpad: function(a) { a.sigBytes -= a.words[a.sigBytes - 1 >>> 2] & 255 }
    };
    d.BlockCipher = v.extend({
        cfg: v.cfg.extend({ mode: b, padding: q }),
        reset: function() {
            v.reset.call(this);
            var a = this.cfg,
                b = a.iv,
                a = a.mode;
            if (this._xformMode == this._ENC_XFORM_MODE) var c = a.createEncryptor;
            else c = a.createDecryptor, this._minBufferSize = 1;
            this._mode = c.call(a,
                this, b && b.words)
        },
        _doProcessBlock: function(a, b) { this._mode.processBlock(a, b) },
        _doFinalize: function() { var a = this.cfg.padding; if (this._xformMode == this._ENC_XFORM_MODE) { a.pad(this._data, this.blockSize); var b = this._process(!0) } else b = this._process(!0), a.unpad(b); return b },
        blockSize: 4
    });
    var n = d.CipherParams = l.extend({ init: function(a) { this.mixIn(a) }, toString: function(a) { return (a || this.formatter).stringify(this) } }),
        b = (p.format = {}).OpenSSL = {
            stringify: function(a) {
                var b = a.ciphertext;
                a = a.salt;
                return (a ? s.create([1398893684,
                    1701076831
                ]).concat(a).concat(b) : b).toString(r)
            },
            parse: function(a) {
                a = r.parse(a);
                var b = a.words;
                if (1398893684 == b[0] && 1701076831 == b[1]) {
                    var c = s.create(b.slice(2, 4));
                    b.splice(0, 4);
                    a.sigBytes -= 16
                }
                return n.create({ ciphertext: a, salt: c })
            }
        },
        a = d.SerializableCipher = l.extend({
            cfg: l.extend({ format: b }),
            encrypt: function(a, b, c, d) {
                d = this.cfg.extend(d);
                var l = a.createEncryptor(c, d);
                b = l.finalize(b);
                l = l.cfg;
                return n.create({ ciphertext: b, key: c, iv: l.iv, algorithm: a, mode: l.mode, padding: l.padding, blockSize: a.blockSize, formatter: d.format })
            },
            decrypt: function(a, b, c, d) {
                d = this.cfg.extend(d);
                b = this._parse(b, d.format);
                return a.createDecryptor(c, d).finalize(b.ciphertext)
            },
            _parse: function(a, b) { return "string" == typeof a ? b.parse(a, this) : a }
        }),
        p = (p.kdf = {}).OpenSSL = {
            execute: function(a, b, c, d) {
                d || (d = s.random(8));
                a = w.create({ keySize: b + c }).compute(a, d);
                c = s.create(a.words.slice(b), 4 * c);
                a.sigBytes = 4 * b;
                return n.create({ key: a, iv: c, salt: d })
            }
        },
        c = d.PasswordBasedCipher = a.extend({
            cfg: a.cfg.extend({ kdf: p }),
            encrypt: function(b, c, d, l) {
                l = this.cfg.extend(l);
                d = l.kdf.execute(d,
                    b.keySize, b.ivSize);
                l.iv = d.iv;
                b = a.encrypt.call(this, b, c, d.key, l);
                b.mixIn(d);
                return b
            },
            decrypt: function(b, c, d, l) {
                l = this.cfg.extend(l);
                c = this._parse(c, l.format);
                d = l.kdf.execute(d, b.keySize, b.ivSize, c.salt);
                l.iv = d.iv;
                return a.decrypt.call(this, b, c, d.key, l)
            }
        })
}();
(function() {
    for (var u = CryptoJS, p = u.lib.BlockCipher, d = u.algo, l = [], s = [], t = [], r = [], w = [], v = [], b = [], x = [], q = [], n = [], a = [], c = 0; 256 > c; c++) a[c] = 128 > c ? c << 1 : c << 1 ^ 283;
    for (var e = 0, j = 0, c = 0; 256 > c; c++) {
        var k = j ^ j << 1 ^ j << 2 ^ j << 3 ^ j << 4,
            k = k >>> 8 ^ k & 255 ^ 99;
        l[e] = k;
        s[k] = e;
        var z = a[e],
            F = a[z],
            G = a[F],
            y = 257 * a[k] ^ 16843008 * k;
        t[e] = y << 24 | y >>> 8;
        r[e] = y << 16 | y >>> 16;
        w[e] = y << 8 | y >>> 24;
        v[e] = y;
        y = 16843009 * G ^ 65537 * F ^ 257 * z ^ 16843008 * e;
        b[k] = y << 24 | y >>> 8;
        x[k] = y << 16 | y >>> 16;
        q[k] = y << 8 | y >>> 24;
        n[k] = y;
        e ? (e = z ^ a[a[a[G ^ z]]], j ^= a[a[j]]) : e = j = 1
    }
    var H = [0, 1, 2, 4, 8,
            16, 32, 64, 128, 27, 54
        ],
        d = d.AES = p.extend({
            _doReset: function() {
                for (var a = this._key, c = a.words, d = a.sigBytes / 4, a = 4 * ((this._nRounds = d + 6) + 1), e = this._keySchedule = [], j = 0; j < a; j++)
                    if (j < d) e[j] = c[j];
                    else {
                        var k = e[j - 1];
                        j % d ? 6 < d && 4 == j % d && (k = l[k >>> 24] << 24 | l[k >>> 16 & 255] << 16 | l[k >>> 8 & 255] << 8 | l[k & 255]) : (k = k << 8 | k >>> 24, k = l[k >>> 24] << 24 | l[k >>> 16 & 255] << 16 | l[k >>> 8 & 255] << 8 | l[k & 255], k ^= H[j / d | 0] << 24);
                        e[j] = e[j - d] ^ k
                    }
                c = this._invKeySchedule = [];
                for (d = 0; d < a; d++) j = a - d, k = d % 4 ? e[j] : e[j - 4], c[d] = 4 > d || 4 >= j ? k : b[l[k >>> 24]] ^ x[l[k >>> 16 & 255]] ^ q[l[k >>>
                    8 & 255]] ^ n[l[k & 255]]
            },
            encryptBlock: function(a, b) { this._doCryptBlock(a, b, this._keySchedule, t, r, w, v, l) },
            decryptBlock: function(a, c) {
                var d = a[c + 1];
                a[c + 1] = a[c + 3];
                a[c + 3] = d;
                this._doCryptBlock(a, c, this._invKeySchedule, b, x, q, n, s);
                d = a[c + 1];
                a[c + 1] = a[c + 3];
                a[c + 3] = d
            },
            _doCryptBlock: function(a, b, c, d, e, j, l, f) {
                for (var m = this._nRounds, g = a[b] ^ c[0], h = a[b + 1] ^ c[1], k = a[b + 2] ^ c[2], n = a[b + 3] ^ c[3], p = 4, r = 1; r < m; r++) var q = d[g >>> 24] ^ e[h >>> 16 & 255] ^ j[k >>> 8 & 255] ^ l[n & 255] ^ c[p++],
                    s = d[h >>> 24] ^ e[k >>> 16 & 255] ^ j[n >>> 8 & 255] ^ l[g & 255] ^ c[p++],
                    t =
                    d[k >>> 24] ^ e[n >>> 16 & 255] ^ j[g >>> 8 & 255] ^ l[h & 255] ^ c[p++],
                    n = d[n >>> 24] ^ e[g >>> 16 & 255] ^ j[h >>> 8 & 255] ^ l[k & 255] ^ c[p++],
                    g = q,
                    h = s,
                    k = t;
                q = (f[g >>> 24] << 24 | f[h >>> 16 & 255] << 16 | f[k >>> 8 & 255] << 8 | f[n & 255]) ^ c[p++];
                s = (f[h >>> 24] << 24 | f[k >>> 16 & 255] << 16 | f[n >>> 8 & 255] << 8 | f[g & 255]) ^ c[p++];
                t = (f[k >>> 24] << 24 | f[n >>> 16 & 255] << 16 | f[g >>> 8 & 255] << 8 | f[h & 255]) ^ c[p++];
                n = (f[n >>> 24] << 24 | f[g >>> 16 & 255] << 16 | f[h >>> 8 & 255] << 8 | f[k & 255]) ^ c[p++];
                a[b] = q;
                a[b + 1] = s;
                a[b + 2] = t;
                a[b + 3] = n
            },
            keySize: 8
        });
    u.AES = p._createHelper(d)
})();