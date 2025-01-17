import React, { useRef, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
const MilestoneQuill = ({ value, onChange }) => {
    const quillRef = useRef(null);

    // Image handler for uploading and embedding images
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
              quill.setSelection(range.index + 1); // Move cursor after image
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
      <ReactQuill
        value={value}
        onChange={onChange}
        theme="snow"
        ref={quillRef}
        modules={modules}
        formats={formats}
      />
    );
}

export default MilestoneQuill