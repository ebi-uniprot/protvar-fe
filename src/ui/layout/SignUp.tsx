function SignUp() {
    return <div className="newsletter-form">
        <form method="POST"  action="https://docs.google.com/forms/d/{YOUR_FORM_ID_HERE}/formResponse">
            <label>Be the first to know about updates on ProtVar</label>
            <input className="input" type="email" placeholder="your_email@domain.com" name="entry.857245557" />
            <button className="button" type="submit">Subscribe</button>
        </form>
    </div>
}
export default SignUp;