import { useRef, useState } from 'react'
import { SUBSCRIPTION_STATUS } from '../../constants/const'

const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function SignUp() {
  const [subscriptionStatus, setSubscriptionStatus] = useState(
    JSON.parse(localStorage.getItem(SUBSCRIPTION_STATUS) || 'false'),
  )
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleSubscription = () => {
      if (emailInputRef?.current && emailRegEx.test(emailInputRef?.current.value)) {
        localStorage.setItem(SUBSCRIPTION_STATUS, 'true')
        setSubscriptionStatus('true')
      }
  }

  return (
    <div className="newsletter-form">
      {subscriptionStatus ? (
        <>Thanks for subscribing!</>
      ) : (
        <form
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
              name="entry.857245557"
            />
            <button
              className="button subscribe-button"
              type="submit"
              onClick={handleSubscription}
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
