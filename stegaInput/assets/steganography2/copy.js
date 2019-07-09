//添加复制到剪贴板函数
function copy(message) {
        var input = document.createElement("input");
            input.value = message;
            document.body.appendChild(input);
            input.select();
            input.setSelectionRange(0, input.value.length), document.execCommand('Copy');
            document.body.removeChild(input);
            $.toast("复制成功", "text");
};


//以下代码可实现网页中复制已知变量或字串到剪贴板
    /*
        const inputTemp2 = document.createElement('input');
        inputTemp2.setAttribute('readonly', 'readonly');
        inputTemp2.setAttribute('value', obj.text);
        document.body.appendChild(inputTemp2);
        inputTemp2.setSelectionRange(0, 9999);
        if (document.execCommand('copy')) {
           document.execCommand('copy');
           console.log('内容已复制');
           alert("内容已复制");
         };
         document.body.removeChild(inputTemp2);
         */
         //以上代码可实现网页中复制已知变量或字串到剪贴板


/*
//以下代码实现复制图片到剪贴板
var   oPopup   =   window.createPopup();   
  function   ButtonClick()   
  {   
  var   div   =   document.getElementById('divId');   
  div.contentEditable   =   'true';   
  var   controlRange;   
  if   (document.body.createControlRange)   {   
  controlRange   =   document.body.createControlRange();   
  controlRange.addElement(div);   
  controlRange.execCommand('Copy');   
  }   
  div.contentEditable   =   'false';   
  }   
*/
