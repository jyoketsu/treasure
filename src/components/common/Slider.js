import React, { Component } from 'react';
import './Slider.css';

export default class Slider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
        }
        this.handLeftClick = this.handLeftClick.bind(this);
        this.handRightClick = this.handRightClick.bind(this);
    }

    handLeftClick() {
        this.setState((prevState) => {
            if (this.defaultOption.loop) {
                if (prevState.index - 1 < 0) {
                    return { index: this.props.children.length - this.defaultOption.perNum }
                } else {
                    return { index: prevState.index - 1 }
                }
            } else {
                if (prevState.index - 1 < 0) {
                    return null
                } else {
                    return { index: prevState.index - 1 }
                }
            }
        })
    }

    handRightClick() {
        this.setState((prevState) => {
            if (this.defaultOption.loop) {
                if (prevState.index + 1 > this.props.children.length-this.defaultOption.perNum) {
                    return { index: 0 }
                } else {
                    return { index: prevState.index + 1 }
                }
            } else {
                if (prevState.index + 1 > this.props.children.length-this.defaultOption.perNum) {
                    return null
                } else {
                    return { index: prevState.index + 1 }
                }
            }
        })
    }

    render() {
        this.defaultOption = {
            perNum: 3,
            loop: true,
            children:[],
        }
        Object.assign(this.defaultOption, this.props);
        const { children, perNum } = this.defaultOption;
        let contentsStyles = {
            width: `${100 * (children.length / perNum)}%`,
            transform: `translateX(${-1 * this.state.index * (100 / children.length)}%)`,
        }
        return (
            <div className="slider">
                <div className="slider-arrows">
                    <button className="arrow-left" onClick={this.handLeftClick}></button>
                    <button className="arrow-right" onClick={this.handRightClick}></button>
                </div>
                <div className="slider-inner">
                    <div className="slider-contents" style={contentsStyles}>{children}</div>
                </div>
            </div>
        );
    }
}