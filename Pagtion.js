/*
js 分页组件，暂时只支持一个页面一个分页
如果有一个页面有多个分页部分，另请高明...
*/
(function (win) {
    win.pagtion = {
        //分页配置参数
        configData: {
            totalRow: 0,
            pageSize: 10,
            currentPage: 1,
            btnNumber: 4,
            urlPageParameter: "page",
            firstPage: {
                text: "首页",
                disabledClass: "disabled",
                isShowAlway: true
            },
            prevPage: {
                text: "«",
                disabledClass: "disabled",
                isShowAlway: true
            },
            nextPage: {
                text: "»",
                disabledClass: "disabled",
                isShowAlway: true
            },
            lastPage: {
                text: "末页",
                disabledClass: "disabled",
                isShowAlway: true
            },
            morePage: {
                text: "...",
                disabledClass: "disabled",
                isShowAlway: false
            },
            goPage: {
                type: 1,
                text: "go",
                className: "goPage"
            },
            pagtionType: 2,
            className: "",
            activeBtnClass: "active",
            element: "",
            type: "GET",
            data: undefined,
            ajaxUrl: "", //http://dsds.com/getdata?page=$page$&.....
            ajaxStar: function (config) {

            },
            ajaxSuccess: function (data, config) {

            }
        },
        //从url获得当前页码
        GetCurrentPageForUrl: function () {
            var p = 1;
            var hashurl = window.location.hash;
            if (!hashurl || hashurl == "") {
                return p;
            }
            hashurl = hashurl.replace("#", "");
            var parameters = hashurl.split('&');
            var pageParameter = this.configData.urlPageParameter + "=1";
            for (var i = 0; i < parameters.length; i++) {
                var pararr = parameters[i].split('=');
                if (pararr.length == 2 && pararr[0] == this.configData.urlPageParameter) {
                    p = parseInt(pararr[1]);
                    if (isNaN(p))
                        p = 1;
                    break;
                }
            }
            return p;
        },
        //获得分页URL模板
        GetPageUrlTmp: function () {
            var hashUrl = window.location.hash;
            var url = "";
            if (!hashUrl || hashUrl == "") {
                url = window.location.href + "#" + this.configData.urlPageParameter + "=$page$";
            } else {
                var regx = new RegExp(this.configData.urlPageParameter + "=\\d+");
                if (regx.test(window.location.href)) {
                    var url = window.location.href.replace(regx, this.configData.urlPageParameter + "=$page$")
                } else {
                    url = window.location.href + "&" + this.configData.urlPageParameter + "=$page$";
                }
            }
            return url;
        },
        //开始分页
        SetPage: function (currentPage, data) {
            if (data) {
                this.configData.data = data;
            }
            this.configData.currentPage = currentPage;
            this.GetAjaxData();
        },
        //发起ajax请求
        GetAjaxData: function () {
            var url = this.configData.ajaxUrl.replace(/\$page\$/, this.configData.currentPage);
            var context = this;
            context.configData.ajaxStar(context.configData);
            $.ajax({
                type: context.configData.type,
                url: url,
                dataType: "json",
                cache: false,
                data: context.configData.data,
                success: function (data) {
                    context.configData.totalRow = data.totalRow;
                    context.CreatePageHtml();
                    context.configData.ajaxSuccess(data, context.configData);
                }
            });
        },
        //创建分页html
        CreatePageHtml: function () {
            //计算总页数
            if (this.configData.totalRow % this.configData.pageSize == 0) {
                this.configData.toalPage = this.configData.totalRow / this.configData.pageSize;
            } else {
                this.configData.toalPage = parseInt(this.configData.totalRow / this.configData.pageSize + 1);
            }
            //如果当前页大于总页数，当前页等于总页数
            if (this.configData.currentPage > this.configData.toalPage)
                this.configData.currentPage == this.configData.toalPage;
            var pageHtml = '';
            if (this.configData.toalPage < 2) {
                //小于两页不显示分页
                $(this.configData.element).html("");
                return;
            } else {
                pageHtml = '<ul class="' + this.configData.className + '">';
            }
            var url = this.GetPageUrlTmp();
            //判断"第一页"按钮和"上一页"按钮的显示情况
            if (this.configData.pagtionType == 1) {
                if (this.configData.currentPage == 1) {
                    //判断是否显示"第一页"按钮
                    if (this.configData.firstPage && this.configData.firstPage.isShowAlway) {
                        pageHtml += '<li class=' + this.configData.firstPage.disabledClass + '><a href="javascript:void(0)" >' + this.configData.firstPage.text + '</a></li>';
                    }
                    //判断是否显示"上一页"按钮
                    if (this.configData.prevPage && this.configData.prevPage.isShowAlway) {
                        pageHtml += '<li class=' + this.configData.prevPage.disabledClass + '><a href="javascript:void(0)" >' + this.configData.prevPage.text + '</a></li>';
                    }
                } else {
                    if (this.configData.firstPage) {
                        pageHtml += '<li><a href="' + url.replace(/\$page\$/, 1) + '" >' + this.configData.firstPage.text + '</a></li>';
                    }
                    //判断是否显示"上一页"按钮
                    if (this.configData.prevPage) {
                        pageHtml += '<li><a href="' + url.replace(/\$page\$/, (parseInt(this.configData.currentPage) - 1)) + '" >' + this.configData.prevPage.text + '</a></li>';
                    }
                }
            }
            //计算显示分页按钮的开始按钮索引和结束索引
            var pageBtnEndIndex = 0;
            if (this.configData.currentPage % this.configData.btnNumber == 0) {
                pageBtnEndIndex = this.configData.currentPage;
            } else {
                pageBtnEndIndex = (parseInt(this.configData.currentPage / this.configData.btnNumber) + 1) * this.configData.btnNumber;
            }
            var pageBtnStartIndex = pageBtnEndIndex - this.configData.btnNumber + 1;
            //如果最大页码大于总页数，那么最大页码=总页数
            if (pageBtnEndIndex > this.configData.toalPage) {
                pageBtnEndIndex = this.configData.toalPage;
            }
            if (this.configData.pagtionType == 2 && pageBtnStartIndex > this.configData.btnNumber) {
                pageHtml += '<li><a href="' + url.replace(/\$page\$/, 1) + '" data-index="1">1</a></li>';
                pageHtml += '<li><a href="' + url.replace(/\$page\$/, (parseInt(pageBtnStartIndex) - 1)) + '" >' + this.configData.morePage.text + '</a></li>';
            }
            //循环拼接索引按钮
            for (var i = pageBtnStartIndex; i <= pageBtnEndIndex; i++) {
                if (i == this.configData.currentPage) {
                    pageHtml += '<li class="' + this.configData.activeBtnClass + '"><a href="javascript:void(0)"  >' + i + '</a></li>';
                } else {
                    pageHtml += '<li><a href="' + url.replace(/\$page\$/, i) + '" >' + i + '</a></li>';
                }

            };
            //判断是否显示进入更多页的按钮
            if (this.configData.morePage) {
                if (this.configData.toalPage > pageBtnEndIndex) {
                    pageHtml += '<li><a href="' + url.replace(/\$page\$/, (parseInt(pageBtnEndIndex) + 1)) + '" >' + this.configData.morePage.text + '</a></li>';
                }
            }
            if (this.configData.pagtionType == 2 && pageBtnEndIndex < this.configData.toalPage) {
                pageHtml += '<li><a href="' + url.replace(/\$page\$/, this.configData.toalPage) + '" >' + this.configData.toalPage + '</a></li>';
            }
            if (this.configData.pagtionType == 1) {
                //判断是否显示"下一页"按钮和"末页"按钮
                if (this.configData.currentPage == this.configData.toalPage) {
                    //判断是否显示下一页按钮
                    if (this.configData.nextPage && this.configData.nextPage.isShowAlway) {
                        pageHtml += '<li class=' + this.configData.nextPage.disabledClass + '><a href="javascript:void(0)" >' + this.configData.nextPage.text + '</a></li>';
                    }
                    if (this.configData.lastPage && this.configData.lastPage.isShowAlway) {
                        pageHtml += '<li class=' + this.configData.lastPage.disabledClass + '><a href="javascript:void(0)" >' + this.configData.lastPage.text + '</a></li>';
                    }
                } else {
                    if (this.configData.nextPage) {
                        pageHtml += '<li><a href="' + url.replace(/\$page\$/, (parseInt(this.configData.currentPage) + 1)) + '" >' + this.configData.nextPage.text + '</a></li>';
                    }
                    if (this.configData.lastPage) {
                        pageHtml += '<li><a href="' + url.replace(/\$page\$/, this.configData.toalPage) + '" >' + this.configData.lastPage.text + '</a></li>';
                    }
                }
            }
            //跳转按钮
            if (this.configData.goPage) {
                if (this.configData.goPage.type == 1) {
                    pageHtml += '<li class="' + this.configData.goPage.className + '">';
                    pageHtml += '<input type="text" value="" /><button class="goto_btn">' + this.configData.goPage.text + '</button>';
                    pageHtml += "</li>";
                }
                if (this.configData.goPage.type == 2) {
                    //暂不支持
                }
            }
            pageHtml += '</ul>';
            var ul = $(pageHtml);
            $(ul).find("button").click(function () {
                var currpage = parseInt($(this).prev().val());
                if (isNaN(currpage)) {
                    alert("请输入正确的页码");
                    return;
                }
                if (currpage <= 0) {
                    currpage = 1;
                }
                if (currpage > pagtion.configData.toalPage) {
                    currpage = pagtion.configData.toalPage
                }
                window.location = pagtion.GetPageUrlTmp().replace(/\$page\$/, currpage)
            });
            $(ul).find("input[type='text']").keypress(function (e) {
                if (e && e.keyCode == 13) {
                    var currpage = parseInt($(this).val());
                    if (isNaN(currpage)) {
                        alert("请输入正确的页码");
                        return;
                    }
                    if (currpage <= 0) {
                        currpage = 1;
                    }
                    if (currpage > pagtion.configData.toalPage) {
                        currpage = pagtion.configData.toalPage
                    }
                    pagtion.SetPage(currpage);
                }
            });
            $(this.configData.element).html(ul);
        },
        //分页配置
        Config: function (option) {
            this.configData = $.extend(this.configData, option);
            this.configData.currentPage = this.GetCurrentPageForUrl();
            this.GetAjaxData();
        },
        //外部调用重新分页
        StartPage: function (url, currentPage, data) {
            var cupage = 1;
            if (currentPage) {
                if (currentPage > 0) {
                    cupage = parseInt(currentPage);
                }
            }
            if (url) {
                this.configData.ajaxUrl = url;
            }
            if (data) {
                this.configData.data = data;
            }
            var currUrl= this.GetPageUrlTmp().replace(/\$page\$/, cupage);
            if (currUrl == window.location.href)
            {
                this.SetPage(cupage);
            }
            window.location.href = currUrl;
        }
    };
    window.onhashchange = function () {
        window.pagtion.SetPage(window.pagtion.GetCurrentPageForUrl());
    }
})(window);