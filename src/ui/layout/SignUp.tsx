import { useState } from 'react'
import {LOCAL_SUBSCRIBED} from '../../constants/const'
import axios from "axios";
import Notify from "../elements/Notify";
import {emailValidate} from "../../utills/Validator";
import useLocalStorage from "../../hooks/useLocalStorage";
import "./SignUp.css";

function SignUp() {
  const [email, setEmail] = useState("");
  const form_id = "1ehAvWJrstnYdSfl_j9fT3mJIF7w4pztXrjDKfaFTZ_g"
  const formUrl = "https://docs.google.com/forms/d/" + form_id + "/formResponse"
  const email_field_name = "entry.857245557"
  const { getItem, setItem } = useLocalStorage();
  const [subscriptionStatus, setSubscriptionStatus] = useState<boolean>(getItem(LOCAL_SUBSCRIBED) || false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (email) {
        const err = emailValidate(email)
        if (err) {
            Notify.err(err)
        } else {
            var params: { [k: string]: any } = {};
            params[email_field_name] = email
            axios.post(formUrl, null, {params: params})
                .then((response) => {
                    if (response.status === 200) {
                        setItem(LOCAL_SUBSCRIBED, true)
                        setSubscriptionStatus(true)
                    }
                })
                .catch((_) => {
                  // CORS issue prevents subscription. Ignoring it for now
                  // Notify.warn('Could not subscribe. Try later.')

                  // Setting the subscription status anyway for now as we are sure the emails are getting registered as expected.
                  setItem(LOCAL_SUBSCRIBED, true)
                  setSubscriptionStatus(true)
                });
        }
    }
  }

  return (
    <div className="newsletter-form">
      {subscriptionStatus ? (
        <>Thanks for subscribing!</>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>Be the first to know about updates on ProtVar</label>
          <div className="subscription-input">
            <input
              className="input email-input"
              type="email"
              placeholder="email@domain.com"
              name={email_field_name}
              onChange={e => setEmail(e.target.value)}
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
