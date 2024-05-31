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

export default Notification