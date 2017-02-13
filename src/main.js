/**
 * Created by Liyang on 2016/12/6.
 */
$(function () {
    var searchValue=[], searchType = 'str', result = {
        s: '',
        sf: '',
        e: '',
        ef: '',
        si: false,
        ei: false,
        tl: false,
        bw: false,
        allMist:false,
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
    //获取所有tr内的值
    var arr = new Array()//获得表格下输入框的值，存入数组
    var arrSel = new Array()//获得表格下滑动框的值，存入数组
    var newArr = new Array()//将滑动框的值以4为单位等分
    var decloc = new Array()//将输入框的值以4为单位等分
    var newDeclec = new Array()//将以上两个数组合并
    var content = {}//传给服务器端的数据格式
    var pushData = []//传给服务器


    $('.submit').on('click', function () {
        // $('#dynamicTable tbody tr td').find('.searchvalue').each(function(index,domEle){
        //     arr.push($(domEle).val())
        // })
        // $('#dynamicTable tbody tr td').find('.myslider').each(function (index,dome) {
        //     arrSel.push(result[$(dome).attr('data-type')])
        // })
        // for(var i=0;i<arr.length;i+=4){
        //     decloc.push(arr.slice(i,i+4))
        // }
        // for(var i=0;i<arrSel.length;i+=4){
        //     newArr.push(arrSel.slice(i,i+4))
        // }
        // $.each(decloc,function(index,value){
        //     value.concat(newArr[index])
        //     newDeclec.push(value.concat(newArr[index]))
        // })
        // $.each(newDeclec,function(i){
        //     content = {
        //         s:newDeclec[i][0],
        //         e:newDeclec[i][1],
        //         sf:newDeclec[i][2],
        //         ef:newDeclec[i][3],
        //         si: newDeclec[i][4],
        //         ei: newDeclec[i][5],
        //         bw: newDeclec[i][6],
        //         tl: newDeclec[i][7],
        //
        //     }
        //     pushData.push(content)
        // })
        // $.each(pushData,function (index, value) {
        //     isRight = value.tl
        //     sValue=value.s
        //     eValue= value.e
        //
        // })
        var url, $navbar, $pageText,type;
        $navbar = $('.right .header').find('.nav-tabs');
        $pageText = $('#pageText');
        type = $('.myslider').last().attr('data-type')
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
    //添加多重查找条件
    $('.addMore').on('click',function () {
        //$('.myrows').children().clone(true).insertAfter('div.myrows')
        $('#itemContainer').first().clone(true).prependTo("ul#itemContainer")
        console.log($('#itemContainer').children().clone(true))
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
    function searchFail(buffer,data,start,searchType) {
        if(result.tl||result.allMist){
            ignore(buffer, data, start, searchType)
            console.log('忽略错误')
        }else {
            var $head, $sign, $navbar;
            $navbar = $('.result header').find('.nav-tabs');
            $navbar.toggleClass('str', (searchType === 'str'));
            searchSuccess(buffer, '', '');
            $head = $(document.body).find('.searchHead');
            $sign = $head.find('span');
            $head.removeClass('s_success').addClass('s_error').html('查找失败');
            $sign.removeClass('glyphicon-ok-sign').addClass('glyphicon glyphicon-remove-sign');
            $sign.prependTo($head);
        }
    }
//忽略错误返回效果
    function ignore(buffer, result, start, searchType) {
        var $head, text, $result, $searchText, $searchIndex, $content, $navbar;
        localStorage.setItem('searchText', buffer);
        text = $('#tpl').html();
        $content = $('#result');
        $navbar = $('.right .header').find('.nav-tabs');
        $navbar.toggleClass('str', (searchType === 'str'));
        $content.html('');
        $content.append($(text));
        $head = $(document.body).find('.searchHead');
        $head.html('查找成功(忽略错误)');
        $result = $(document.body).find('.searchresult');
        $searchText = $(document.body).find('.searchText');
        $searchIndex = $(document.body).find('.startIndex');
        $result.html(result);
        $searchText.html(buffer);
        $searchIndex.html(start);
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
// 查询数据
    function searchData(searchValue, searchMethod, searchType) {
        var searchObj = {
            data: {
                buffer: searchValue ? searchValue : ''
            },
            defLoc: searchMethod
        };
        //console.log(JSON.stringify(searchObj))
        return $.ajax({
            url: 'http://10.37.5.252:29900/iLoc',
            method: 'POST',
            data: JSON.stringify(searchObj)
        }).then(function (data) {
            if (data.succeed) {
                searchSuccess(data.buffer, data.result, data.start, searchType);
            } else {
                searchFail(data.buffer,data.result,data.start, searchType);
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
//对查找条件进行操作
    var show_count = 20;   //要显示的条数
    var count = 1;    //递增的开始值，这里是你的ID
    $("#btn_addtr").click(function () {

        var length = $("#dynamicTable tbody tr").length;
        //console.log(length);
        if (length < show_count)    //点击时候，如果当前的数字小于递增结束的条件
        {
            $("#tab11 tbody tr").clone(true).appendTo("#dynamicTable tbody");   //在表格后面添加一行
            // $('span.numList').first().clone().removeClass('active').appendTo('.itemNum li')
            $('.numList').append('<li><span>1</span></li>').removeClass('active')
            changeIndex();//更新行号
        }
    });
    //拖拽排序
    // $("ul.itemNum:first").dragsort();
    $(".itemNum").dragsort({
        dragSelector: "li",
        dragBetween: true,
        // placeHolderTemplate: "<li class='placeHolder'><span></span></li>",
        dragEnd: pullLoc
    });
    function pullLoc() {
        $('#dynamicTable tbody tr').hide(300)
        $('#dynamicTable tbody tr').eq(numIndex-1).show(300)
    }
    //点击跳转到选择页
    $('.itemNum').on('click','li',function () {
        //console.log($(this).text())
         numIndex = $(this).text()
        //console.log(numIndex)
        // console.log($(this).attr('active'))
        if($(this).attr('active') == undefined){
            $(this).parent().children().removeClass('active')
            $(this).addClass('active')
        }
        $('#dynamicTable tbody tr').hide(300)
        $('#dynamicTable tbody tr').eq(numIndex-1).show(300)

    })
    //更新行号
    function changeIndex() {
        var inputLen = $('#dynamicTable tbody tr').length
        $('.itemNum li span').last().text(inputLen)
    }
//删除行号
    function deteleIndex() {
        $('.itemNum li span').last().remove()
    }
 //删除当前行
    $('table tr td:last-child').on('click','input',function () {
        var length = $("#dynamicTable tbody tr").length;
        if (length <= 1) {
            alert("至少保留一行");
        } else {
            $(this).parent().parent().remove();//移除当前行
            $('#dynamicTable tbody tr:first-child').show()
            deteleIndex()
        }
    })

    // $('#testBtn').on('click',function () {
    //     $('#dynamicTable tbody tr td').find('.searchvalue').each(function(index,domEle){
    //                 arr.push($(domEle).val())
    //     })
    //     console.log("340行"+arr)
    //     $('#dynamicTable tbody tr td').find('.myslider').each(function (index,dome) {
    //         if($.inArray(result[$(dome).attr('data-type')],arrSel)==-1){
    //             arrSel.push(result[$(dome).attr('data-type')])
    //         }
    //     })
    //     console.log("344行"+arrSel)
    //     for(var i=0;i<arr.length;i+=4){
    //         decloc.push(arr.slice(i,i+4))
    //     }
    //     console.log("350行"+decloc)
    //     for(var i=0;i<arrSel.length;i+=4){
    //         newArr.push(arrSel.slice(i,i+4))
    //     }
    //     console.log("352行"+newArr)
    //     //console.log(newArr)
    //     $.each(decloc,function(index,value){
    //         value.concat(newArr[index])
    //         newDeclec.push(value.concat(newArr[index]))
    //         //console.log(value.concat(newArr[index]))
    //     })
    //     //console.log(newDeclec)
    //     $.each(newDeclec,function(i){
    //         content = {
    //             s:newDeclec[i][0],
    //             e:newDeclec[i][1],
    //             sf:newDeclec[i][2],
    //             ef:newDeclec[i][3],
    //             si: newDeclec[i][4],
    //             ei: newDeclec[i][5],
    //             bw: newDeclec[i][6],
    //             tl: newDeclec[i][7],
    //
    //         }
    //         pushData.push(content)
    //     })
    //     console.log("374行"+pushData)
    //
    // })

});


