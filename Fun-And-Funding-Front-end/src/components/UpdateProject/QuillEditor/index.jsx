import axios from 'axios';
import React, { useCallback, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './index.css';

const QuillEditor = ({ introductionData, setIntroductionData }) => {
    const quillRef = useRef(null);
    const [content, setContent] = useState('');

    const handleChange = (value) => {
        setIntroductionData(value);
    };

    const imageHandler = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            const formData = new FormData();
            formData.append("file", file);

            try {
                const res = await axios.post(
                    "https://localhost:7044/api/storage",
                    formData
                );
                const imageUrl = res.data;

                const quill = quillRef.current?.getEditor();
                if (quill) {
                    const range = quill.getSelection(true);
                    if (range) {
                        quill.insertEmbed(range.index, "image", imageUrl);
                        quill.setSelection(range.index + 1);
                    }
                }
            } catch (error) {
                console.error("Image upload failed:", error);
            }
        };
    }, []);

    const modules = {
        toolbar: {
            container: [
                [{ header: [3, 4, 5, 6, false] }],
                ["bold", "italic", "underline", "strike", "blockquote", "code"],
                [{ color: [] }, { background: [] }],
                [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                ["link", "image"],
                ["clean"],
            ],
            handlers: {
                image: imageHandler,
            },
        },
        clipboard: {
            matchVisual: false,
        },
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet',
        'link', 'image'
    ];

    return (
        <div className='w-[70%]'>
            <ReactQuill
                ref={quillRef}
                value={introductionData}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                theme="snow"
                className='h-fit'
            />
        </div>
    );
};

export default QuillEditor;
