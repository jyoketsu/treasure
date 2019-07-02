import React, { Component } from 'react';
import './Empty.css';
class Empty extends Component {
   
    render() {
       
        return (
           
            <div className="empty"><span className="empty_img"><img src='./image/empty.png' alt='' /></span><p>暂无相关内容</p> </div>
          
        );
    }
}
export default (Empty);