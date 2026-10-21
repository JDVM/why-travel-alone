import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { exportAccountData, deleteAccount } from '../../api/account';
import { errorMessage } from '../../api/errors';
import './YourData.scss';

// Saves a Blob as a file through a temporary link.
function saveFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

// Download a copy of your data, or delete your account.
function YourData() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [downloading, setDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    const [confirming, setConfirming] = useState(false);
    const [password, setPassword] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDownload = async () => {
        setDownloadError(null);
        setDownloading(true);
        try {
            const data = await exportAccountData();
            saveFile(data, `why-travel-alone-data-${new Date().toISOString().slice(0, 10)}.json`);
        } catch (err) {
            console.error(err);
            setDownloadError('Unable to download your data. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    const handleDelete = async (e: FormEvent) => {
        e.preventDefault();
        setDeleteError(null);
        setDeleting(true);
        try {
            await deleteAccount(password);
            logout('Your account and its data have been deleted.');
            navigate('/login', { replace: true });
        } catch (err) {
            setDeleteError(errorMessage(err, 'Unable to delete your account. Please try again.'));
            setDeleting(false);
        }
    };

    const cancelDelete = () => {
        setConfirming(false);
        setPassword('');
        setDeleteError(null);
    };

    return (
        <section className="your-data" aria-labelledby="your-data-title">
            <h2 id="your-data-title" className="your-data__title">Your data</h2>

            <p className="your-data__text">
                Download a copy of everything Why Travel Alone stores about you, as a JSON file.
            </p>
            <button
                type="button"
                className="your-data__button"
                onClick={handleDownload}
                disabled={downloading}
            >
                {downloading ? 'Preparing download…' : 'Download my data'}
            </button>
            {downloadError && <p className="your-data__error">{downloadError}</p>}

            {!confirming ? (
                <button
                    type="button"
                    className="your-data__button your-data__button--danger"
                    onClick={() => setConfirming(true)}
                >
                    Delete my account
                </button>
            ) : (
                <form className="your-data__confirm" onSubmit={handleDelete}>
                    <p className="your-data__warning">
                        This permanently deletes your account, your profile and the trips you own. Travelers on
                        your trips lose access to them. Trips you joined continue without you. This can't be undone.
                    </p>
                    <label className="your-data__label" htmlFor="delete-password">
                        Enter your password to confirm
                        <input
                            id="delete-password"
                            className="your-data__input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </label>
                    {deleteError && <p className="your-data__error">{deleteError}</p>}
                    <div className="your-data__actions">
                        <button
                            type="submit"
                            className="your-data__button your-data__button--danger"
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting…' : 'Delete my account permanently'}
                        </button>
                        <button type="button" className="your-data__link" onClick={cancelDelete} disabled={deleting}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}

export default YourData;
