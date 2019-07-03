import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon,Radio } from 'antd';
import './Explore.css';
import api from '../services/Api';
import Empty from './common/Empty';
// import ClickOutside from './common/ClickOutside';
import { getExplore,getExploreHot } from '../actions/app';

const RadioGroup = Radio.Group;

const mapStateToProps = state => ({
    exploreData: state.explore.exploreData,
});

const mapStateToPropsSearch = state => ({   
    exploreHot:state.explore.exploreHot
});

const colorobj=[
    {
        'color':['#F29796','#5B92FA','#8BC63A','#F5A623','#D96BF0','#E45A5A','#1BCEA6','#017057'],        
    },
    {
        'color':['#256ABE','#529C00','#CA1917','#BC7705','#D96BF0','#A116BE','#017057'],       
    }, 
    {
        'color':['#529C00','#A40909','#BC7705','#D96BF0','#A116BE','#017057'],
    }  
];
var activeNode = null;
class Explore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            zoomwidth:window.innerWidth,
            zoomHeight: window.innerHeight, 
            currentNode:'',
            selectedAvatar:'',
            selectedName:'',  
                 
        };
    }
    createZoomCharts(result,initialNodes){    
        let self=this;      
        let NetChart = window.NetChart;
        var netChart = new NetChart({
            'container': 'personConnectionMap',
            'data':{
                preloaded: result,
                preloadNodeLinks: true,               
            },
            area: {
                paddingTop: 100,
                paddingLeft: 40,
                paddingRight: 40,
                paddingBottom: 40
            },
            navigation: {
                mode: "focusnodes",
                initialNodes: [
                    initialNodes
                ],
                focusNodeExpansionRadius:window.innerWidth > 768 ? 2 :1,
                focusNodeTailExpansionRadius: 0.8,
                numberOfFocusNodes:5
            },
            toolbar: {
                enabled: false,              
            },
            style: {
                'node': {
                    'display': 'image',
                    'lineWidth': 2,
                    'lineColor': 'rgba(255,255,255,0)',
                    'imageCropping': true,                                    
                },               
                'nodeLabel':{                  
                    textStyle:{font:'10px Arial'},      
                },
                'nodeHovered': {
                    'fillColor': 'white',
                    'shadowColor': '#419a00',
                    'shadowOffsetY': 2
                },
                'linkHovered': {
                    'fillColor': '#419a00',
                    'shadowColor': 'none'
                },
                nodeDetailMinSize: 20,               
                nodeStyleFunction: function(node) {                   
                    self.nodeStyle(node);                                
                },
                linkStyleFunction: function(link) { 
                    link.fillColor = colorobj[link.data.mainType].color[link.data.type];
                    link.label = link.data.name ;                    
                    link.labelStyle.textStyle.fillColor = '#fff';
                    link.labelStyle.padding = 3;
                    link.labelStyle.textStyle.font ="12px Arial";                 
                    link.labelStyle.backgroundStyle.fillColor = colorobj[link.data.mainType].color[link.data.type];             
                    link.labelStyle.backgroundStyle.lineColor = 'rgba(0,0,0,0)';
                    link.toDecoration = 'arrow';
                    link.labelStyle.rotateWithLink= true; //关系label方向顺着线条方向摆放                
                    if (link.hovered) {                       
                        link.radius = 3;                        
                    } else{
                        link.radius = 2;
                    } 
                }
            },
            interaction: {
                resizing: {
                    enabled: false
                },
                selection: {
                    lockNodesOnMove: false
                },
                rotation: {fingers: true}               
            },
            layout: {
                nodeSpacing: 20,
                aspectRatio: true,               
            },           
            nodeMenu: {
                enabled: false,
                showData: false,               
            },
            events: {
                onClick:function(event,args){
                    console.log('event',event);
                    var selectedNodes = netChart.selection();                   
                    var currentNode = selectedNodes[0];
                    self.setState({currentNode:currentNode});                                 
                    if (!event.ctrlKey && !event.shiftKey && args.clickNode) {                                                                  
                        netChart.clearFocus();
                        netChart.addFocusNode(event.clickNode);                       
                        window.localStorage.setItem('NODETYPE',event.clickNode.data.nodeType);
                        self.props.getExplore(currentNode.label, currentNode.id);
                        // if(args.clickNode.dataLinks.length < 3){
                        //     self.props.getCircleDataSearch(currentNode.label, currentNode.id);   
                        // }
                        // self.props.showCentralPerson(false);
                        event.preventDefault();                    }
                    // netChart.updateSettings({ area: { height: Math.max(100, window.innerHeight) } });                    
                },
                onDoubleClick:function(event){
                    if (event.clickNode) {
                        console.log('event',event.clickNode.data);                     
                        self.props.getZoomDatas(event.clickNode.data);                       
                    }
                },              
            },
            auras: {
                cellSize: 10,
                overlap: true,
                enabled: true,
                defaultStyle: {
                    showInLegend: true,
                    shadowBlur: 35
                },              
                style: {
                    "Crime": {
                        fillColor: "rgba(47,195,47,0.3)"
                    },
                    "Documentary": {
                        fillColor: "rgba(234,180,4,0.3)"
                    },
                  
                }
            },                       
        });              
    }
  
    nodeStyle(node) {
        // console.log(node); 
        node.radius = node.focused ? 45 : Math.max(node.relevance * 10, 35);          
        if (node.hovered) node.radius = 55;           
        node.items = [];
        node.display = "image";           
        node.imageCropping = "crop";
        node.label = node.data.name;
        node.labelStyle.padding =3;       
        node.labelStyle.textStyle.fillColor = "white";       
        node.labelStyle.backgroundStyle.fillColor = "rgba(255,255,255,.6)";
        node.labelStyle.backgroundStyle.lineWidth = 1;
        node.labelStyle.backgroundStyle.lineColor = "rgba(255,255,255,0)";      
        // node.image = node.data.img ? node.data.img : (node.data.nodeType == 1 ? 'images/icon-object.svg':'images/ava.png');
        node.image = node.data.img ? node.data.img :(node.data.nodeType === 1 ? 'images/icon-object.svg':(node.data.gender && node.data.gender === '1' ? 'images/ava-girl.svg':'images/ava.png'));        
        if (node === activeNode) { //move label up to not intersect with pie chart
            node.label = "";
            node.items.push({
                text: node.data.name,
                px: 0, py: 1, x: 0, y: -20,
                textStyle: {fillColor: "#fff"}, backgroundStyle: {fillColor: "rgba(0,0,0,0.7)"},padding:3
            });
        } else {
            node.label = node.data.name;
        }
      
        if (node.focused && node.selected) {
            node.label = node.data.name;
        }
        return node;
    } 
    handelzoomData(result,id){                   
        let linkdata;
        let count=1;      
        if(result.links.length){
            linkdata = result.links;    
            linkdata[0].id='1';
            //遍历所有关系，依次赋值id为不一样的count，目的保证 a->b 与 a->b 使用相同的id，界面上不出现两条线 
            for(var i = 1;i<linkdata.length;i++){
                //依次遍历前面的节点            
                for(var j = 0;j<i;j++){
                    if  ((linkdata[i].from===linkdata[j].from && linkdata[i].to===linkdata[j].to )|| 
                            (linkdata[i].from===linkdata[j].to && linkdata[i].to===linkdata[j].from )) {
                        //相同关系
                        linkdata[i].id=(linkdata[j].id).toString();                   
                        break;
                    }
                }
                if (j===i) {
                    count++;
                    linkdata[i].id=count.toString();               
                }             
            }
        }       
        this.createZoomCharts(result,id); 
    }
    componentDidMount() {
        let that = this;
        window.addEventListener('resize', () => {
            that.setState({
                zoomwidth:window.innerWidth,
                zoomHeight: window.innerHeight,
            });           
        });
        that.props.getExplore('胡适','sg_542692');            
    }
    componentWillReceiveProps(nextProps) {
        console.log('exploreData1',nextProps.exploreData);
        if(nextProps.exploreData){
            this.handelzoomData({nodes:nextProps.exploreData.nodes,links:nextProps.exploreData.links},nextProps.exploreData.nodes[0].id);
            let avatar = '';
            avatar = nextProps.exploreData.nodes[0].img ? nextProps.exploreData.nodes[0].img : nextProps.exploreData.nodes[0].nodeType === 1 ? 'images/icon-object.svg' :(nextProps.exploreData.nodes[0].gender && nextProps.exploreData.nodes[0].gender === '1' ? 'images/ava-girl.svg':'images/ava.png');
            this.setState({selectedName:nextProps.exploreData.nodes[0].name,selectedAvatar:avatar});
        }
    }
    render() {
        console.log('exploreData',this.props.exploreData);
        const {selectedAvatar,selectedName,zoomwidth,zoomHeight} = this.state;
        return (
            <div
                className="app-content explore"
                style={{
                    minHeight: `${window.innerHeight}px`
                }}
            >
            <div>                     
                <div id="personConnectionMap" style={{ width:zoomwidth,height: zoomHeight,background:'rgba(0,0,0,.9)' }}></div>
                <div className="zoomRightbottom" >
                    <img src={selectedAvatar} alt='' />
                    <span>{selectedName}</span>
                </div>
                <Search />               
            </div> 
            </div>
        );
    };
}

class ExploreSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {            
            keyword: '',
            websites:[],              
            page: 1,             
            pageCount: 0,
            noperson: false, 
            loadings:false, 
            searchState: false,
            isSearch:false,  
            isHot:false,
            isNearby:false,  
            isSet:false,  
            websiteIndex:0,
            sex:0,      
        }
    }
    handleChangekeyword(e){ //input change
        this.setState({ noperson:false,websites:[] });      
        this.setState({ keyword: e.target.value.replace(/^\s+$/g, ''),isHot:false,isNearby:false });
    }
    handleSendlistAjax(e) { //搜索Ennter 
        if (!e.target.value) {
            return false;
        }      
        clearTimeout(this.timer);
        if (e.keyCode === 13) {
            this.timer = setTimeout(() => { 
                this.getexploreSearchlist(1,true);              
            }, 300);          
        }
    }
    async getexploreSearchlist(page, loadState){ //搜索列表
        const { websites, keyword } = this.state;               
        this.setState({ loadings: true,isSearch:true });
        let website = {};       
        let res = await api.explore.exploreSearchlist(keyword,0,page,10);
        console.log('search', res);
        if (res.msg === 'OK') {           
            if(res.result.persons){
                if(loadState){
                    website = websites.concat(res.result.persons);
                }  else{
                    website = [].concat(res.result.persons);
                }
            }
            this.setState({
                loadings: false, websites: website, pageCount: Math.ceil(res.total / 10), page: page,
                noperson: res.result.persons && res.result.persons.length ? false : true
            });
        }
    }
    loadMoreIndexDatas() { //加载更多
        let { page } = this.state;
        this.getexploreSearchlist( page + 1, true);      
    }
    async clickExploreBtn(type){ //切换按钮
        const { isSearch, isHot, isNearby } = this.state; 
        switch (type) {
            case 'search':
                if (this.state.keyword) {                  
                    clearTimeout(this.timer);
                    this.timer = setTimeout(() => {                       
                    }, 300);                   
                    this.setState({isSearch:true,isHot:false,isNearby:false,isSet:false});                 
                } else {
                    this.setState({isSearch:!isSearch,isHot:false,isNearby:false,isSet:false});
                }
                break;
            case 'hot':                    
                this.setState({isSearch:false,isHot:!isHot,isNearby:false,keyword:'',isSet:false});  
                this.props.getExploreHot();                        
                break;
            case 'nearby':
                this.setState({isSearch:false,isHot:false,isNearby:!isNearby}); 
                break;
            default:
                break;
        }       
    }
    handleChangeWebsite(e){
        this.setState({websiteIndex:e.target.value});
    }
    handleChangeSexType(e){
        this.setState({sex:e.target.value});        
    }
    showNearbySet(){ //是否设置附近的人
        this.setState({isSet:!this.state.isSet});
    }
    setSurebtn(){
        this.setState({isSet:false});
    }
    render() {
        const {isSearch,isHot,isNearby,keyword,websites,page,pageCount,loadings,noperson,isSet,websiteIndex,sex} = this.state;
        const {exploreHot} = this.props;
        console.log('exploreHot',exploreHot);
        return (
            <div className="head-top-add">
                <div className="explore-extends">
                   <span className="explore-search">
                       <input type="text" className="srch_text" value={this.state.keyword}
                                placeholder="请输入关键字"
                                onChange={(e) => this.handleChangekeyword(e)}  
                                onKeyUp={(e) => this.handleSendlistAjax(e)}                                                             
                            />
                        <i className={'explore-search-icon ' + (isSearch ? 'on' : '')}
                           onClick={this.clickExploreBtn.bind(this,'search')}></i>
                    </span>
                    <ul className="explore-btn">
                         <li className={'explore-common-btn explore-hot ' + (isHot ? 'on' : '')}
                              onClick={this.clickExploreBtn.bind(this,'hot')}></li>
                         <li className={'explore-common-btn explore-nearby ' + (isNearby ? 'on' : '')}
                              onClick={this.clickExploreBtn.bind(this,'nearby')}></li>
                    </ul> 
                          
                    <React.Fragment>
                    {
                            isSearch && keyword ?
                            <div className="explore-search-list">
                                {
                                    loadings ?
                                        <div className="loading" style={{ paddingBottom: '50%' }}>
                                            <Icon type="loading" style={{ fontSize: 48 }} spin />
                                        </div> :
                                        <React.Fragment>
                                            {
                                                websites && websites.length ?
                                                    <React.Fragment>
                                                        <ul className="scrollbar">
                                                            {
                                                                websites.map((item, key) => {
                                                                    return (
                                                                        <li key={key} onClick={(e) => this.handleClickSearchList(e, 0, item.id, item.name)}>                                                                      
                                                                            
                                                                            {
                                                                                item.img && item.img !== '' ?
                                                                                    <span className="explore-search-ava" style={{ backgroundImage: 'url(' + item.img + ')',  backgroundSize: 'cover', }}></span> :
                                                                                    <span className="explore-search-ava" style={{ backgroundImage: 'url(/image/ava.png)',backgroundSize: 'cover' }}></span>
                                                                            }                                                                             
                                                                            <p className="explore-search-name">{item.name}</p>                                                                           
                                                                        </li>
                                                                    );
                                                                })
                                                            }
                                                        </ul>
                                                        {page < pageCount ? <div className="loadMore" style={{  }} 
                                                           onClick={() => this.loadMoreIndexDatas()}><span>更多 >></span></div> : null}
                                                    </React.Fragment> : null

                                            }
                                            {noperson ? <div style={{ paddingBottom: '20px',textAlign:'center' }}><Empty /></div> : null}
                                        </React.Fragment>
                                }                               
                            </div>:null
                        }
                    </React.Fragment>
                    <React.Fragment>
                    {
                        isHot ?
                        <div className="explore-search-list">                               
                            <React.Fragment>
                                {
                                    exploreHot ?
                                        <ul className="scrollbar searchHot">
                                            <li><span>热门站点</span><span>换一批</span></li>
                                            {
                                                exploreHot.person && exploreHot.person.length ?
                                                exploreHot.person.map((item, key) => {
                                                        return (
                                                            <li key={key}  style={{ lineHeight: '1' }}>                                                               
                                                                 {
                                                                    item.img && item.img !== '' ?
                                                                        <span className="explore-search-ava" style={{ backgroundImage: 'url(' + item.img + ')',  backgroundSize: 'cover', }}></span> :
                                                                        <span className="explore-search-ava" style={{ backgroundImage: 'url(/image/ava.png)',backgroundSize: 'cover' }}></span>
                                                                 }  
                                                                <p className="explore-search-name">{item.name}</p> 
                                                            </li>
                                                        );
                                                    }) : <li className="indexNoData">暂未有热门数据</li>
                                            }
                                        </ul> :
                                        <div className="loading" style={{ marginTop: '10%', paddingBottom: '50px' }}>
                                            <Icon type="loading" style={{ fontSize: 32 }} spin />
                                        </div>
                                }
                            </React.Fragment>
                                                            
                        </div>:null
                        }
                    </React.Fragment>
                    <React.Fragment>
                    {
                        isNearby ?
                        <div className="explore-search-list">                               
                            <React.Fragment>                                
                                <ul className="scrollbar searchHot nearlist">
                                    <li>
                                        <span>测试的附近</span>
                                        <span onClick={()=>this.showNearbySet()}>设置</span>
                                        
                                    </li>
                                    {
                                        [{name:'摄影大店袋综合事务',range:'100米'},{name:'中国吉利汽车家谱馆集团',range:'500米'}].map((item,index)=>{
                                            return (
                                                <li key={index} style={{ lineHeight: '1' }}>                                                   
                                                    <span className="explore-search-ava" 
                                                        style={{ backgroundImage: 'url(/image/ava.png)',backgroundSize: 'cover' }}>
                                                    </span>                                                                                                  
                                                    <p className="explore-search-name">{item.name}</p>
                                                    <p className="explore-search-range">{item.range}</p> 
                                                </li>
                                            )
                                        })
                                    }       
                                  }
                                </ul>
                            
                            </React.Fragment>
                            {
                                isSet ?
                            <div className="setbox">
                                <div className="explore-form">
                                    <div className="form-item">
                                        <p>全站</p>
                                        <RadioGroup onChange={(e) => this.handleChangeWebsite(e)} value={websiteIndex}>
                                            <Radio value={0}>全部</Radio>
                                            <Radio value={1}>用户</Radio> 
                                            <Radio value={2}>其他对象</Radio>                                  
                                        </RadioGroup>
                                    </div>
                                    <div className="form-item">
                                        <p>性别</p>
                                        <RadioGroup onChange={(e) => this.handleChangeSexType(e)} value={sex}>
                                            <Radio value={0}>全部</Radio>
                                            <Radio value={1}>男</Radio> 
                                            <Radio value={2}>女</Radio>                                  
                                        </RadioGroup>
                                    </div>
                                    <div className="setbtn" onClick={()=>this.setSurebtn()}>确定</div>
                                </div>
                            </div> :null
                            }                                 
                        </div>:null
                        }
                    </React.Fragment>
                    
                   
                </div>           
            </div>
        );
    }

    componentDidMount() {
       
    }

    componentDidUpdate(prevProps) {
       
    }
}


export default connect(
    mapStateToProps,
    { getExplore},
)(Explore);

const Search = connect(
    mapStateToPropsSearch,
    { getExploreHot},
)(ExploreSearch);
