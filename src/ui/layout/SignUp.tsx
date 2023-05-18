import { useRef, useState } from 'react'
import { SUBSCRIPTION_STATUS } from '../../constants/const'
import axios from "axios";
import Notify from "../elements/Notify";

const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function SignUp() {
  const form_id = "1ehAvWJrstnYdSfl_j9fT3mJIF7w4pztXrjDKfaFTZ_g"
  const formUrl = "https://docs.google.com/forms/d/" + form_id + "/formResponse"
  const email_field_name = "entry.857245557"
  const [subscriptionStatus, setSubscriptionStatus] = useState(
    JSON.parse(localStorage.getItem(SUBSCRIPTION_STATUS) || 'false'),
  )
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleSubscription = () => {
      if (emailInputRef?.current && emailRegEx.test(emailInputRef?.current.value)) {
        var params: { [k: string]: any } = {};
        params[email_field_name] = emailInputRef?.current.value
        axios.post(formUrl, null, {params: params})
            .then((response) => {
              if (response.status === 200) {
                localStorage.setItem(SUBSCRIPTION_STATUS, 'true')
                setSubscriptionStatus('true')
              }
            })
            .catch((err) => {
              Notify.warn('Could not subscribe. Try later.')
            });
      }
  }

  return (
    <div className="newsletter-form">
      {subscriptionStatus ? (
        <>Thanks for subscribing!</>
      ) : (
        <form onSubmit={handleSubscription}
          method="POST"
          action="https://docs.google.com/forms/d/{YOUR_FORM_ID_HERE}/formResponse"
        >
          <label>Be the first to know about updates on ProtVar</label>
          <div className="subscription-input">
            <input
              ref={emailInputRef}
              className="input email-input"
              type="email"
              placeholder="email@domain.com"
              name={email_field_name}
            />
            <button
              className="button subscribe-button"
              type="submit"
            >
              Subscribe
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
export default SignUp
