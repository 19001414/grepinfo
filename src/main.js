/**
 * Created by Liyang on 2016/12/6.
 */
$(function () {
    var searchValue, searchType = 'str',torf=false, result = {
        s: '',
        sf: '',
        e: '',
        ef: '',
        si: false,
        ei: false,
        tl: false,
        bw: false,
    };
    searchValue = localStorage.getItem('searchText');
    if (searchValue) {
        $('.searchvalue[data-type="buffer"]').val(searchValue);
    }

    $('.myslider').on('transitionend', function (evt) {
        var originEvt, type;
        originEvt = evt.originalEvent;
        type = $(this).data('type');
        //result[type] = true
        if (originEvt.propertyName === 'background-color') {
            result[type] = $(this).css('background-color') === 'rgb(33, 150, 243)';
        }
    });

    $('.searchvalue').on('input', function () {
        var $input, type, value;
        $input = $(this);
        type = $input.data('type');
        value = $input.val();
        if (type !== 'buffer') {
            result[type] = value;
        }else{
            searchValue = value;
        }
    });

    $('.submit').on('click', function () {
        var url, $navbar, $pageText,type;
        $navbar = $('.right .header').find('.nav-tabs');
        $pageText = $('#pageText');
        type = $('.myslider').last().attr('data-type')
        console.log(result[type])
        console.log(torf)
        if(result[type] && torf===false){
            console.log('忽略错误')
        }else {
            // 处理str
            if (searchType === 'str') {
                searchData(searchValue, result, searchType);
            } else {
                url = searchValue.indexOf('http') > -1 ? searchValue : 'http://' + searchValue;
                $navbar.toggleClass('str', (searchType === 'str'));
                urlSearch(url).then(function (html) {
                    $pageText.html('');
                    $pageText.text(html);
                    searchData(window.encodeURI(html), result, searchType);
                });
            }
        }
    });

    $('.searchtype').on('click', function () {
        var type, $urlconfig;
        $urlconfig = $('.urlconfig');
        type = $(this).data('type');
        $urlconfig.toggleClass('myshow', type === 'url');
        searchType = type;
    });

    $('.urlconfig').on('click', '.myadd', function () {
        var $parent;
        $parent = $('.urlconfig');
        addnewheader($parent);
    }).on('click', '.myclose', function () {
        var $parent, last;
        $parent = $('.urlconfig');
        last = checkOnlyHeader($parent);
        !last && $(this).parent().remove();
        $parent.toggleClass('one', checkOnlyHeader($parent));
    });

    //  查询结果

    // tabs
    $('.right .header').on('click', 'li', function () {
        var page = $(this).data('page');
        $('#' + page).tab('show');
    })

    // 处理成功
    function searchSuccess(buffer, result, start, searchType) {
        var text, $result, $searchText, $searchIndex, $content, $navbar;
        localStorage.setItem('searchText', buffer);
        text = $('#tpl').html();
        $content = $('#result');
        $navbar = $('.right .header').find('.nav-tabs');
        $navbar.toggleClass('str', (searchType === 'str'));
        $content.html('');
        $content.append($(text));
        $result = $(document.body).find('.searchresult');
        $searchText = $(document.body).find('.searchText');
        $searchIndex = $(document.body).find('.startIndex');
        $result.html(result);
        $searchText.html(buffer);
        $searchIndex.html(start);
    }

// 处理失败
    function searchFail(buffer, searchType) {
        if((torf===false)){
            var $head, $sign, $navbar;
            $navbar = $('.result header').find('.nav-tabs');
            $navbar.toggleClass('str', (searchType === 'str'));
            searchSuccess(buffer, '', '');
            $head = $(document.body).find('.searchHead');
            $sign = $head.find('span');
            $head.removeClass('s_success').addClass('s_error').html('查询失败');
            $sign.removeClass('glyphicon-ok-sign').addClass('glyphicon glyphicon-remove-sign');
            $sign.prependTo($head);
        }
    }

// 校验函数
    function checkForm($inputs) {
        $inputs.each(function (index, input) {
            if (!checkNotNull($(input))) $(input).toggleClass()
        })
    }
// 检查非空
    function checkNotNull($input) {
        return $input.val() !== '';
    }

// 添加新的头部信息
    function addnewheader($parent) {
        var $span;
        $span = $('<span class="configinput">' +
            '<input type="text" placeholder="key"/><input type="text" placeholder="value" />' +
            '<span class="myadd" title="添加">+</span>' +
            '<span class="myclose" title="删除">&times;</span>' +
            '</span>');
        $parent.append($span);
        $parent.removeClass('one');
    }

// 检查是否只剩一个可添加的头部
    function checkOnlyHeader($parent) {
        return $parent.find('.configinput').length === 1;
    }
//判断是否忽略错误
    function ignoreMist() {

    }
// 查询数据
    function searchData(searchValue, searchMethod, searchType) {
        var searchObj = {
            data: {
                buffer: searchValue ? searchValue : ''
            },
            defLoc: searchMethod
        };
        return $.ajax({
            url: 'http://127.0.0.1:29900/iLoc',
            method: 'POST',
            data: JSON.stringify(searchObj)
        }).then(function (data) {
            //console.log(data)
            torf = data.succeed
            console.log(torf)
            if (data.succeed) {
                searchSuccess(data.buffer, data.result, data.start, searchType);
            } else {
                searchFail(data.buffer, searchType);
            }
        });
    }

// 处理url
    function urlSearch(data) {
        var iframe, $originpage, _getHtml;
        $originpage = $('#originpage');
        // _getHtml = function (def) {
        //     iframe = $(`<iframe frameborder="0" scrolling="yes" src="${data}">`);
        //     iframe[0].onload = function (data) {
        //         def.resolve(iframe[0].contentWindow.document.body.innerHTML);
        //     };
        //     $originpage.html('');
        //     $originpage.append(iframe);
        // };
        iframe = $(`<iframe frameborder="0" scrolling="yes" src="${data}">`);
        $originpage.html('');
        $originpage.append(iframe);
        return $.ajax({
            method: 'GET',
            url: data,
            crossDomain: true,
            headers: {
                cookie: 'abcd'
            }
        }).then(function (html) {
            return html;
        });
        // $.get(data).then(function (data) {
        //     console.log(data);
        // })
    }

});


