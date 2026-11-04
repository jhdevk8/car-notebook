export default function FormStatus({ error, message }) {
  if (error) {
    return (
      <p className="form-error" role="alert">
        {error}
      </p>
    );
  }

  if (message) {
    return (
      <p className="form-message" role="status">
        {message}
      </p>
    );
  }

  return null;
}
