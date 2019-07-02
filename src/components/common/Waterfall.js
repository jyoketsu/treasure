import React, { Component } from 'react';

class Waterfall extends Component {
    render() {
        // 颗粒度，列数
        const { kernel, columnNum, width, children, } = this.props;
        this.columns = new Array(columnNum);
        let itemStyleList = [];
        for (let i = 0; i < children.length; i++) {
            const height = children[i].props.height;

            const gridColumn = (i + 1) % columnNum === 0 ? columnNum : (i + 1) % columnNum;
            const gridStart = this.columns[gridColumn - 1] === undefined ? 1 : this.columns[gridColumn - 1] + 1;
            const gridEnd = gridStart + Math.ceil(height / kernel) - 1;
            const gridRow = `${gridStart} / ${gridEnd}`;
            this.columns[gridColumn - 1] = gridEnd;
            itemStyleList.push({
                gridRow: gridRow,
                gridColumn: gridColumn,
            });
        }
        const containerHeight = Math.max(...this.columns) * 10;
        return (
            <div
                className="waterfall"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columnNum}, 1fr)`,
                    justifyItems: 'center',
                    width: width,
                    height: isNaN(containerHeight) ? 'unset' : containerHeight,
                }}
            >
                {children.map((child, index) => (
                    <div
                        key={index}
                        style={itemStyleList[index]}
                    >
                        {child}
                    </div>
                ))}
            </div>
        );
    }
}

export default Waterfall;