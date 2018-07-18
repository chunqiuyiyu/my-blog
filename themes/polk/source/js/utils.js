window.onload = function() {
    function clearSearch ($resultContent) {
        // clear search result
        var btnClose = document.querySelector("#local-search-close");
        btnClose.onclick = function() {
            inputArea.value = '';
            $resultContent.innerHTML = '';
            inputArea.placeholder = '搜索';
        };
    }

    var searchFunc = function(path, search_id, content_id) {
        // 0x00. environment initialization
        'use strict';
        var BTN = "<div id='local-search-close'>清空搜索</div>";
        var $input = document.getElementById(search_id);
        var $resultContent = document.getElementById(content_id);
        $resultContent.innerHTML = BTN + "<ul></ul>";
        clearSearch($resultContent);

        var xhr = new XMLHttpRequest();
        xhr.open("GET", path, true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // resume input
                $input.disabled = false;
                $input.placeholder = '输入关键词以搜索';
                $input.focus();

                var xml = xhr.responseXML;
                var root = xml.documentElement;
                var list = root.getElementsByTagName("entry");
                var datas = [];
                for (var i = list.length - 1; i >= 0; i--) {
                    var item = list[i];
                    datas.push({
                        title: item.getElementsByTagName("title")[0].innerHTML,
                        content: item.getElementsByTagName("content")[0].innerHTML,
                        url: item.getElementsByTagName("url")[0].innerHTML
                    });
                }
                $input.addEventListener('input', function() {
                    // 0x03. parse query to keywords list
                    var str = '<ul class=\"search-result-list\">';
                    var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
                    $resultContent.innerHTML = "";
                    if (this.value.trim().length <= 0) {
                        return;
                    }

                    // 0x04. perform local searching
                    datas.forEach(function(data) {
                        var isMatch = true;
                        var content_index = [];
                        if (!data.title || data.title.trim() === '') {
                            data.title = "Untitled";
                        }
                        var orig_data_title = data.title.trim();
                        var data_title = orig_data_title.toLowerCase();
                        var orig_data_content = data.content.trim().replace(/<[^>]+>/g, "");
                        var data_content = orig_data_content.toLowerCase();
                        var data_url = data.url;
                        var index_title = -1;
                        var index_content = -1;
                        var first_occur = -1;
                        // only match artiles with not empty contents
                        if (data_content !== '') {
                            keywords.forEach(function(keyword, i) {
                                index_title = data_title.indexOf(keyword);
                                index_content = data_content.indexOf(keyword);

                                if (index_title < 0 && index_content < 0) {
                                    isMatch = false;
                                } else {
                                    if (index_content < 0) {
                                        index_content = 0;
                                    }
                                    if (i == 0) {
                                        first_occur = index_content;
                                    }
                                    // content_index.push({index_content:index_content, keyword_len:keyword_len});
                                }
                            });
                        } else {
                            isMatch = false;
                        }
                        // 0x05. show search results
                        if (isMatch) {
                            str += "<li><a href='" + data_url + "' class='search-result-title'>" + orig_data_title + "</a>";
                            var content = orig_data_content;
                            if (first_occur >= 0) {
                                // cut out 100 characters
                                var start = first_occur - 10;
                                var end = first_occur + 30;

                                if (start < 0) {
                                    start = 0;
                                }

                                if (start == 0) {
                                    end = 40;
                                }

                                if (end > content.length) {
                                    end = content.length;
                                }

                                // console.log(content)
                                var match_content = content.substr(start, 100);

                                // highlight all keywords
                                keywords.forEach(function(keyword) {
                                    var regS = new RegExp(keyword, "gi");
                                    match_content = match_content.replace(regS, "<em class=\"search-keyword\">" + keyword + "</em>");
                                });

                                str += "<p class=\"search-result\">" + match_content + "...</p>"
                            }
                            str += "</li>";
                        }
                    });
                    str += "</ul>";
                    if (str.indexOf('<li>') === -1) {
                        $resultContent.innerHTML = BTN + "<ul><span class='local-search-empty'>没有找到内容，请尝试更换检索词<span></ul>";
                    } else {
                        $resultContent.innerHTML = BTN + str;
                    }
                    clearSearch($resultContent);
                });
            }
        };
    }

    var inputArea = document.querySelector("#local-search-input");
    if (inputArea) {
        inputArea.onclick = function() {
            // disable input
            inputArea.disabled = true;
            inputArea.style.backgroundColor = 'white';
            inputArea.placeholder = '首次搜索，需载入索引文件，请稍候';

            getSearchFile();
            this.onclick = null
        }
        inputArea.onkeydown = function() { if (event.keyCode == 13) return false }
    }


    var getSearchFile = function() {
        var path = "/search.xml";
        searchFunc(path, 'local-search-input', 'local-search-result');
    }

    // Load comment
    if (!document.getElementById('hashoverScript') && document.getElementsByClassName('load')[0]) {
        var script = document.createElement('script');
        script.id = 'hashoverScript';
        script.src = '//www.chunqiuyiyu.com/hashover/comments.php';
        script.asyc = true;

        var parent = document.getElementsByClassName('page')[0] ||
            document.getElementsByClassName('post')[0] || document.body;
        parent.appendChild(script);
    }

    document.getElementsByClassName('load')[0] && document.getElementsByClassName('load')[0].addEventListener('click', function() {
        if (HashOver && !document.getElementById('hashover')) var hashover = new HashOver();
    });

    // Go top
    document.getElementsByClassName('top')[0] && document.getElementsByClassName('top')[0].addEventListener('click', function() {
        var d = document,
            dd = document.documentElement,
            db = document.body,
            top = dd.scrollTop || db.scrollTop,
            step = Math.floor(top / 10);

        (function() {
            top -= step;
            if (top > -step) {
                dd.scrollTop == 0 ? db.scrollTop = top : dd.scrollTop = top;
                setTimeout(arguments.callee, 10);
            }
        })();
    });
}
