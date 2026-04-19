import { useState } from 'react'
import axios from "axios";
import Notify from "../elements/Notify";
import {emailValidate} from "../../utills/Validator";
import {useStorage} from "../../context/StorageContext";

function Subscribe() {
  const [email, setEmail] = useState("");
  const form_id = "1ehAvWJrstnYdSfl_j9fT3mJIF7w4pztXrjDKfaFTZ_g"
  const formUrl = "https://docs.google.com/forms/d/" + form_id + "/formResponse"
  const email_field_name = "entry.857245557"
  const { getUserState, setUserState } = useStorage()
  const [subscribed, setSubscribed] = useState<boolean>(() => getUserState().subscribed)

  const markSubscribed = () => {
    setUserState({ subscribed: true })
    setSubscribed(true)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email) return
    const err = emailValidate(email)
    if (err) { Notify.err(err); return }

    const params: { [k: string]: any } = {}
    params[email_field_name] = email
    axios.post(formUrl, null, { params })
      .then((response) => {
        if (response.status === 200) markSubscribed()
      })
      .catch(() => {
        // Google Forms blocks CORS so a network error here is expected — the POST
        // still reaches the form. Mark as subscribed so the user isn't re-prompted.
        markSubscribed()
      })
  }

  return (
    <div className="newsletter-form">
      {subscribed ? (
        <>
          Thanks for subscribing!{' '}
          <button
            className="subscribe-again-btn"
            onClick={() => setSubscribed(false)}
          >
            Subscribe again
          </button>
        </>
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
            <button className="subscribe-button" type="submit">
              Subscribe
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default Subscribe
