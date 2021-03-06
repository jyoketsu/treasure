import React, { Component } from 'react';
import './TextMarquee.css';
import PropTypes from 'prop-types';

class TextMarquee extends Component {
    toScrollLeft() {
        let textWidth = this.text.offsetWidth;
        let boxWidth = this.box.offsetWidth;
        let that = this;
        if (!this.box) {
            return;
        }
        let interval = setInterval(() => {
            if (!that.box) {
                clearInterval(interval);
                return;
            }
            if (that.box.scrollLeft < textWidth - boxWidth) {
                if (that.count === 2 && that.box.scrollLeft === boxWidth) {
                    clearInterval(interval);
                }
                that.box.scrollLeft++;
            } else {
                that.count++;
                that.box.scrollLeft = 0;
            }
        }, 18);
    }

    render() {
        const { width, text, style } = this.props;
        return (
            <div
                className="text-marquee-box"
                ref={node => this.box = node}
                style={Object.assign({ width: `${width}px` }, style)}
            >
                <div className="content" ref={node => this.content = node}>
                    <p
                        className="text padding"
                        ref={node => this.text = node}
                        style={{ padding: `0 ${width}px` }}
                    >
                        {text}
                    </p>
                </div>
            </div>
        );
    };

    componentDidMount() {
        this.count = 1;
        this.toScrollLeft();
    }

}

TextMarquee.propTypes = {
    width: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    style: PropTypes.object,
}

export default TextMarquee;