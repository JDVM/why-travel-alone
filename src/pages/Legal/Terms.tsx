import { Link } from 'react-router-dom';
import { LegalPage } from './legal';

// DRAFT for legal review. Bracketed text is for the business to fill in.
function Terms() {
    return (
        <LegalPage title="Terms of Service">

            <h2>About these terms</h2>
            <p>
                These terms are an agreement between you and [Company legal name] ("we", "us") for your use of Why
                Travel Alone, a service for planning trips and finding other travelers to share them with. By
                creating an account you accept these terms and confirm you have read the{' '}
                <Link to="/privacy">Privacy Policy</Link>.
            </p>

            <h2>Who can use it</h2>
            <p>
                You must be at least [16] years old, and old enough to agree to these terms where you live. One
                account per person, in your own name.
            </p>

            <h2>Your account</h2>
            <p>
                Keep your password to yourself and tell us at [support contact email] if you think someone else is
                using your account. You can delete your account at any time from your profile page.
            </p>

            <h2>Meeting other travelers</h2>
            <p>
                Why Travel Alone helps you find people to travel with. We don't verify who travelers are, check
                their backgrounds, or take part in the trips you plan. Use your judgement before sharing plans or
                meeting anyone, meet in public places first, and tell someone you trust where you're going. You are
                responsible for your own decisions and your own travel arrangements; we don't sell or book travel.
            </p>

            <h2>Acceptable use</h2>
            <p>Don't use Why Travel Alone to:</p>
            <ul>
                <li>harass, threaten, deceive or discriminate against anyone;</li>
                <li>impersonate someone or give false information about yourself;</li>
                <li>post anything unlawful, or that you don't have the right to share;</li>
                <li>send spam or unwanted invitations, or advertise;</li>
                <li>
                    collect other travelers' information, scrape the service, or try to get around its security or
                    limits.
                </li>
            </ul>

            <h2>Your content</h2>
            <p>
                You keep ownership of what you add (your profile, trips and notes). You let us store and show it to
                the people the app shares it with, only to run the service. You can change or delete it at any time.
            </p>

            <h2>Suspension and ending</h2>
            <p>
                We may suspend or close accounts that break these terms or put other travelers at risk, and will
                tell you why unless the law or someone's safety prevents it. You can stop using the service and
                delete your account whenever you like.
            </p>

            <h2>The service</h2>
            <p>
                We work to keep Why Travel Alone available and accurate, but it is provided "as is". We may change
                or stop features, and will give reasonable notice of major changes.
            </p>

            <h2>Liability</h2>
            <p>
                To the extent the law allows, we aren't liable for indirect or consequential losses, or for the
                actions of other travelers, and our total liability to you is limited to [amount]. Nothing in these
                terms limits rights you have under consumer protection law that can't be limited by contract.
            </p>

            <h2>Changes to these terms</h2>
            <p>
                If we change these terms in a way that matters, we will tell you in the app or by email before the
                change takes effect. If you don't agree, you can delete your account.
            </p>

            <h2>Law and disputes</h2>
            <p>
                These terms are governed by the laws of [jurisdiction]. If you live in the EU, the UK or Quebec, you
                also keep the protection of the mandatory laws where you live and can bring claims in your local
                courts.
            </p>

            <h2>Contact</h2>
            <p>[Company legal name], [registered address], [support contact email].</p>
        </LegalPage>
    );
}

export default Terms;
