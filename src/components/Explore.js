import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Explore.css';
import { getExplore } from '../actions/app';

const mapStateToProps = state => ({
    exploreData: state.explore.exploreData,
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
            </div> 
            </div>
        );
    };
}


export default connect(
    mapStateToProps,
    { getExplore,},
)(Explore);