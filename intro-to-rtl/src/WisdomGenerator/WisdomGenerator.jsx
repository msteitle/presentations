import React, { useState } from 'react';
import getSecretMessage from './getSecretMessage';
import LoadingIndicator from './LoadingIndicator';

const WisdomGenerator = ({ children }) => {
  const [quotation, setQuotation] = useState();
  const [loading, setLoading] = useState(false);
  const onClick = (e) => {
    // simulate network request/response
    setLoading(true);
    getSecretMessage().then((result) => {
      setQuotation(result);
      setLoading(false);
    });
  };

  return (
    <div className="wisdomGenerator">
      <div className="control">
        <button
          id="trigger"
          type="button"
          disabled={loading}
          onClick={onClick}>Receive Wisdom</button>
      </div>
      
      { loading && <LoadingIndicator /> }
      { !loading && quotation &&
      <figure>
        <blockquote>
          <p className="message">{quotation.message}</p>
        </blockquote>
        <figcaption className="author">- {quotation.author}</figcaption>
      </figure>
      }
    </div>
  )
}

export default WisdomGenerator