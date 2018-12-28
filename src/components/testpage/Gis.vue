<style scoped>
    #topo{
        position: relative;
        height: 100%;
        width: 100%;
        /* background-color:#eee; */
    }
    .view {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
</style>
 <template>
    <div id="topo"></div>
</template>
<script>
    export default {
        name: 'Gis',
        data() {
            return {
                msg: 'Gis',
                dataModel:'',//数据
                graphView:'',//主视图
                rulerFrame:'',//标尺组件rulerFrame
                panelGroup:'',// 面板组
                overviewPanel:'',//鹰眼overview面板
                palettePanel:'', //添加设备palette面板
                treeViewPanel:'',//所有设备treeview面板
                coveragePanel:'',//图层treeview面板
                listViewPanel:'',//列表
                baseUrl:'../../../static/svg/',
                datalist:[
                    {path:'ch4.svg',id:1,value:0,pid:100,name:"测试模拟1",x:550,y:-350},
                    {path:'co2.svg',id:2,value:0,pid:100,name:"测试模拟2",x:0,y:-205},
                    {path:'dianyuan.svg',id:3,value:0,pid:72,name:"测试电源3",x:-110,y:-159},
                    {path:'dianyuan.svg',id:4,value:0,pid:72,name:"测试电源4",x:899,y:-150},
                    {path:'fengtong.svg',id:5,value:0,pid:25,name:"测试开关5",x:278,y:-396},
                    {path:'fengtong.svg',id:6,value:0,pid:25,name:"测试开关6",x:0,y:0},
                    {path:'laba.svg',id:7,value:0,pid:65,name:"测试广播7",x:499,y:-260},
                    {path:'people.svg',id:8,value:0,pid:64,name:"测试读卡器8",x:-846,y:-320},
                    {path:'fenzhan.svg',id:9,value:0,pid:16,name:"测试分站9",x:-458,y:-189},
                    {path:'fenzhan.svg',id:10,value:0,pid:16,name:"测试分站10",x:658,y:-268},
                    {path:'people.svg',id:11,value:0,pid:64,name:"测试读卡器11",x:658,y:-268},
                    {path:'people.svg',id:12,value:0,pid:64,name:"测试读卡器12",x:0,y:0},
                    {path:'wendu.svg',id:13,value:0,pid:100,name:"测试模拟13",x:658,y:-268},
                    {path:'o2.svg',id:14,value:0,pid:100,name:"测试模拟14",x:0,y:0},
                ],//模拟数据
                typelist:[
                    {id:1,pid:100,label:'甲烷传感器',path:'ch4.svg'},
                    {id:2,pid:100,label:'温度传感器',path:'wendu.svg'},
                    {id:3,pid:100,label:'氧气传感器',path:'o2.svg'},
                    {id:4,pid:100,label:'二氧化碳传感器',path:'co2.svg'},
                    {id:5,pid:25,label:'断馈电仪器',path:'duankuidian.svg'},
                    {id:6,pid:25,label:'风筒传感器',path:'fengtong.svg'},
                    {id:7,pid:64,label:'人员定位读卡器',path:'people.svg'},
                    {id:8,pid:65,label:'广播',path:'laba.svg'},
                    {id:9,pid:72,label:'电源箱',path:'dianyuan.svg'},
                    {id:10,pid:16,label:'分站',path:'fenzhan.svg'},
                    // {id:11,pid:900,label:'区域',path:'area.svg'},
                ],//模拟设备类型
                coverageType:[
                    {label:"所有图层"},
                    {label:"环境监测"},
                    {label:"人员定位"},
                    {label:"广播系统"}
                ]
            }
        },
        mounted(){   
            this.init();  
        },
        methods:{
            //初始化数据模型
            init(){
                let topo = document.getElementById("topo");
                this.dataModel = new ht.DataModel();
                this.graphView = new ht.graph.GraphView(this.dataModel);
                this.graphView.getView().className = "view";
                this.graphView.setLayers([0,1,2]);
                topo.appendChild(this.graphView.getView());

                this.drawRuler(topo);//绘制标尺
                this.drawOverview(topo);//绘制鹰眼
                this.drawBack();//绘制底图
                this.addSensor(topo);//添加设备操作面板
                this.drawTreeView(topo);//全部设备展示面板
                this.drawListView(topo);//列表
                this.testP();//面板管理
                this.drawNode();//绘制节点


                window.addEventListener("resize",() => {
                        this.rulerFrame.invalidate(); 
                        this.graphView.fitContent(false);
                },false)

                //测试更新节点
                setInterval(() => {
                    this.update();
                },5000)
            },
            testP(){
                var panelGroup = new ht.widget.PanelGroup({
                        hGap: 20,
                        vGap: 20
                    });
                    panelGroup.add(this.overviewPanel);
                    panelGroup.add(this.palettePanel);
                    panelGroup.add(this.treeViewPanel);
                    panelGroup.add(this.listViewPanel);
                    panelGroup.setLeftBottomPanels(this.overviewPanel, "v");
                    panelGroup.setLeftTopPanels(this.palettePanel,this.treeViewPanel,this.listViewPanel, "h");
                    // panelGroup.setLeftTopPanels( "v");
            },
            drawListView(){
                let  listView = new ht.widget.ListView(),
                vm = this;
                     //设置行高 和缩进
                     listView.setRowHeight(40); 
                     listView.setIndent(24);    
                      //设置斑马线 隔行换色
                    listView.setRowLineVisible(true);
                    listView.drawRowBackground = function(g, data, selected, x, y, width, height){
                            if(this.isSelected(data)){
                                g.fillStyle = '#87A6CB';
                            }
                            else if(this.getRowIndex(data) % 2 === 0){
                                g.fillStyle = '#F1F4F7';
                            }
                            else{
                                g.fillStyle = '#FAFAFA';
                            }
                            g.beginPath();
                            g.rect(x, y, width, height);
                            g.fill();
                    };
                    // 重载设置icon
                     listView.getIcon = function(data){
                         
                        return ht.Default.getImage(vm.baseUrl + data.a("path"))
                     };  

                    //重载设置列表文字
                    listView.getLabel = function(data){
                        return data.a("name")
                    }; 
                    //添加列表数据           
                    this.datalist.forEach(function(item){
                        var data = new ht.Data();
                        data.a(item);
                        listView.dm().add(data);
                    }); 
                    
                    //拖拽交互事件
                    let dragImage = null;
                    listView.handleDragAndDrop = function(e, state){
                        console.log(state)
                        if(state === 'prepare'){
                            var data = listView.getDataAt(e);
                            listView.sm().ss(data);
                            if(dragImage && dragImage.parentNode){
                                topo.removeChild(dragImage);
                            }
                            dragImage = ht.Default.toCanvas(vm.baseUrl + data.a("path"), 30, 30, 'uniform', data);     
                        }
                        else if(state === 'begin'){
                            console.log(state)
                            console.log(listView.getDataAt(e))
                            if(dragImage){
                                var pagePoint = ht.Default.getPagePoint(e);
                                dragImage.style.left = pagePoint.x - dragImage.width/2 -200 + 'px';
                                dragImage.style.top = pagePoint.y - dragImage.height/2  -50+ 'px';
                                topo.appendChild(dragImage);
                            }
                        }
                        else if(state === 'between'){
                            if(dragImage){
                                var pagePoint = ht.Default.getPagePoint(e);
                                dragImage.style.left = pagePoint.x - dragImage.width/2 -200+ 'px';
                                dragImage.style.top = pagePoint.y - dragImage.height/2 -50+ 'px';   
                            }
                        }
                        else{
                            if(dragImage){    
                                topo.removeChild(dragImage);
                                dragImage = null;  
                            }
                        }
                    };    
                     this.listViewPanel = new ht.widget.Panel({
                                title: "列表",
                                restoreToolTip: "列表",
                                exclusive: true,
                                width: 250,
                                contentHeight: 400,
                                narrowWhenCollapse: true,
                                resizeMode:'wh',
                                content: listView,
                                expanded: true
                    });   
                    this.listViewPanel.setPositionRelativeTo("leftTop");
                    this.listViewPanel.setPosition(0, 0);
                    topo.appendChild(this.listViewPanel.getView());           
            },
            //绘制treeview 全部设备treeview 展示 可以设置 位置
            drawTreeView(topo){
                var vm = this;
                var dataModel =  new ht.DataModel(),
                    toolbar = new ht.widget.Toolbar(),  
                    treeView = new ht.widget.TreeView(dataModel),
                    borderPane = new ht.widget.BorderPane();                
                    borderPane.setTopView(toolbar);
                    borderPane.setCenterView(treeView);   
                    this.treeViewPanel = new ht.widget.Panel({
                                title: "全部设备",
                                restoreToolTip: "全部设备",
                                exclusive: true,
                                width: 250,
                                contentHeight: 400,
                                narrowWhenCollapse: true,
                                resizeMode:'wh',
                                // content: treeView,
                                content: borderPane,
                                expanded: true,
                                //buttons: ["minimize"]
                    });   
                    this.treeViewPanel.setPositionRelativeTo("leftTop");
                    this.treeViewPanel.setPosition(0, 0);
                    topo.appendChild(this.treeViewPanel.getView());

                    //搜索栏
                    if(!ht.Default.isTouchable){ 
                        toolbar.getView().style.background = 'grey';
                    }                
                    toolbar.getSelectBackground = function(item){ return '#3D97D0'; };
                    toolbar.setItems([                    
                        {
                            id: 'text',
                            label: 'Search',
                            // icon: 'images/search.png',
                            textField: {
                                width: 120
                            }
                    }]);                                
                    toolbar.getItemById('text').element.getElement().onkeyup = function(e){
                        treeView.invalidateModel();
                    };
                    treeView.setVisibleFunc(function(data){                 
                        var text = toolbar.v('text');
                        if(text){                        
                            // return data.getName().toLowerCase().indexOf(text.toLowerCase()) >= 0;
                            return data.getName().indexOf(text +'') >= 0
                        }
                        return true;
                    });   
                let list = [
                    {pid:100,label:'模拟量',path:'ch4.svg'},
                    {pid:25,label:'开关量',path:'duankuidian.svg'},
                    {pid:16,label:'分站',path:'fenzhan.svg'},
                    {pid:64,label:'读卡器',path:'people.svg'},
                    {pid:65,label:'广播',path:'laba.svg'},
                    {pid:72,label:'电源箱',path:'dianyuan.svg'},
                    // {pid:900,label:'区域',path:'area.svg'},
                ];

                list.forEach((m1,i1) => {
                    let parent = new ht.Data(),
                        iconName = 'parent_'+ i1;
                        parent.iconName = iconName;
                        parent.setName(m1.label);
                        parent.setTag('parent');
                        dataModel.add(parent);
                        ht.Default.setImage(iconName,this.baseUrl + m1.path);

                        this.datalist.forEach((m2,i2) => {
                            if(m2.pid === m1.pid){
                                let child = new ht.Data(),
                                    position = "";
                                    if(m2.x==0 && m2.y==0){
                                        position = "(尚未配置坐标)";
                                    }else{
                                        position = `(x:${m2.x},y:${m2.y})`;
                                    }
                                    child.setTag(m2.id);
                                    child.setParent(parent);
                                    child.setName(m1.label+':'+ m2.name + position);
                                    child.setIcon(parent.iconName);
                                    child.param = {
                                        path:m1.path,
                                        name:m2.name,
                                        x:m2.x,
                                        y:m2.y
                                    }
                                    dataModel.add(child);
                            }
                        })
                })
                treeView.getView().style.background = '#FCFCFC';
                treeView.setIndent(15);
                treeView.setRowHeight(24);
                treeView.expandAll();
                treeView.setAutoHideScrollBar(false);

                    var currentDiv = null,size = 24;
                    treeView.handleDragAndDrop = function(e, state){
                        var data;
                        if(state === 'prepare'){//拖动开始之前  触发一次
                            data = treeView.getDataAt(e);
                            treeView.sm().ss(data);
                            if(data && data._tag != 'parent'){
                                if(!currentDiv){
                                    currentDiv = ht.Default.createElement('img');
                                    currentDiv.src = vm.baseUrl + data.param.path;
                                    currentDiv.style.width = size + 'px';
                                    currentDiv.style.height = size + 'px';
                                }
                                // currentDiv.style.background = data.getName();
                            }
                        }
                        else if(state === 'begin'){//拖动开始 触发一次
                            if(currentDiv){
                                var pagePoint = ht.Default.getPagePoint(e);
                                currentDiv.style.left = pagePoint.x - size/2 - 200 + 'px';
                                currentDiv.style.top = pagePoint.y - size/2  - 50 + 'px';
                                topo.appendChild(currentDiv);
                            }
                        }
                        else if(state === 'between'){//拖动进行中 触发多次 
                            if(currentDiv){
                                var pagePoint = ht.Default.getPagePoint(e);
                                currentDiv.style.left = pagePoint.x - size/2 - 200 + 'px';
                                currentDiv.style.top = pagePoint.y - size/2  - 50  + 'px';
                            }
                        }
                        else if(state === 'end'){//拖动结束
                            if(currentDiv){
                            //判断是否在当前视图内  为true则不能添加
                                let isInTreeViewPanel = ht.Default.containedInView(e, vm.treeViewPanel.getView()),
                                    isInGraphView = ht.Default.containedInView(e, vm.graphView),
                                    lp = vm.graphView.lp(e),
                                    data = treeView.getDataAt(e);
                                   if(!isInTreeViewPanel && isInGraphView){//判断当前点是否在vm.graphView区域里面
                                        // console.log(lp)
                                        console.log(data)
                                      var node = vm.dataModel.getDataByTag(data._tag);
                                          node.setPosition(Math.round(lp.x),Math.round(lp.y));
                                        //   node.setImage(paletteNode.getImage());
                                        
                                }
                                topo.removeChild(currentDiv);
                                currentDiv = null;
                            }
                        }
                    };
            },

            //添加设备面板
            addSensor(topo){
                // CreateNodeInteractor
                let CreateNodeInteractor = function (graphView) {
                    CreateNodeInteractor.superClass.constructor.call(this, graphView);                
                };
                ht.Default.def(CreateNodeInteractor, ht.graph.Interactor, {  
                    handle_mousedown: function (e) {
                        this.handle_touchstart(e);
                    },
                    handle_touchstart: function (e) {
                        this.isLeftClick = ht.Default.isLeftButton(e) && ht.Default.getTouchCount(e) === 1;                 
                    },    
                    handle_mouseup: function (e) {
                        this.handle_touchend(e);
                    },
                    handle_touchend: function (e) {
                        var graphView = this._graphView;
                        if(graphView.getDataAt(e) == null && !graphView._panning && this.isLeftClick && this._image){
                            var node = new ht.Node();
                            node.setPosition(graphView.getLogicalPoint(e));
                            node.setParent(graphView.getCurrentSubGraph());
                            node.setImage(this._image);
                            graphView.getDataModel().add(node);   
                            graphView.getSelectionModel().setSelection(node);
                            delete this.isLeftClick;            
                        }
                    }
                });
                let vm = this,
                    palette = new ht.widget.Palette(),
                    dataModel = palette.getDataModel(),//等同于palette.dm()
                    mapGroup = new ht.Group(),
                    phoneGroup = new ht.Group(),
                    routerGroup = new ht.Group(),
                    graphView = new ht.graph.GraphView(),
                    createNodeInteractor = new CreateNodeInteractor(graphView);

                    graphView.setInteractors(new ht.List([
                        new ht.graph.ScrollBarInteractor(graphView),
                        new ht.graph.SelectInteractor(graphView),
                        new ht.graph.MoveInteractor(graphView),
                        new ht.graph.DefaultInteractor(graphView),
                        new ht.graph.TouchInteractor(graphView),
                        createNodeInteractor
                    ]));

                    mapGroup.setName("系统设备");//组名称
                    mapGroup.setExpanded(true);//是否展开
                    for (var i = 1; i < 3; i++) {
                        var node = new ht.Node();
                        node.s("draggable", true);
                        node.setImage(this.baseUrl +"fenzhan.svg");
                        node.setName("分站" + i);
                        dataModel.add(node);
                        node.setParent(mapGroup);
                    }
                    dataModel.add(mapGroup);

                    phoneGroup.setName("添加模拟量");
                    // phoneGroup.setExpanded(true);//设置默认是否展开
                    for (var i = 1; i < 20; i++) {
                        var node = new ht.Node();
                        node.s("draggable", true);
                        node.setImage(this.baseUrl +"ch4.svg");
                        node.setName(i%2==0?"矿用双向风速甲烷穿管器B类":"开关量传感器");
                        dataModel.add(node);
                        node.setParent(phoneGroup);
                    }
                    dataModel.add(phoneGroup);

                    routerGroup.setName("人员定位读卡器");
                    for (var i = 1; i < 3; i++) {
                        var node = new ht.Node();
                        node.s("draggable", true);
                        node.setImage(this.baseUrl +"people.svg");
                        node.setName("读卡器" + i);
                        dataModel.add(node);
                        node.setParent(routerGroup);
                    }
                    dataModel.add(routerGroup);   
                
                    // palette.setLayout("smallicons");//小图标
                    palette.setItemImageWidth(60)
                    palette.setItemImageHeight(60)

                    this.palettePanel = new ht.widget.Panel({
		                    title: "添加设备",
		                    restoreToolTip: "添加设备",
		                    exclusive: true,
		                    width: 250,
		                    contentHeight: 400,
                            narrowWhenCollapse: true,
                            resizeMode:'wh',
                            content: palette,
                            // flowLayout:true,
		                    expanded: true,
		                    //buttons: ["minimize"]
                    });   
                    this.palettePanel.setPositionRelativeTo("rightTop");
                    this.palettePanel.setPosition(0, 0);
                    topo.appendChild(this.palettePanel.getView());
                    
                    //选中的设备类型
                    palette.sm().ms(function(e) {
                        var selectedNode = palette.sm().ld();
                        if (selectedNode) {
                            createNodeInteractor._image = selectedNode.getImage();
                        }
                    });
                    //拖动事件
                    palette.handleDragAndDrop = function(e, state) {
                        if(state === 'end') {
                            let isInPalettePanel = ht.Default.containedInView(e, vm.palettePanel), //判断是否在当前视图内  为true则不能添加
                                isInGraphView = ht.Default.containedInView(e, vm.graphView);//判断是否在图范围内 为true才能添加 否则不能添加
                                // console.log('isInPalettePanel:',isInPalettePanel);
                                // console.log('isInGraphView:',isInGraphView);
                                //判断是否在添加的位置内
                                if (!isInPalettePanel && isInGraphView) {
                                    let paletteNode = this.sm().ld(),//将要添加的设备类型的信息
                                        lp = vm.graphView.lp(e), //当前坐标
                                        node = new ht.Node();
                                        // console.log('当前坐标：',lp)
                                        // console.log(paletteNode) 
                                        node.setLayer(1);
                                        node.setWidth(26);
                                        node.setHeight(26);
                                        node.setPosition(Math.round(lp.x),Math.round(lp.y));
                                        node.setImage(paletteNode.getImage());
                                        node.setTag('newnode');	
                                        node.setName('我是新添加的设备:'+ paletteNode._name);
                                        node.s("select.color", "pink");
                                        vm.dataModel.add(node);
                                }
                        }
                       
                    };
                    // window.addEventListener("resize", function(e) {
                    //       palette.iv();
                    // });
            },

            //绘制节点
            drawNode(){   
                this.datalist.forEach((item,index) => {
                    let node = new ht.Node();
                        node.setLayer(1);
                        node.setWidth(26);
                        node.setHeight(26);
                        node.setTag(item.id);	
                        node.setName(item.name + '('+ item.value + ')');
                        node.setPosition(item.x,item.y);
                        node.s("select.color", "red");
                        // if(index>5){
                        //     node.s({
                        //         '2d.movable': false,
                        //     })
                        // }else{
                        //      node.s({
                        //         '2d.movable': true,
                        //     })
                        // }
                        this.dataModel.add(node);
                })

            },

            //更新数据
            update(){
                var count = 0
                var dm = this.graphView.dm();        	
	        	dm.each(data => {
                    count++
                    // console.log(data._tag,data)
                    // if(data._tag != null){
                    //     data.setName('测试'+ data._tag + '('+ parseInt(Math.random()*50) + ')');
                    // }
                })
                console.log(count)
            },

            //绘制鹰眼面板
            drawOverview(topo){
                var overview = new ht.graph.Overview(this.graphView);
				this.overviewPanel = new ht.widget.Panel({
		                    title: "鹰眼",
		                    restoreToolTip: "鹰眼",
		                    titleIcon:this.baseUrl + "eye.png",
		                    titleIconSize: 16,
		                    exclusive: true,
		                    width: 250,
		                    contentHeight: 120,
                            narrowWhenCollapse: true,
                            resizeMode:'h',
		                    content: overview,
		                    expanded: true,
		                    //buttons: ["minimize"]
		                });
		        this.overviewPanel.setPositionRelativeTo("rightBottom");
                this.overviewPanel.setPosition(0, 0);
                topo.appendChild(this.overviewPanel.getView());    
            },

            //绘制底图
            drawBack(){
                // 背景图
                ht.Default.setImage('backimg', {
                    width: 800,
                    height: 800,
                    comps: [  
                        {
                            type: 'image',
                            name: this.baseUrl + 'back.svg',
                            relative: true
                        }
                    ]
                }); 
                var back = new ht.Node();
                    back.setLayer(0);
                    back.setImage('backimg');
                    back.setSize(1500, 1000);
                    back.setPosition(0, 0);
                    back.s({
                        '2d.movable': false,
                        '2d.selectable': false,
                        '2d.editable': false,
                    });
                    this.dataModel.add(back);
                    this.graphView.fitData(back, false,20, false, false)//图片显示的控制
            },

            //绘制标尺 
            drawRuler(topo){
                this.rulerFrame = new ht.widget.RulerFrame(this.graphView);
                this.rulerFrame.getView().style.height = "100%";
                this.rulerFrame.getDefaultRulerConfig().guideVisible = true;
                this.rulerFrame.getDefaultRulerConfig().guideTipVisible = true;
                this.rulerFrame.getDefaultRulerConfig().guideTipBackground = "rgb(0, 173, 239)";
                this.rulerFrame.getDefaultRulerConfig().guideTipTextColor = "white";
                this.rulerFrame.getLeftRulerConfig().tickSpacingAdaptable = false;
                this.rulerFrame.getLeftRulerConfig().guideTipVisible = true;
                this.rulerFrame.getLeftRulerConfig().defaultMajorTickSpacing = 150;
                this.rulerFrame.getTopRulerConfig().guideTipVisible = true;
                this.rulerFrame.getRightRulerConfig().visible = false;
                this.rulerFrame.getBottomRulerConfig().visible = false;
                this.rulerFrame.iv();
                topo.appendChild(this.rulerFrame.getView());
            }
        },
        beforeCreate(){},
        created(){},
        beforeMount(){},
        beforeUpdate(){},
        updated(){},
        beforeDestroy(){},
        destroyed(){}
    }

</script>

