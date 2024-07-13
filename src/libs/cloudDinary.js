import { v2 as cloudinary } from 'cloudinary';



cloudinary.config({ 
    cloud_name: 'dm9jo4r5c', 
    api_key: '732257284214593',
    api_secret: '7rsIroFGTG93TGsLBUxmYWrfkAs'
});

export const updateImg = async filePath => {
    const { tempFilePath, user } = filePath;
    
    return await cloudinary.uploader.upload(tempFilePath, {
        folder: `users/${user}`,
        use_filename: true,
        unique_filename: false
    });
    
}
export const updateImgFlat = async filePath => { 
    const { tempFilePath,flat } = filePath;
    return await cloudinary.uploader.upload(tempFilePath, {
        folder: `flats/${flat}`,
        use_filename: true,
        unique_filename: false
    });
    
}

export const deleteImg = async publicId => { 
    return await cloudinary.uploader.destroy(publicId);
    
}
