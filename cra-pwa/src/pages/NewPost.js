import { useState } from 'react'
import { IoMdArrowBack } from 'react-icons/io'
import { Link } from 'react-router-dom'
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";
import './NewPost.css'

function NewPost() {
    const navigate = useNavigate();

    const [title, setTitle] = useState('')
    const [imagePreview, setImagePreview] = useState(null)
    const [description, setDescription] = useState('')
    const [file, setFile] = useState();

    const handleImageDrop = e => {
        e.preventDefault()
        const fileTmp = e.dataTransfer.files[0]
        setFile(fileTmp);
        setImagePreview(URL.createObjectURL(fileTmp))
    }

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            const response = await axios.post(process.env.REACT_APP_API + `/publication`, {
                picture: file,
                title: title,
                description: description
            }, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                }
            });
            navigate("/feed");
        } catch (error) {
            alert("Couldn't create this post");
        }
    }

    return (
        <div className='NewPost'>
            <div className='header'>
                <Link to='/feed' className='return-cursor'><IoMdArrowBack />Retour</Link>
                <h1>Nouveau Post</h1>
                <Link to="/profile" className="username cursor-pointer">{localStorage.getItem("username")}</Link>
            </div>
            <div className='body'>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='title'>Titre</label>
                        <input
                            type='text'
                            id='title'
                            placeholder='Titre'
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>Image</label>
                        <div
                            className='image-placeholder'
                            onDrop={handleImageDrop}
                            onDragOver={e => e.preventDefault()}
                        >
                            {!imagePreview && <p>Insérez une image</p>}
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="dropper"
                                    style={{ maxWidth: '25vw' }}
                                />
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor='description'>Description</label>
                        <input
                            type='text'
                            id='description'
                            placeholder='Description'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>
                    <button type='submit'>Envoyer</button>
                </form>
            </div>
        </div>
    )
}

export default NewPost
