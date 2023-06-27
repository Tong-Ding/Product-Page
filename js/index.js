//作用：需要将所有的DOM元素对象以及相关的资源全部都加载完毕之后，再来实现的事件函数
window.onload = function () {

    //声明一个记录点击的缩略图下标
    let bigimgIndex = 0

    //路径导航的数据渲染
    navPathDataBind()
    function navPathDataBind () {
        /**
     * 思路：
     * 1、先获取路径导航的页面元素（navPath）
     * 2、再来获取所需要的数据（data.js->goodData.path）
     * 3、由于数据是需要动态产生的，那么相应的DOM元素也应该是动态产生的，含义需要根据数据的数量来进行创建DOM元素
     * 4、在遍历数据创建DOM元素的最后一条，只创建a标签，而不创建i标签
     */

        //1.获取页面导航的元素对象
        let navPath = document.querySelector('#wrapper #content .contentMain #navPath')        //选择器

        //2.获取数据
        let path = goodData.path

        //3.遍历数据
        for (let i = 0; i < path.length; i++) {
            if (i == path.length - 1) {
                //只需要创建a且没有href属性
                let aNode = document.createElement("a")
                aNode.innerText = path[i].title
                navPath.appendChild(aNode)
            } else {
                //4.创建a标签
                let aNode = document.createElement("a")        //创建标签
                aNode.href = path[i].url
                aNode.innerText = path[i].title

                //5.创建i标签
                let iNode = document.createElement('i')
                iNode.innerText = '/'

                //6.让navPath元素来追加a和i
                navPath.appendChild(aNode)         //添加元素
                navPath.appendChild(iNode)
            }


        }
    }

    //放大镜的移入、移出效果
    bigClassBind()
    function bigClassBind () {
        /**
         * 思路：
         * 1、获取小图框元素对象，并且设置移入事件(onmouseenter)
         * 2、动态的创建蒙版元素以及大图框和大图片元素
         * 3、移出时(onmouseleave)需要移除蒙版元素和大图框
         */

        //1.获取小图框元素
        let smallPic = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic')
        //获取leftTop元素
        let leftTop = document.querySelector('#wrapper #content .contentMain #center #left #leftTop')

        //获取数据
        let imagessrc = goodData.imagessrc

        //2.设置移入事件
        smallPic.onmouseenter = function () {       //鼠标移入事件

            //3. 创建蒙版元素
            let maskDiv = document.createElement('div')
            maskDiv.className = "mask"

            //4.创建大图框元素
            let BigPic = document.createElement('div')
            BigPic.id = "bigPic"

            //5.创建大图片元素
            let BigImg = document.createElement('img')
            BigImg.src = imagessrc[bigimgIndex].b

            //6.大图框来追加大图片
            BigPic.appendChild(BigImg)

            //7.让小图框来追加蒙版元素
            smallPic.appendChild(maskDiv)

            //8.让leftTop元素追加大图框
            leftTop.appendChild(BigPic)


            //设置移动事件
            smallPic.onmousemove = function (event) {       //鼠标移动事件
                //event.clientX: 鼠标点距离浏览器左侧X轴的值
                //getBoundingClientRect().left:小图框元素距离浏览器左侧可视left值
                //offsetWidth:为元素的占位宽度
                //clientWidth = offsetWidth - border
                let left = event.clientX - smallPic.getBoundingClientRect().left - maskDiv.offsetWidth / 2
                let top = event.clientY - smallPic.getBoundingClientRect().top - maskDiv.offsetHeight / 2

                //判断
                if (left < 0) {
                    left = 0
                } else if (left > smallPic.clientWidth - maskDiv.offsetWidth) {
                    left = smallPic.clientWidth - maskDiv.offsetWidth
                }

                if (top < 0) {
                    top = 0
                } else if (top > smallPic.clientHeight - maskDiv.offsetHeight) {
                    top = smallPic.clientHeight - maskDiv.offsetHeight
                }

                //设置left和top属性
                maskDiv.style.left = left + "px"           //设置元素的属性
                maskDiv.style.top = top + "px"

                //大图发生移动
                //确定 bigImg 的left top
                //移动比 = 蒙版的位置/大图的位置 = (小图的宽度-蒙版的宽度)/(大图片的宽度-大图框的宽度);
                let scale = (smallPic.clientWidth - maskDiv.offsetWidth) / (BigImg.offsetWidth - BigPic.clientWidth)

                BigImg.style.left = -left / scale + 'px'
                BigImg.style.top = -top / scale + 'px'
            }


            //设置移出事件
            smallPic.onmouseleave = function () {         //鼠标移出事件

                //让小图框移除蒙版元素
                smallPic.removeChild(maskDiv)

                //让leftTop元素移除大图框
                leftTop.removeChild(BigPic)
            }
        }
    }

    //动态渲染放大镜缩略图的数据
    thumbnailData()
    function thumbnailData () {
        /**
         * 思路：
         * 1、先获取piclist元素下的ul
         * 2、在获取data.js文件下的goodData->imagessrc
         * 3、遍历数组，根据数组的长度来创建li元素
         * 4、让ul遍历追加li元素
         */

        //1.获取piclist下的ul
        let ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul')

        //2.获取imagessrc数据
        let imagessrc = goodData.imagessrc

        //3.遍历数组
        for (let i = 0; i < imagessrc.length; i++) {
            //4.创建li元素
            let newLi = document.createElement('li')

            //5.创建img元素
            let newImg = document.createElement('img')
            newImg.src = imagessrc[i].s

            //6.让li追加img元素
            newLi.appendChild(newImg)

            //7.让ul追加li元素
            ul.appendChild(newLi)
        }
    }

    //点击缩略图的效果
    thumbnailClick()
    function thumbnailClick () {
        /**
         * 思路：
         * 1、获取所有的li元素，并且循环发生点击事件
         * 2、点击缩略图需要确定其下标位置来找到对应小图路径和大图路径替换现有src的值
         */

        //1.获取所有的li元素
        let liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li')         //获取所有的元素

        let smallPic_img = document.querySelector('#wrapper #content .contentMain #center #left #leftTop #smallPic img')

        let imagessrc = goodData.imagessrc

        //小图路径需要默认和imagessrc的第一个元素小图的路径是一致的
        smallPic_img.src = imagessrc[0].s

        //2.循环点击这些li元素
        for (let i = 0; i < liNodes.length; i++) {
            //在点击事件之前，给每一个元素都添加上自定义的下标
            liNodes[i].index = i           //添加index属性
            liNodes[i].onclick = function () {      //鼠标点击事件
                let idx = this.index                   //事件函数中的this永远指向的是实际发生事件的目标源对象
                bigimgIndex = idx
                //变换小图路径
                smallPic_img.src = imagessrc[idx].s
            }
        }
    }

    //点击缩略图左右箭头的效果
    thumbnailLeftRightClick()
    function thumbnailLeftRightClick () {
        /**
         * 思路：
         * 1、先获取左右两端的箭头按钮
         * 2、在获取可视的div以及ul元素和所有的li元素
         * 3、计算（发生起点、步长、总体运动的距离值）
         * 4、然后再发生点击事件
         */

        //1、获取箭头元素
        let prev = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.prev')
        let next = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom a.next')

        //2、获取可视的div以及ul元素和所有的li元素
        let ul = document.querySelector('#wrapper #content .contentMain #center #left #leftBottom #piclist ul')

        let liNodes = document.querySelectorAll('#wrapper #content .contentMain #center #left #leftBottom #piclist ul li')

        //3、计算

        //发生起点
        let start = 0

        //步长
        let step = (liNodes[0].offsetWidth + 20) * 2

        //总体运动的距离值 = ul的宽度 - div框的宽度 = (图片的总数 - div中显示的数量) * （li的宽度 + 20）
        let endPostion = (liNodes.length - 5) * (liNodes[0].offsetWidth + 20)

        //4、发生事件
        prev.onclick = function () {
            start -= step
            if (start < 0) {
                start = 0
            }
            ul.style.left = -start + "px"
        }

        next.onclick = function () {
            start += step
            if (start > endPostion) {
                start = endPostion
            }
            ul.style.left = -start + "px"
        }

    }

    //商品详情数据的动态渲染
    rightTopData()
    function rightTopData () {
        /**
         * 思路：
         * 1、查找rightTop元素
         * 2、查找data.js->goodData->goodsDetail
         * 3、建立一个字符串变量，将原来的布局结构贴进来，将所对应的数据放在对应的位置上重新渲染rightTop元素
         */

        //1、查找元素
        let rightTop = document.querySelector('#wrapper #content .contentMain #center #right .rightTop')

        //2、查找数据
        let goodsDetail = goodData.goodsDetail

        //3、创建一个字符串(双引号、单引号、模板字符串)变量
        //模板字符串替换数据：${变量}
        //Non-Breaking Space &nbsp;表示空格
        let s = `<h3>${goodsDetail.title}</h3>      
                <p>${goodsDetail.recommend}</p>
                <div class="priceWrap">
                    <div class="priceTop">
                        <span>Price</span>
                        <div class="price">
                            <span>￥</span>
                            <p>${goodsDetail.price}</p>
                        </div>
                        <p>
                            <span>Reviews</span>
                            <span>${goodsDetail.evaluateNum}</span>
                        </p>
                    </div>
                    <div class="priceBottom">
                        <span>Promotion</span>
                        <p>
                            <span>${goodsDetail.promoteSales.type}</span>
                            <span>${goodsDetail.promoteSales.content}</span>
                        </p>
                    </div>
                </div>
                <div class="support">
                    <span>Support</span>
                    <p>${goodsDetail.support}</p>
                </div>
                <div class="address">
                    <span>Address</span>
                    <p>${goodsDetail.address}</p>
                </div>`

        //4、重新渲染rightTop元素
        rightTop.innerHTML = s
    }

    //商品参数数据的动态渲染
    rightBottomData()
    function rightBottomData () {
        /**
         * 思路：
         * 1、找rightBottom的元素对象
         * 2、查找data.js->goodData.goodsDetail.crumbData数据
         * 3、由于数据是一个数组，需要遍历，有一个元素则需要有一个动态的dl元素对象(dt、dd)
         */

        //1、查找元素对象
        let chooseWrap = document.querySelector('#wrapper #content .contentMain #center #right .rightBottom .chooseWrap')

        //2、查找数据
        let crumbData = goodData.goodsDetail.crumbData

        //3、循环数据
        for (let i = 0; i < crumbData.length; i++) {

            //4、创建dl元素对象
            let dlNode = document.createElement('dl')   //定义列表

            //5、创建dt元素对象
            let dtNode = document.createElement('dt')   //定义标题
            dtNode.innerText = crumbData[i].title

            //6、dl追加dt
            dlNode.appendChild(dtNode)

            //7、遍历crumbData->data元素
            for (let j = 0; j < crumbData[i].data.length; j++) {

                //创建dd元素
                let ddNode = document.createElement('dd')   //定义描述
                ddNode.innerText = crumbData[i].data[j].type
                ddNode.setAttribute('price', crumbData[i].data[j].changePrice)          //设置属性
                //让dl来追加dd
                dlNode.appendChild(ddNode)
            }

            //8、让chooseWrap追加dl
            chooseWrap.appendChild(dlNode)
        }
    }

    //点击商品参数之后的颜色排他效果
    clickddBind()
    function clickddBind () {
        /**
         * 每一行dd文字颜色排他
         * 思路：
         * 1、获取所有的dl元素，取其中第一个dl元素下的所有dd先做测试，
         *   测试完毕之后在对应dl第一行下标的前面在嵌套一个for循环，目的在变换下标
         * 2、循环所有的dd元素并且添加点击事件
         * 3、确定实际发生事件的目标源对象设置其文字颜色为红色，然后给其他所有的元素颜色都重置为基础颜色(#666)
         * ==========================================================================================
         * 
         * 
         * 点击dd之后产生的mark标记
         * 思路：
         * 1、首先先来创建一个可以容纳点击的dd元素值的容器（数组），确定数组的起始长度,在添加一些默认值
         * 2、然后再将点击的dd元素的值按照对应下标来写入到数组的元素身上
         */

        //1、找第一个dl下的所有的dd元素
        let dlNodes = document.querySelectorAll('#wrapper #content .contentMain #center #right .rightBottom .chooseWrap dl')

        let arr = new Array(dlNodes.length)        //记录列表产生的标记
        arr.fill(0)        //数组填充值   
        // console.log(arr); // [0, 0, 0, 0]

        let choose = document.querySelector('#wrapper #content .contentMain #center #right .rightBottom .choose')

        for (let i = 0; i < dlNodes.length; i++) {
            //自调用函数: 立即执行该函数，不必须使用变量接收。
            (function (i) {

                let ddNodes = dlNodes[i].querySelectorAll('dd')

                //2、遍历当前所有的dd元素
                for (let j = 0; j < ddNodes.length; j++) {

                    ddNodes[j].onclick = function () {
                        // console.log(i);
                        // console.log(ddNodes[i]); // undefined
                        // this：表示哪一个元素真实的发生了事件
                        // console.log(this);

                        for (let k = 0; k < ddNodes.length; k++) {
                            ddNodes[k].style.color = "#666"
                        }
                        this.style.color = "red"


                        //点击哪一个dd元素动态的产生一个新的mark标记元素
                        arr[i] = this

                        changePriceBind(arr) //实参

                        //清空choose元素
                        choose.innerHTML = ""
                        //遍历arr数组，将非0元素的值写入到mark标记
                        arr.forEach(function (value, index) {              //function参数有value, index
                            //只要是为真的条件，咱们就动态的来创建mark标签
                            if (value) {
                                //创建div元素
                                let markDiv = document.createElement('div')
                                //并且设置class属性
                                markDiv.className = 'mark'
                                //并且设置值
                                markDiv.innerText = value.innerText
                                //创建a元素
                                let aNode = document.createElement('a')
                                //并且设置值
                                aNode.innerText = 'X'
                                //并且设置下标
                                aNode.setAttribute('index', index)      //下面16行
                                //让div追加a 
                                markDiv.appendChild(aNode)

                                //让choose元素追加div，页面直接更新
                                choose.appendChild(markDiv)

                            }
                        })

                        //获取所有的a标签元素，并且循环发生点击事件
                        let aNodes = document.querySelectorAll('#wrapper #content .contentMain #center #right .rightBottom .choose .mark a')

                        for (let n = 0; n < aNodes.length; n++) {
                            aNodes[n].onclick = function () {
                                //获取点击的a标签身上的index属性值
                                let idx1 = this.getAttribute('index')      //上面16行

                                //恢复数组中对应下标元素的值
                                arr[idx1] = 0

                                //查找对应下标的那个dl行中的所有的dd元素
                                let ddlist = dlNodes[idx1].querySelectorAll('dd')

                                //遍历所有的dd元素
                                for (let m = 0; m < ddlist.length; m++) {
                                    //其余所有dd的文字颜色为灰色
                                    ddlist[m].style.color = "#666"
                                }

                                //默认的第一个dd文字颜色恢复成红色
                                ddlist[0].style.color = 'red'

                                //删除对应下标位置的mark标记，页面直接更新
                                choose.removeChild(this.parentNode)

                                //调用价格函数
                                changePriceBind(arr)
                            }
                        }

                    }
                }
            })(i)


        }

    }

    //价格变动的函数声明
    /**
     * 这个函数是需要在点击dd的时候以及删除mark标记的时候才需要调用
     */
    function changePriceBind (arr) {
        /**
         * 思路1：
         * 1、获取价格的标签元素
         * 2、给每一个dd标签身上默认都设置一个自定义的属性，用来记录变化的价格
         * 3、遍历arr数组，将dd元素身上的新变化的价格和已有的价格（5299）相加
         * 4、最后将计算之后的结果重新渲染到p标签中
         */

        //1、原价格标签元素
        let oldPrice = document.querySelector('#wrapper #content .contentMain #center #right .rightTop .priceWrap .priceTop .price p')

        //取出默认的价格
        let price = goodData.goodsDetail.price

        //2、遍历arr数组
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]) {
                //数据类型的强制转换
                let changeprice = Number(arr[i].getAttribute('price'))         //属性已设置
                //最终价格
                price += changeprice
            }

        }

        oldPrice.innerText = price

        //3、将变化后的价格写入到左侧标签中
        let leftprice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p')

        leftprice.innerText = '¥' + price

        //4、遍历选择搭配中所有的复选框元素，看是否有选中的
        let ipts = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input')

        let newprice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i')

        for (let j = 0; j < ipts.length; j++) {
            if (ipts[j].checked) {                //checkbox选中了
                price += Number(ipts[j].value)
            }
        }

        //5、右侧的套餐价价格重新渲染
        newprice.innerText = '¥' + price

    }


    //选择搭配中间区域复选框选中套餐价变动效果
    chooseprice()
    function chooseprice () {
        /**
         * 思路：
         * 1、先获取中间区域中所有的复选框元素
         * 2、遍历这些元素取出他们的价格，和左侧的基础价格进行累加，累加之后重新写回套餐价标签里面
         */

        //1、先获取复选框元素
        let ipts = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .middle li input')
        let leftprice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .left p')
        let newprice = document.querySelector('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .chooseBox .listWrap .right i')
        //2、遍历这些复选框
        for (let i = 0; i < ipts.length; i++) {
            ipts[i].onclick = function () {
                let oldprice = Number(leftprice.innerText.slice(1))
                for (let j = 0; j < ipts.length; j++) {
                    if (ipts[j].checked) {

                        //新的价格 = 左侧价格 + 选中复选框附加价格
                        oldprice = oldprice + Number(ipts[j].value)

                    }
                }

                //3、重新写回到套餐价标签中
                newprice.innerText = '¥' + oldprice
            }
        }
    }


    //封装一个公共的选项卡函数
    /**
     * ① 被点击的元素   tabBtns
     * ② 被切换显示的元素  tabConts
     */
    function Tab (tabBtns, tabConts) {
        for (let i = 0; i < tabBtns.length; i++) {
            tabBtns[i].index = i
            tabBtns[i].onclick = function () {
                for (let j = 0; j < tabBtns.length; j++) {
                    tabBtns[j].className = ''
                    tabConts[j].className = ''
                }
                this.className = 'active'
                tabConts[this.index].className = 'active'
            }
        }
    }

    //点击左侧选项卡
    leftTab()
    function leftTab () {
        //被点击的元素
        let h4s = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .leftAside .asideTop h4')
        //被切换显示的元素
        let divs = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .leftAside .aslideContent >div')
        //调用函数
        Tab(h4s, divs)
    }

    //点击右侧选项卡
    rightTab()
    function rightTab () {
        //被点击的元素
        let lis = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .BottomDetail .tabBtns li')
        //被切换显示的元素
        let divs = document.querySelectorAll('#wrapper #content .contentMain .goodsDetailWrap .rightDetail .BottomDetail .tabContents div')
        //调用函数
        Tab(lis, divs)
    }

    //视频播放
    let videoList = document.querySelectorAll('#wrapper .container .video-list-container .list')
    videoList.forEach(function (vid) {
        vid.onclick = function () {
            videoList.forEach(function (video) { video.classList.remove('active') })    //移除已经存在的类名
            vid.classList.add('active')
            let src = vid.querySelector('.list-video').src
            let title = vid.querySelector('.list-title').innerHTML
            document.querySelector('#wrapper .container .main-video-container .main-video').src = src
            document.querySelector('#wrapper .container .main-video-container .main-vid-title').innerHTML = title
            document.querySelector('#wrapper .container .main-video-container .main-video').play()
        }
    })
}
