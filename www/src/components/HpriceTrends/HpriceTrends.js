import React, { Component } from 'react';
import {connect} from "dva";
import App from "../../containers/App.js";
import ShowHot from "./ShowHot.js";
import "./HpriceTrends.less";
import {push} from "react-router-redux";

class HpriceTrends extends Component {
    constructor(props){
        super(props);
        this.props.dispatch({"type" : "hpricetends/init"});
    }
    componentDidMount(){
        this.myChart = echarts.init(this.refs.myChart); 
        let self = this;
        $(".box").delegate("div[data-img]", "click", function () {
            let id = $(this).data("img");
            self.props.dispatch(push("/details/" + id));
        });
    }
    componentWillUnmount(){
        $(".box").off("click");
    }
	componentWillUpdate(nextProps){
        let dataAxis = ['朝阳', '西城', '海淀', '东城', '丰台', '通州'];
        let data = nextProps.pie;
        let yMax = 500;
        let dataShadow = [];
        
        for (let i = 0; i < data.length; i++) {
            dataShadow.push(yMax);
        }
        
        let option = {
            title: {
                text: '北京各区域房价分布图',
            },
            xAxis: {
                data: dataAxis,
                axisLabel: {
                    inside: true,
                    textStyle: {
                        color: '#fff'
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                z: 10
            },
            yAxis: {
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#999'
                    }
                }
            },
            dataZoom: [
                {
                    type: 'inside'
                }
            ],
            series: [
                { // For shadow
                    type: 'bar',
                    itemStyle: {
                        normal: {color: 'rgba(0,0,0,0.05)'}
                    },
                    barGap:'-100%',
                    barCategoryGap:'40%',
                    data: dataShadow,
                    animation: false
                },
                {
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#FBAB7E'},
                                    {offset: 1, color: '#F7CE68'}
                                ]
                            )
                        }
                    },
                    data: data
                }
            ]
        };
        
        let zoomSize = 6;
        let self = this;
        this.myChart.on('click', function (params) {
            self.myChart.dispatchAction({
                type: 'dataZoom',
                startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
            });
        });
        //设置option
        if (option && typeof option === "object") {
            this.myChart.setOption(option, true);
        }
	}
    render() {
        let {pie,hot} = this.props;
        return (<App>
            <div className="wrap" key="hot">
                {/* <h3>北京各区域房价分布图</h3> */}
			    <div ref="myChart" id="container" style={{"width":"700px" ,"height":"500px"}}></div>
                <div className="info">
                    <p>朝阳区租房均价<span> {pie[0]}</span>元/m²</p>
                    <p>西城区租房均价<span> {pie[1]}</span>元/m²</p>
                    <p>海淀区租房均价<span> {pie[2]}</span>元/m²</p>
                    <p>东城区租房均价<span> {pie[3]}</span>元/m²</p>
                    <p>丰台区租房均价<span> {pie[4]}</span>元/m²</p>
                    <p>通州区租房均价<span> {pie[5]}</span>元/m²</p>
                </div>
               {
                   hot && <div className="hot">
                   <h3>北京热门房源</h3>
                   <div className="box">
                       <ul>
                           {hot.filter((item1,index)=>{
                               return index < Math.ceil(hot.length/2)
                           }).map((item2,index)=>{
                               return <li key={index}><ShowHot item={item2}></ShowHot></li>
                           })}
                       </ul>
                   </div>
                   <hr />
                   <div  className="box">
                       <ul>
                           {hot.filter((item1,index)=>{
                               return index >= Math.ceil(hot.length/2)
                           }).map((item2,index)=>{
                               return <li key={index}><ShowHot item={item2}></ShowHot></li>
                           })}
                       </ul>
                   </div>
               </div>
               }
            </div>
            </App>
        )
    }
}

export default connect(
    ({hpricetends}) =>({
        "pie" : hpricetends.pie,
        "hot" : hpricetends.hot
    })
)(HpriceTrends);
