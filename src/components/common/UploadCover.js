import React, { Component } from 'react';
import { FileUpload } from './Form';

class UploadStationCover extends Component {
    render() {
        const { uploadAvatarCallback, coverUrl, extParam, } = this.props;
        let style = {
            backgroundImage: `url(${coverUrl})`
        };
        return (
            <div className="station-cover-upload" style={style}>
                <FileUpload
                    style={{ backgroundImage: 'url(/image/icon/add.png)' }}
                    extParam={extParam}
                    callback={uploadAvatarCallback} />
            </div>
        );
    }
}

export default UploadStationCover;