// initialize
window.onload = function() {
    // add action to the file input
    var input = document.getElementById('file');
    input.addEventListener('change', importImage);

    // add action to the encode button
    var encodeButton = document.getElementById('encode');
    encodeButton.addEventListener('click', encode);

    // add action to the decode button
    var decodeButton = document.getElementById('decode');
    decodeButton.addEventListener('click', decode);
};




// artificially limit the message size
var maxMessageSize = 1000;

// put image in the canvas and display it
var importImage = function(e) {
    var reader = new FileReader();

    reader.onload = function(event) {
        // set the preview
        document.getElementById('preview').style.display = 'block';
        document.getElementById('preview').src = event.target.result;

        // wipe all the fields clean
        document.getElementById('message').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password2').value = '';
        document.getElementById('messageDecoded').innerHTML = '';

        // read the data into the canvas element
        var img = new Image();
        img.onload = function() {
            var ctx = document.getElementById('canvas').getContext('2d');
            ctx.canvas.width = img.width;
            ctx.canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            decode();
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(e.target.files[0]);
};

// encode the image and save it
var encode = function() {
    var message = document.getElementById('message').value;
    var password = document.getElementById('password').value;
    var output = document.getElementById('output');
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    // encrypt the message with supplied password if necessary
    if (password.length > 0) {
        message = sjcl.encrypt(password, message);
    } else {
        message = JSON.stringify({ 'text': message });
    }

    // exit early if the message is too big for the image
    var pixelCount = ctx.canvas.width * ctx.canvas.height;
    if ((message.length + 1) * 16 > pixelCount * 4 * 0.75) {
        alert('Message is too big for the image.');
        return;
    }

    // exit early if the message is above an artificial limit
    if (message.length > maxMessageSize) {
        alert('Message is too big.');
        return;
    }

    // encode the encrypted message with the supplied password
    var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    encodeMessage(imgData.data, sjcl.hash.sha256.hash(password), message);
    ctx.putImageData(imgData, 0, 0);

    // view the new image
    alert('Done! When the image appears, save and share it with someone.');

    output.src = canvas.toDataURL();

    //*********************
    //新增内容：将密图复制到剪贴板
    //$clipboard.image=output;
    //if($clipboard.image===output){alert("图片已复制到剪贴板")};
    //$clipboard.image = canvas.toDataURL();
    //var   div   =   document.getElementById('divId');   

    saveAsLocalImage();
};

// decode the image and display the contents if there is anything
var decode = function() {
    var password = document.getElementById('password2').value;
    var passwordFail = 'Password is incorrect or there is nothing here.';

    // decode the message with the supplied password
    var ctx = document.getElementById('canvas').getContext('2d');
    var imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    var message = decodeMessage(imgData.data, sjcl.hash.sha256.hash(password));
    //**********************
    //alert(message);
    //copy2clipboard(message);
    //******************************
    // try to parse the JSON
    var obj = null;
    try {
        obj = JSON.parse(message);
        //alert(obj.text);
        //copy2clipboard(obj.text);
    } catch (e) {
        // display the "choose" view 读图报错无信息或有密码则显示加密/解密选择界面

        document.getElementById('choose').style.display = 'block';
        document.getElementById('reveal').style.display = 'none';

        if (password.length > 0) {
            alert(passwordFail);
        }
    }

    // display the "reveal" view 图片携带信息则直接显示信息
    if (obj) {
        document.getElementById('choose').style.display = 'none';
        document.getElementById('reveal').style.display = 'block';
        //alert(obj.text);
        //调用复制函数
        //copy2clipboard(obj.text);

        // decrypt if necessary
        if (obj.ct) {
            try {
                obj.text = sjcl.decrypt(password, message);
            } catch (e) {
                alert(passwordFail);
            }
        }

        // escape special characters
        var escChars = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            '\'': '&#39;',
            '/': '&#x2F;',
            '\n': '<br/>'
        };
        var escHtml = function(string) {
            return String(string).replace(/[&<>"'\/\n]/g, function(c) {
                return escChars[c];
            });
        };
        document.getElementById('messageDecoded').innerHTML = escHtml(obj.text);
    }

    //*******************
    //调用复制函数
    copy2clipboard(obj.text);


};

// returns a 1 or 0 for the bit in 'location'
var getBit = function(number, location) {
    return ((number >> location) & 1);
};

// sets the bit in 'location' to 'bit' (either a 1 or 0)
var setBit = function(number, location, bit) {
    return (number & ~(1 << location)) | (bit << location);
};

// returns an array of 1s and 0s for a 2-byte number
var getBitsFromNumber = function(number) {
    var bits = [];
    for (var i = 0; i < 16; i++) {
        bits.push(getBit(number, i));
    }
    return bits;
};

// returns the next 2-byte number
var getNumberFromBits = function(bytes, history, hash) {
    var number = 0,
        pos = 0;
    while (pos < 16) {
        var loc = getNextLocation(history, hash, bytes.length);
        var bit = getBit(bytes[loc], 0);
        number = setBit(number, pos, bit);
        pos++;
    }
    return number;
};

// returns an array of 1s and 0s for the string 'message'
var getMessageBits = function(message) {
    var messageBits = [];
    for (var i = 0; i < message.length; i++) {
        var code = message.charCodeAt(i);
        messageBits = messageBits.concat(getBitsFromNumber(code));
    }
    return messageBits;
};

// gets the next location to store a bit
var getNextLocation = function(history, hash, total) {
    var pos = history.length;
    var loc = Math.abs(hash[pos % hash.length] * (pos + 1)) % total;
    while (true) {
        if (loc >= total) {
            loc = 0;
        } else if (history.indexOf(loc) >= 0) {
            loc++;
        } else if ((loc + 1) % 4 === 0) {
            loc++;
        } else {
            history.push(loc);
            return loc;
        }
    }
};

// encodes the supplied 'message' into the CanvasPixelArray 'colors'
var encodeMessage = function(colors, hash, message) {
    // make an array of bits from the message
    var messageBits = getBitsFromNumber(message.length);
    messageBits = messageBits.concat(getMessageBits(message));

    // this will store the color values we've already modified
    var history = [];

    // encode the bits into the pixels
    var pos = 0;
    while (pos < messageBits.length) {
        // set the next color value to the next bit
        var loc = getNextLocation(history, hash, colors.length);
        colors[loc] = setBit(colors[loc], 0, messageBits[pos]);

        // set the alpha value in this pixel to 255
        // we have to do this because browsers do premultiplied alpha
        // see for example: http://stackoverflow.com/q/4309364
        while ((loc + 1) % 4 !== 0) {
            loc++;
        }
        colors[loc] = 255;

        pos++;
    }
};

// returns the message encoded in the CanvasPixelArray 'colors'
var decodeMessage = function(colors, hash) {
    // this will store the color values we've already read from
    var history = [];

    // get the message size
    var messageSize = getNumberFromBits(colors, history, hash);

    // exit early if the message is too big for the image
    if ((messageSize + 1) * 16 > colors.length * 0.75) {
        return '';
    }

    // exit early if the message is above an artificial limit
    if (messageSize === 0 || messageSize > maxMessageSize) {
        return '';
    }

    // put each character into an array
    var message = [];
    for (var i = 0; i < messageSize; i++) {
        var code = getNumberFromBits(colors, history, hash);
        message.push(String.fromCharCode(code));
    }

    // the characters should parse into valid JSON
    return message.join('');

};

var copy2clipboard = function(msg) {

    const inputTemp = document.createElement('input');
    //inputTemp2.setAttribute('readonly', 'readonly');
    inputTemp.setAttribute('value', msg);
    document.body.appendChild(inputTemp);
    //inputTemp2.setSelectionRange(0, input.value.length);
    inputTemp.setSelectionRange(0, 9999);
    if (document.execCommand('copy')) {
        document.execCommand('copy');
        console.log('内容已复制');
        alert("内容已复制");
    };
    document.body.removeChild(inputTemp);
};

function saveAsLocalImage() {
    //alert("调用函数保存图片到本地")
    var myCanvas = document.getElementById('canvas');
    // here is the most important part because if you dont replace you will get a DOM 18 exception.  

    var image = myCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream;Content-Disposition: attachment;filename=foobar.png");
    //var image = myCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    //alert(image);

    window.location.href = image; // it will save locally

    alert(image);
    $clipboard.image = image;
    /*
          image.contentEditable = 'true';   
          var controlRange;   
          if   (document.body.createControlRange) {   
              controlRange = document.body.createControlRange();   
              controlRange.addElement(image);   
              //controlRange.execCommand('Copy');
              if(controlRange.execCommand('Copy')){
                 controlRange.execCommand('Copy');
                 console.log('内容已复制');
                 alert("内容已复制");
               };
          };
          image.contentEditable = 'false';
       */

};