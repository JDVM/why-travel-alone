import Destinations from '../Destinations/Destinations'
import './AddTrip.scss'

function AddTrip() {
    return (
        <form>
            <input type='text'placeholder='Name of trip' />
            <input type='text'placeholder='Length of Trip' />
            <div>
                <p>Destinations</p>
                <Destinations />
            </div>
            <label>Kids<input type='checkbox' placeholder='Kids Friendly' name="kids" /></label>
            <textarea placeholder='Add travel details'></textarea>
        </form>
    )
}

export default AddTrip;