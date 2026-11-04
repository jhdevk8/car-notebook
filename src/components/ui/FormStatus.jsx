export default function FormStatus({ error, message }) {
  if (error) {
    return (
      <p className="text-[0.9rem] text-danger" role="alert">
        {error}
      </p>
    );
  }

  if (message) {
    return (
      <p className="text-[0.9rem] text-success" role="status">
        {message}
      </p>
    );
  }

  return null;
}
