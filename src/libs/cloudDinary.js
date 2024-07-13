import { v2 as cloudinary } from 'cloudinary';



cloudinary.config({ 
    cloud_name: 'dm9jo4r5c', 
    api_key: '732257284214593',
    api_secret: '7rsIroFGTG93TGsLBUxmYWrfkAs'
});

export const updateImg = async filePath => {
    return await cloudinary.uploader.upload(filePath, {
        folder: 'users',
        use_filename: true,
        unique_filename: false
    });
    
}
export const updateImgFlat = async filePath => { 
    return await cloudinary.uploader.upload(filePath, {
        folder: 'flats',
        use_filename: true,
        unique_filename: false
    });
    
}

export const deleteImg = async publicId => { 
    return await cloudinary.uploader.destroy(publicId);
    
}
