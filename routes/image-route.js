const express = require("express");
const {initializeApp} = require("firebase/app");
const {getDownloadURL, getStorage, ref, uploadBytesResumable} = require("firebase/storage");
const multer = require("multer");

const router = express.Router();

const firebaseConfig = {
    apiKey: "AIzaSyB-fMhVqfjAWOUGOloqu-NjA511dJ8op6E",
    authDomain: "recipe-book-cfe36.firebaseapp.com",
    projectId: "recipe-book-cfe36",
    storageBucket: "recipe-book-cfe36.appspot.com",
    messagingSenderId: "12295576110",
    appId: "1:12295576110:web:64ad3fa41b03a205d49dbf"
};

initializeApp(firebaseConfig);

const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("filename"), async (req, res) => {
    try {
        const dateTime = giveCurrentDateTime();
        const storageRef = ref(storage, `files/${req.file.originalname + "       " + dateTime}`);
        const metadata = {
            contentType: req.file.mimetype,
        };
        const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('File successfully uploaded.');
        return res.send({
            message: 'file uploaded to firebase storage',
            name: req.file.originalname,
            type: req.file.mimetype,
            downloadURL: downloadURL
        })
    } catch (error) {
        return res.status(400).send(error.message)
    }
});

const giveCurrentDateTime = () => {
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return date + ' ' + time;
}

module.exports = router;
