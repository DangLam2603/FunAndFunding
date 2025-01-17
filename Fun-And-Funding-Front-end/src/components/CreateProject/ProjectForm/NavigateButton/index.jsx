

const NavigateButton = ({ text, onClick, disabled }) => {

  const btnBg = `${text !== 'Back' ? 'bg-primary-green' : 'bg-gray-500'} ${disabled ? 'opacity-50' : ''}`;


  return (
    <>
      <button
        className={`inline-block ${btnBg} text-white font-bold py-2 mb-4 rounded px-[2rem] opaci ${disabled ? 'cursor-not-allowed bg-gray-200' : ''}`}
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </button >
    </>
  )
}

export default NavigateButton