import { Link } from 'react-router-dom';
import { LegalPage } from './legal';

// DRAFT for legal review. Describes what the app actually does today; keep it
// in step with the code (what is collected, who sees it, where it goes).
// Bracketed text is for the business to fill in.
function Privacy() {
    return (
        <LegalPage title="Privacy Policy">

            <h2>Who we are</h2>
            <p>
                Why Travel Alone ("we", "us") is run by [Company legal name], [registered address]. We are the
                controller of the personal information described here. Contact us about privacy at [privacy contact
                email]. [Name or title of the person in charge of the protection of personal information, required
                in Quebec.] [EU/UK representative, if required.]
            </p>

            <h2>What we collect</h2>
            <ul>
                <li>
                    <strong>Account:</strong> your email address and password (stored only as a secure hash), when
                    you created the account, and which version of these documents you accepted.
                </li>
                <li>
                    <strong>Traveler profile:</strong> your first and last name, travel style, preferred
                    destinations, whether you travel with kids, and any special considerations you choose to add.
                </li>
                <li>
                    <strong>Special considerations</strong> may include health information (for example a hearing
                    or mobility impairment, or a dietary need). We only store them with your explicit consent, given
                    on your profile page.
                </li>
                <li>
                    <strong>Trips:</strong> the trips you create (name, destination, length, notes, whether they're
                    kid friendly), the trips you join, and the invitations you send and receive.
                </li>
                <li>
                    <strong>Technical data:</strong> server logs of requests (time, address requested, response,
                    your account number) and reports of errors in the app (the error, your browser and operating
                    system, and your account number). These never contain your password, email or profile details.
                </li>
            </ul>
            <p>
                We don't use advertising or analytics trackers, and we don't use cookies. Your browser stores a login
                token so you stay signed in; it is removed when you log out.
            </p>

            <h2>Who can see your information</h2>
            <ul>
                <li>
                    Other signed-in travelers can see your name, travel style and preferred destinations. Nothing is
                    visible to people who aren't signed in.
                </li>
                <li>
                    Whether you travel with kids and your special considerations are visible only to you and to the
                    owners of trips you have joined.
                </li>
                <li>A trip's details and its list of travelers are visible to the people on that trip.</li>
            </ul>

            <h2>Why we use it, and our legal basis</h2>
            <ul>
                <li>
                    To provide the service you signed up for: your account, profile, trips and invitations
                    (performance of a contract).
                </li>
                <li>To store and share your special considerations as described above (your explicit consent).</li>
                <li>
                    To keep the service secure and working: logs, error reports, and limits on login attempts (our
                    legitimate interest in running a safe, reliable service).
                </li>
                <li>To meet legal obligations, where they apply.</li>
            </ul>
            <p>We don't sell or rent your personal information, or share it for targeted advertising.</p>

            <h2>Service providers</h2>
            <p>
                We use a small number of providers to run the service, under contracts that only let them use your
                information on our behalf: hosting and database ([hosting provider, region]), email delivery
                ([email provider]) and error reporting ([error reporting provider, e.g. Sentry, region]). Where they
                process information outside your country, including outside the EU/EEA or the UK, we rely on
                appropriate safeguards such as the European Commission's Standard Contractual Clauses.
            </p>

            <h2>How long we keep it</h2>
            <ul>
                <li>Your account, profile and trips: until you delete your account.</li>
                <li>Special considerations: until you clear them, which also withdraws your consent.</li>
                <li>Server logs: [30] days. Error reports: [90] days.</li>
                <li>Database backups: [30] days, after which deleted data is gone from them too.</li>
            </ul>

            <h2>Your rights</h2>
            <p>Depending on where you live, you have the right to:</p>
            <ul>
                <li>
                    <strong>get a copy</strong> of your information, in a portable format: use "Download my data" on
                    your <Link to="/profile">profile page</Link>;
                </li>
                <li>
                    <strong>correct</strong> it: edit your <Link to="/profile">profile</Link> and trips at any time;
                </li>
                <li>
                    <strong>delete</strong> it: use "Delete my account" on your profile page. This deletes your
                    account, profile and the trips you own straight away;
                </li>
                <li>
                    <strong>withdraw consent</strong> to us storing special considerations, by clearing the field;
                </li>
                <li>
                    <strong>object to or restrict</strong> some uses of your information, by contacting us.
                </li>
            </ul>
            <p>
                For anything you can't do in the app, email [privacy contact email]. We reply within one month (30
                days). You can also complain to your data protection authority, for example in the EU/EEA your
                national authority, in the UK the ICO, in Canada the Office of the Privacy Commissioner, and in
                Quebec the Commission d'accès à l'information.
            </p>

            <h2>Security</h2>
            <p>
                Connections are encrypted, passwords are stored only as strong hashes, access to trips and private
                details is checked on every request, and login attempts are rate-limited. No system is perfectly
                secure; if a breach puts your information at risk, we will notify you and the relevant authorities
                as the law requires.
            </p>

            <h2>Children</h2>
            <p>
                Why Travel Alone is not meant for anyone under [16]. We don't knowingly collect information from
                children; if you believe a child has an account, contact us and we will delete it.
            </p>

            <h2>Changes</h2>
            <p>
                If we change this policy in a way that matters, we will tell you in the app or by email before the
                change takes effect. The version date is at the top of this page.
            </p>

            <p>
                See also the <Link to="/terms">Terms of Service</Link>.
            </p>
        </LegalPage>
    );
}

export default Privacy;
