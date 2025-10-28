import React from 'react'

interface Props {
    // Define any props your component needs here
    name: string;
    description: string;
    loading: boolean;
    onClose: () => void;
    onChangeName: (name: string) => void;
    onChangeDescription: (description: string) => void;
    onSubmit: () => void;
    editMode?: boolean;
}

const CategoryModal: React.FC<Props> = ({ name, description, loading, onClose, onChangeName, onChangeDescription, onSubmit, editMode }) => {
    return (
        <dialog id="category-modal" className="modal">
            <div className="modal-box">
                <form method="dialog" >
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
                </form>
                <h3 className="font-bold text-lg mb-4">{editMode ? 'Edit Category' : 'Create Category'}</h3>
                <input
                    className='input input-bordered w-full mb-4'
                    type="text"
                    placeholder="Category Name"
                    value={name}
                    onChange={(e) => onChangeName(e.target.value)}
                />
                <input
                    className='input input-bordered w-full mb-4'
                    type="text"
                    placeholder="Category Description"
                    value={description}
                    onChange={(e) => onChangeDescription(e.target.value)}
                />
                <button
                    className="btn btn-primary text-white mt-4"
                    onClick={onSubmit}
                    disabled={loading}
                >
                    {loading ? 'Saving...' : (editMode ? 'Update Category' : 'Create Category')}
                </button>

            </div>
        </dialog>
    )
}
export default CategoryModal;

//         < button className = "btn" onClick = {()=> document.getElementById('my_modal_3').showModal()
// }> open modal</ >
