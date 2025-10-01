// pages/_error.js
export default function Error({ statusCode }) {
  return (
    <div>
      <h1>Erreur {statusCode || 500}</h1>
      <p>Une erreur est survenue.</p>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};
