import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const QuillEditor = ({ introductionData, setIntroductionData }) => {
  const [content, setContent] = useState('');

  const handleChange = (value) => {
    setIntroductionData(value);
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch('https://api.example.com/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const imageUrl = data.url;

      const range = this.quill.getSelection();
      this.quill.insertEmbed(range.index, 'image', imageUrl);
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link', 'image'],
      ],
      handlers: {
        // image: imageHandler,
      },
    },
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <div className='px-5 pb-5'>
      <ReactQuill
        value={introductionData}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        theme="snow"
        className='h-[20rem]'
      />
    </div>

  );
};

export default QuillEditor;
