import React, { Component } from 'react';

class Waterfall extends Component {
    render() {
        // 颗粒度，列数
        const { kernel, columnNum, children, } = this.props;
        this.columns = Array(columnNum).fill(0);
        let itemStyleList = [];
        for (let i = 0; i < children.length; i++) {
            // 元素高
            const height = children[i].props.height;
            // 列
            // const gridColumn = (i + 1) % columnNum === 0 ? columnNum : (i + 1) % columnNum;
            const gridColumn = this.columns.indexOf(Math.min(...this.columns)) + 1;
            // 开始行
            const gridStart = this.columns[gridColumn - 1] + 1;
            // 结束行
            const gridEnd = gridStart + Math.ceil(height / kernel) - 1;
            const gridRow = `${gridStart} / ${gridEnd}`;
            this.columns[gridColumn - 1] = gridEnd;
            itemStyleList.push({
                gridRow: gridRow,
                gridColumn: gridColumn,
            });
        }
        return (
            <div
                className="waterfall"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columnNum}, 1fr)`,
                    gridGap: '5px 10px',
                    justifyItems: 'center',
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