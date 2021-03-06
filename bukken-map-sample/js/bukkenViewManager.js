/**
 * @author raito.ochi
 */

/**
 * ピン（マーカー）の情報を扱うクラス
 */
function BukkenViewManager(map) {
    //================== コンストラクタ ==================//
    var pins = [];   // ピンのオブジェクトの配列

    //===================== メソッド =====================//
    /**
     * 物件情報のリストを受け取り、ピンを立てる。
     */
    this.update = function(bukkenInfoList) {
        // pinsの初期化
        for (var pin of pins) {
            pin.del();
            delete pin;
        }
        pins.length = 0;
        // ピンのオブジェクトの配列を新しく作成
        for (var bukkenInfo of bukkenInfoList) {
            pins.push(new Pin(bukkenInfo, map));
        }
    }
}

/**
 * ピンのオブジェクト
 */
function Pin(bukkenInfo, map) {
    //================== コンストラクタ ==================//
    var marker = new google.maps.Marker({     // Google Map上のマーカーのオブジェクト
        map: map,
        position: new google.maps.LatLng(bukkenInfo.lat, bukkenInfo.lng)
    });

    // 地図上のマーカーがクリックされた際に呼ばれるイベントハンドラの設定
    google.maps.event.addListener(marker, 'click', onClick.bind(this));

    //===================== メソッド =====================//
    /**
     * マーカーの画像を設定する
     */
    this.setIcon = function(url) {
        marker.setIcon(url);
    }

    /**
     * 地図上のマーカーがクリックされた際の処理
     */
    function onClick() {
        // 物件情報を画面に表示
        insertHTMLElement('bukken', generateHTMLElement(bukkenInfo));
    }

    // pinを消す
    this.del = function() {
        if (marker) {
            marker.setMap(null);
            delete marker;
        }
    }
}

/**
 * 物件情報のHTML要素を生成
 */
function generateHTMLElement(bukkenInfo) {
    var element = document.createElement('div');
    element.setAttribute('id', 'bukken');
    element.setAttribute('class', 'tatemono');

    var innerHTML = '\
            <div id="tatemono_name" class="tatemono-name"><#tatemono_name></div>\
            <div id="bukken-image" class="image"></div>\
            <div id="cotent" class="content-text">\
                <table class="table">\
                    <tr>\
                        <td>築</td>\
                        <td><#chikunensu></td>\
                        <td>年</td>\
                    </tr>\
                    <tr>\
                        <td>賃料</td>\
                        <td><#chinryo></td>\
                        <td>円</td>\
                    </tr>\
                    <tr>\
                        <td>敷金</td>\
                        <td><#shikikin></td>\
                        <td>円</td>\
                    </tr>\
                    <tr>\
                        <td>礼金</td>\
                        <td><#reikin></td>\
                        <td>円</td>\
                    </tr>\
                    <tr>\
                        <td>間取り</td>\
                        <td><#madori></td>\
                    </tr>\
                </table>\
            </div>';

    // 物件情報を置換
    innerHTML = innerHTML.replace('<#tatemono_name>', escapeText(bukkenInfo.tatemono_name));
    innerHTML = innerHTML.replace('<#chikunensu>', bukkenInfo.chikunensu);
    innerHTML = innerHTML.replace('<#chinryo>', bukkenInfo.chinryo);
    innerHTML = innerHTML.replace('<#shikikin>', bukkenInfo.shikikin);
    innerHTML = innerHTML.replace('<#reikin>', bukkenInfo.reikin);
    innerHTML = innerHTML.replace('<#madori>', bukkenInfo.madori);

    element.innerHTML = innerHTML;
    return element;
}

/**
 * 特殊な意味を持つ文字をエスケープする
 */
function escapeText(text) {
    return text.replace(/[&'`"<>]/g, function(match) {
        return {
            '&': '&amp;',
            "'": '&#x27;',
            '`': '&#x60;',
            '"': '&quot;',
            '<': '&lt;',
            '>': '&gt;',
        }[match]
    });
}

/**
 * HTML要素を、指定したidを持つ要素内に挿入
 */
function insertHTMLElement(id, element) {
    var target = document.getElementById(id);
    target.innerHTML = '';
    target.appendChild(element);
}
