import './deleteButton.css'

function DeleteButton({ onClick }) {
  return (
    <span className="delete" onClick={onClick}>X</span>
  )
}

export default DeleteButton;