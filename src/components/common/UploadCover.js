import React, { Component } from 'react';
import { FileUpload } from './Form';

class UploadStationCover extends Component {
    render() {
        const { uploadAvatarCallback, coverUrl, extParam, } = this.props;
        let style = {
            backgroundImage: `url(${coverUrl})`,
            width: '112px',
            height: '112px',
            backgroundColor: '#e7e7e7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '50%',
            backgroundSize: 'contain',
        };
        return (
            <div className="station-cover-upload" style={style}>
                <FileUpload
                    style={{
                        backgroundImage: 'url(/image/icon/add.png)',
                        display: 'block',
                        width: '50px',
                        height: '50px',
                    }}
                    maxSize={10000000}
                    extParam={extParam}
                    callback={uploadAvatarCallback} />
            </div>
        );
    }
}

export default UploadStationCover;