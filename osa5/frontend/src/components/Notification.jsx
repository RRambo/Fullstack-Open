import PropTypes from 'prop-types'

const Notification = ({ message, classToCall }) => {
    if (message === null) {
        return null
    }

    return (
        <div className={classToCall}>
            {message}
        </div>
    )
}

Notification.propTypes = {
    classToCall: PropTypes.string.isRequired
}

export default Notification